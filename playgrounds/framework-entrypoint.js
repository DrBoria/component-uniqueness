"use strict";

const { normalizeOptions } = require("../config.js");
const { buildStylesheet } = require("./style-entrypoint.js");
const { buildStyledResolver } = require("../normalize/style-resolver.js");

let styledResolver = null;
const withStyledResolver = (opts) => {
	if (!styledResolver) styledResolver = buildStyledResolver();
	return styledResolver ? { ...opts, styledResolver } : opts;
};

const PLAYGROUNDS = {
	react: () => require("./react.js"),
	angular: () => require("./angular.js"),
	vue: () => require("./vue.js"),
};

const cache = new Map();

const getPlayground = (framework) => {
	const key = String(framework || "react").toLowerCase();
	if (!cache.has(key)) {
		const loader = PLAYGROUNDS[key] || PLAYGROUNDS.react;
		cache.set(key, loader());
	}
	return cache.get(key);
};

const getFramework = (opts) => normalizeOptions(opts).framework;

const parseComponents = (fileAbs, canonicalNames, opts) => {
	const pg = getPlayground(getFramework(opts));
	if (!pg.available || !pg.available()) return [];
	return pg.parseComponents(fileAbs, canonicalNames, withStyledResolver(opts));
};

const parseElements = (fileAbs, canonicalNames, opts) => {
	const pg = getPlayground(getFramework(opts));
	if (!pg.available || !pg.available() || !pg.parseElements) return [];
	return pg.parseElements(fileAbs, canonicalNames, withStyledResolver(opts));
};

const parseParts = (fileAbs, canonicalNames, opts) => {
	const pg = getPlayground(getFramework(opts));
	if (!pg.available || !pg.available() || !pg.parseParts) return [];
	return pg.parseParts(fileAbs, canonicalNames, withStyledResolver(opts));
};

const resolveCss = (tree, opts) => {
	const pg = getPlayground(getFramework(opts));
	if (!pg.resolveCss) return { css: "", unresolved: [] };
	return pg.resolveCss(tree);
};

const classTokensOf = (tree, out = new Set()) => {
	if (!tree) return out;
	if (tree.className) for (const token of String(tree.className).split(/\s+/)) if (token) out.add(token);
	for (const child of tree.children || []) classTokensOf(child, out);
	return out;
};

const render = (tree, opts) => {
	const pg = getPlayground(getFramework(opts));
	if (!pg.render) return { tree: null, available: false };
	const stylesheet = buildStylesheet([...classTokensOf(tree)], opts);
	return pg.render(tree, { stylesheet });
};

const rawClassTokens = (tree) => {
	const out = new Set();
	const visit = (n) => {
		if (!n) return;
		if (typeof n.className === "string") for (const token of n.className.split(/\s+/)) if (token) out.add(token);
		for (const child of n.children || []) visit(child);
	};
	visit(tree);
	return out;
};

module.exports = {
	getPlayground,
	getFramework,
	parseComponents,
	parseElements,
	parseParts,
	resolveCss,
	render,
	rawClassTokens,
};
