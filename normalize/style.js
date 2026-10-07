"use strict";

const { entries, keys } = require("remeda");

const LAYOUT_PROPS = new Set([
	"display",
	"position",
	"top",
	"right",
	"bottom",
	"left",
	"z-index",
	"flex-direction",
	"flex-wrap",
	"flex-grow",
	"flex-shrink",
	"flex-basis",
	"flex",
	"align-items",
	"align-self",
	"justify-content",
	"gap",
	"row-gap",
	"column-gap",
	"grid-template-columns",
	"grid-template-rows",
	"grid-template-areas",
	"grid-auto-columns",
	"grid-auto-rows",
	"grid-auto-flow",
	"grid-column",
	"grid-column-start",
	"grid-column-end",
	"grid-row",
	"grid-row-start",
	"grid-row-end",
	"grid-area",
	"grid-gap",
	"width",
	"min-width",
	"max-width",
	"height",
	"min-height",
	"max-height",
	"aspect-ratio",
	"margin",
	"margin-top",
	"margin-right",
	"margin-bottom",
	"margin-left",
	"margin-inline",
	"margin-inline-start",
	"margin-inline-end",
	"margin-block",
	"margin-block-start",
	"margin-block-end",
	"padding",
	"padding-top",
	"padding-right",
	"padding-bottom",
	"padding-left",
	"padding-inline",
	"padding-inline-start",
	"padding-inline-end",
	"padding-block",
	"padding-block-start",
	"padding-block-end",
	"overflow",
	"overflow-x",
	"overflow-y",
	"overflow-wrap",
	"text-overflow",
	"white-space",
	"font-size",
	"box-sizing",
	"object-fit",
	"object-position",
	"transform",
	"translate",
	"scale",
	"rotate",
	"order",
	"visibility",
	"float",
	"clear",
	"inset",
	"inset-block",
	"inset-block-start",
	"inset-block-end",
	"inset-inline",
	"inset-inline-start",
	"inset-inline-end",
	"contain",
	"contain-intrinsic-size",
]);

const isLayoutProp = (prop) => LAYOUT_PROPS.has(prop);

const UNRESOLVED_VALUE_RE = /var\(|url\(|@import|calc\(\s*var\(/i;

const cssTextToStyles = (text) => {
	const css = {};
	const unresolved = [];
	if (typeof text !== "string") return { css, unresolved };
	const clean = text.replace(/\/\*[\s\S]*?\*\//g, "");
	for (const decl of clean.split(";")) {
		const idx = decl.indexOf(":");
		if (idx < 0) continue;
		const prop = decl.slice(0, idx).trim();
		const value = decl.slice(idx + 1).trim();
		if (!prop || !value) continue;
		if (prop.startsWith("@") || prop.startsWith("$") || value.includes("{")) continue;
		if (!/^[a-zA-Z-]+$/.test(prop)) continue;
		const p = prop.toLowerCase();
		if (UNRESOLVED_VALUE_RE.test(value)) {
			unresolved.push(`${p}: ${value}`);
			continue;
		}
		if (!Object.prototype.hasOwnProperty.call(css, p)) css[p] = [];
		if (!css[p].includes(value)) css[p].push(value);
	}
	return { css, unresolved };
};

const camelToKebab = (name) => String(name).replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

const styleObjectToText = (obj) => {
	const parts = [];
	for (const [k, v] of entries(obj || {})) {
		if (v === undefined || v === null) continue;
		const val = Array.isArray(v) ? v.join(", ") : String(v);
		parts.push(`${camelToKebab(k)}: ${val}`);
	}
	return parts.join("; ");
};

const mergeStyles = (a, b) => {
	const out = {};
	for (const [prop, values] of entries(a)) out[prop] = [...values];
	for (const [prop, values] of entries(b)) {
		if (!Object.prototype.hasOwnProperty.call(out, prop)) {
			out[prop] = [...values];
			continue;
		}
		for (const v of values) {
			if (!out[prop].includes(v)) out[prop].push(v);
		}
	}
	return out;
};

const mergeProfiles = (a, b) => ({
	css: mergeStyles(a.css, b.css),
	unresolved: [...a.unresolved, ...b.unresolved],
});

const stylesSimilarity = (a, b, label) => {
	const A = new Set(keys(a));
	const B = new Set(keys(b));
	const inter = [...A].filter((p) => B.has(p));
	const union = A.size + B.size - inter.length;
	const score = union === 0 ? 0 : inter.length / union;
	return score;
};

module.exports = {
	LAYOUT_PROPS,
	isLayoutProp,
	cssTextToStyles,
	camelToKebab,
	styleObjectToText,
	mergeStyles,
	mergeProfiles,
	stylesSimilarity,
};
