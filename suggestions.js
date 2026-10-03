"use strict";

const { kebabToPascal } = require("./scanner/matching");

const clean = (what) => {
	return String(what).replace(/\s*\(a hand-rolled (?:control|button)\)/, "").trim();
}

const candidatesFromWords = (text) => {
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

const resolve = (candidates, registry, catalogComponents) => {
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

const fallbackPath = (componentsFolder) => {
	return componentsFolder && componentsFolder.length ? componentsFolder[0] : "the canonical component packages";
}

const forBehavior = (what, registry, catalogComponents, componentsFolder) => {
	const candidates = candidatesFromWords(what);
	return resolve(candidates, registry, catalogComponents) || { component: candidates[0] || clean(what), path: fallbackPath(componentsFolder) };
}

const forRaw = (tag, type, registry, catalogComponents, componentsFolder) => {
	let candidates;
	if (tag === "input" && type) {
		candidates = [...new Set([kebabToPascal(`${type}-input`), kebabToPascal(type), "Input"])];
	} else {
		candidates = [kebabToPascal(tag)];
	}
	return resolve(candidates, registry, catalogComponents) || { component: candidates[0], path: fallbackPath(componentsFolder) };
}

module.exports = { forBehavior, forRaw };
