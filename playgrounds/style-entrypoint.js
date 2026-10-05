"use strict";

const { normalizeOptions } = require("../config.js");
const { cssTextToStyles, styleObjectToText, mergeProfiles } = require("../normalize/style.js");

const PLAYGROUNDS = {
	tailwind: () => require("./tailwind.js"),
	scss: () => require("./scss.js"),
	"styled-components": () => require("./styled-components.js"),
	styled: () => require("./styled-components.js"),
};

const cache = new Map();

const getPlayground = (styleSystem) => {
	const key = String(styleSystem || "tailwind").toLowerCase();
	if (!cache.has(key)) {
		const loader = PLAYGROUNDS[key] || PLAYGROUNDS.tailwind;
		cache.set(key, loader());
	}
	return cache.get(key);
};

const getStyleSystem = (opts) => normalizeOptions(opts).styleSystem;

const normalizeStyles = async (className, styleObj, opts, label) => {
	const pg = getPlayground(getStyleSystem(opts));
	const parts = [];
	if (typeof className === "string" && className.trim()) {
		const tw = await pg.resolveClasses(className.trim().split(/\s+/));
		parts.push(tw);
	}
	if (styleObj && typeof styleObj === "object") {
		parts.push(cssTextToStyles(styleObjectToText(styleObj)));
	}
	if (parts.length === 0) return { css: {}, unresolved: [] };
	const merged = parts.reduce(mergeProfiles, { css: {}, unresolved: [] });
	return { css: merged.css, unresolved: merged.unresolved };
};

const normalizeStylesSync = (className, styleObj, opts, label) => {
	const pg = getPlayground(getStyleSystem(opts));
	const parts = [];
	if (typeof className === "string" && className.trim()) {
		const tw = pg.resolveClassesSync(className.trim().split(/\s+/));
		parts.push(tw);
	}
	if (styleObj && typeof styleObj === "object") {
		parts.push(cssTextToStyles(styleObjectToText(styleObj)));
	}
	if (parts.length === 0) return { css: {}, unresolved: [] };
	const merged = parts.reduce(mergeProfiles, { css: {}, unresolved: [] });
	return { css: merged.css, unresolved: merged.unresolved };
};

const escapeClass = (cls) => cls.replace(/[^a-zA-Z0-9_-]/g, (c) => `\\${c}`);

const buildStylesheet = (classes, opts) => {
	const pg = getPlayground(getStyleSystem(opts));
	if (!pg.classStyles) return "";
	const { byClass } = pg.classStyles(classes);
	const rules = [];
	for (const [cls, decls] of Object.entries(byClass)) {
		if (cls.includes(":")) continue;
		const body = Object.entries(decls)
			.map(([prop, values]) => `${prop}:${values[values.length - 1]}`)
			.join(";");
		rules.push(`.${escapeClass(cls)}{${body}}`);
	}
	return rules.join("\n");
};

const whenReady = async (opts) => {
	const pg = getPlayground(getStyleSystem(opts));
	if (pg.ready) await pg.ready;
};

module.exports = { normalizeStyles, normalizeStylesSync, getStyleSystem, getPlayground, buildStylesheet, whenReady };
