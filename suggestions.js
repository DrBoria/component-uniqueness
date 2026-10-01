"use strict";

/**
 * suggestions.js
 *
 * Deterministic, table-driven suggestions for every finding. Given the
 * behavior string (`what`) or the raw tag+type, resolve the canonical
 * component name + path the developer should use instead. No LLM — pure
 * data from the component registry (reports/component-registry.json) and the
 * component catalog (reports/component-catalog.json).
 *
 * Every resolver returns { component, path } — always defined, so the report
 * message can always say "use `X` from `path`".
 */

const { kebabToPascal } = require("./scanner/matching");

/**
 * Strip the "(a hand-rolled control|button)" suffix and punctuation so a
 * verbose behavior string yields clean words.
 */
function clean(what) {
	return String(what).replace(/\s*\(a hand-rolled (?:control|button)\)/, "").trim();
}

/**
 * Candidate component names derived from a behavior string: the PascalCase of
 * each meaningful word, longest first. No component names are enumerated — the
 * registry / catalog decides which candidate actually exists.
 */
function candidatesFromWords(text) {
	const words = clean(text)
		.toLowerCase()
		.split(/[^a-z0-9]+/)
		.filter((w) => w && w !== "a" && w !== "hand" && w !== "rolled" && w !== "element" && w !== "indicator" && w !== "region" && w !== "control" && w !== "the" && w !== "and");
	const out = [];
	for (const w of words) out.push(kebabToPascal(w));
	if (words.length >= 2) {
		for (let i = 0; i < words.length - 1; i++) out.push(kebabToPascal(words.slice(i, i + 2).join("-")));
	}
	return [...new Set(out)];
}

/**
 * First candidate that exists in the registry (by exported name) or the
 * catalog (by component name). Returns { component, path } or null.
 */
function resolve(candidates, registry, catalogComponents) {
	for (const name of candidates) {
		const paths = registry && registry.names && registry.names[name];
		if (paths && paths.length) return { component: name, path: paths[0] };
	}
	for (const name of candidates) {
		const hit = (catalogComponents || []).find((c) => c.name === name);
		if (hit) return { component: name, path: hit.path };
	}
	return null;
}

/**
 * Fallback path when neither the registry nor the catalog knows the
 * suggested component: the first canonical component folder passed by the
 * consumer, or the generic phrase when none was configured.
 */
function fallbackPath(componentsFolder) {
	return componentsFolder && componentsFolder.length ? componentsFolder[0] : "the canonical component packages";
}

/**
 * Deterministic suggestion for a behavior finding (layoutPrimitive).
 *
 * @param {string} what the behavior string from behaviorOf / behaviorForRaw
 * @param {object} registry the component registry { names: {Name:[paths]} }
 * @param {Array} catalogComponents the catalog component signatures
 * @param {string[]} [componentsFolder] canonical folders (fallback path source)
 * @returns {{component:string, path:string}}
 */
function forBehavior(what, registry, catalogComponents, componentsFolder) {
	const candidates = candidatesFromWords(what);
	return resolve(candidates, registry, catalogComponents) || { component: candidates[0] || clean(what), path: fallbackPath(componentsFolder) };
}

/**
 * Deterministic suggestion for a rawHtml finding.
 *
 * @param {string} tag the raw tag (button, input, select, ...)
 * @param {string|undefined} type the input type (only for tag=input)
 * @param {object} registry the component registry
 * @param {Array} catalogComponents the catalog component signatures
 * @param {string[]} [componentsFolder] canonical folders (fallback path source)
 * @returns {{component:string, path:string}}
 */
function forRaw(tag, type, registry, catalogComponents, componentsFolder) {
	let candidates;
	if (tag === "input" && type) {
		candidates = [...new Set([kebabToPascal(`${type}-input`), kebabToPascal(type), "Input"])];
	} else {
		candidates = [kebabToPascal(tag)];
	}
	return resolve(candidates, registry, catalogComponents) || { component: candidates[0], path: fallbackPath(componentsFolder) };
}

module.exports = { forBehavior, forRaw };
