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

const { BEHAVIOR_CANONICAL } = require("./config");

/**
 * Raw behavior strings that are NOT keys of BEHAVIOR_CANONICAL (they carry a
 * "(a hand-rolled control)" suffix or are raw-specific).
 */
const RAW_WHAT_CANONICAL = {
	"slider": ["Slider"],
	"checkbox (a hand-rolled control)": ["Checkbox"],
	"radio (a hand-rolled control)": ["Radio"],
	"select (a hand-rolled control)": ["Select"],
	"clickable element (a hand-rolled button)": ["Button"],
	"contentEditable element (a hand-rolled control)": ["Textarea", "RichText"],
};

/**
 * tag -> canonical component name (rawHtml).
 */
const RAW_TAG_CANONICAL = {
	button: ["Button"],
	a: ["Link"],
	select: ["Select"],
	textarea: ["Textarea"],
	label: ["Label"],
	form: ["Form"],
	table: ["Table"],
	dialog: ["Modal", "Dialog"],
	img: ["Image", "Avatar"],
};

/**
 * input type -> canonical component name (rawHtml, tag=input).
 */
const INPUT_TYPE_CANONICAL = {
	range: ["Slider"],
	checkbox: ["Checkbox"],
	radio: ["Radio"],
	number: ["NumberInput"],
	email: ["TextField"],
	password: ["TextField"],
	search: ["TextField"],
	tel: ["TextField"],
	url: ["TextField"],
	date: ["DatePicker"],
	"datetime-local": ["DatePicker"],
	time: ["TimePicker"],
};

/**
 * Strip the "(a hand-rolled control|button)" suffix so a verbose behavior
 * string can be re-matched against BEHAVIOR_CANONICAL.
 */
function clean(what) {
	return String(what).replace(/\s*\(a hand-rolled (?:control|button)\)/, "").trim();
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
	const candidates =
		RAW_WHAT_CANONICAL[what] ||
		BEHAVIOR_CANONICAL[what] ||
		BEHAVIOR_CANONICAL[clean(what)] ||
		[clean(what) || what];
	return resolve(candidates, registry, catalogComponents) || { component: candidates[0], path: fallbackPath(componentsFolder) };
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
	if (tag === "input") {
		candidates = INPUT_TYPE_CANONICAL[type] || ["TextField", "Input"];
	} else {
		candidates = RAW_TAG_CANONICAL[tag] || [tag];
	}
	return resolve(candidates, registry, catalogComponents) || { component: candidates[0], path: fallbackPath(componentsFolder) };
}

module.exports = { forBehavior, forRaw };
