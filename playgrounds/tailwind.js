"use strict";

const fs = require("node:fs");
const path = require("node:path");

let compiled = null;
let failed = false;
let designSystem = null;
const ready = Promise.resolve()
	.then(() => require("tailwindcss").__unstable__loadDesignSystem("@import \"tailwindcss\";", {
		from: path.join(__dirname, "probe.css"),
		loadStylesheet: (id, base) => {
			if (id === "tailwindcss") {
				const cssPath = require.resolve("tailwindcss/index.css");
				return { path: cssPath, base: path.dirname(cssPath), content: fs.readFileSync(cssPath, "utf8") };
			}
			return { path: id, base: base || "", content: "" };
		},
	}))
	.then((ds) => {
		designSystem = ds;
	})
	.catch(() => {});

const compileOnce = async () => {
	if (compiled) return compiled;
	if (failed) return null;
	try {
		const { compile } = require("tailwindcss");
		const cssPath = require.resolve("tailwindcss/index.css");
		compiled = await compile("@import \"tailwindcss\";", {
			from: path.join(__dirname, "probe.css"),
			loadStylesheet: async (id, base) => {
				if (id === "tailwindcss") {
					return { path: cssPath, base: path.dirname(cssPath), content: fs.readFileSync(cssPath, "utf8") };
				}
				return { path: id, base: base || "", content: "" };
			},
		});
		return compiled;
	} catch {
		failed = true;
		return null;
	}
};

const extractClass = (sel) => {
	if (sel.startsWith(".")) sel = sel.slice(1);
	let name = "";
	for (let i = 0; i < sel.length; i++) {
		const ch = sel[i];
		if (ch === "\\") {
			name += sel[i + 1] ?? "";
			i++;
			continue;
		}
		if (ch === ":" || ch === " " || ch === "," || ch === "[" || ch === "{" || ch === ".") break;
		name += ch;
	}
	return name;
};

const parseCss = (css) => {
	const vars = new Map();
	for (const m of css.matchAll(/--([a-z0-9-]+)\s*:\s*([^;{}]+);/g)) vars.set(m[1], m[2].trim());
	const map = {};
	const layerIdx = css.indexOf("@layer utilities");
	const layer = layerIdx >= 0 ? css.slice(layerIdx) : css;
	const ruleRe = /([.#][^{]+)\{([^{}]*)\}/g;
	let m;
	while ((m = ruleRe.exec(layer))) {
		const sel = m[1].trim();
		if (!sel.startsWith(".")) continue;
		const cls = extractClass(sel);
		if (!cls) continue;
		const styles = {};
		for (const d of m[2].split(";")) {
			const idx = d.indexOf(":");
			if (idx < 0) continue;
			const prop = d.slice(0, idx).trim().toLowerCase();
			let value = d.slice(idx + 1).trim();
			if (!prop || !value) continue;
			if (value.startsWith("var(")) {
				const vm = value.match(/^var\(\s*--([a-z0-9-]+)/);
				if (vm && vars.has(vm[1])) value = vars.get(vm[1]);
			}
			if (!Object.prototype.hasOwnProperty.call(styles, prop)) styles[prop] = [];
			if (!styles[prop].includes(value)) styles[prop].push(value);
		}
		const pairs = Object.entries(styles).map(([prop, values]) => [prop, values.join(" ")]);
		if (pairs.length > 0) map[cls] = pairs;
	}
	return map;
};

const resolveClasses = async (classes) => {
	const list = [...new Set(classes || [])];
	const out = await compileOnce();
	if (!out) return { css: {}, unresolved: list };
	const cssText = await out.build(list);
	const map = parseCss(cssText);
	const css = {};
	const unresolved = [];
	for (const cls of list) {
		const pairs = map[cls];
		if (pairs && pairs.length > 0) {
			for (const [prop, value] of pairs) {
				css[prop] = css[prop] || [];
				if (!css[prop].includes(value)) css[prop].push(value);
			}
		} else {
			unresolved.push(cls);
		}
	}
	return { css, unresolved };
};

const parseBlock = (block, vars, styles) => {
	const ruleRe = /([.#][^{]+)\{([^{}]*)\}/g;
	let m;
	while ((m = ruleRe.exec(block))) {
		const sel = m[1].trim();
		if (!sel.startsWith(".")) continue;
		const cls = extractClass(sel);
		if (!cls) continue;
		for (const d of m[2].split(";")) {
			const idx = d.indexOf(":");
			if (idx < 0) continue;
			const prop = d.slice(0, idx).trim().toLowerCase();
			let value = d.slice(idx + 1).trim();
			if (!prop || !value) continue;
			if (value.startsWith("var(")) {
				const vm = value.match(/^var\(\s*--([a-z0-9-]+)/);
				if (vm && vars.has(vm[1])) value = vars.get(vm[1]);
			}
			if (!Object.prototype.hasOwnProperty.call(styles, cls)) styles[cls] = {};
			if (!Object.prototype.hasOwnProperty.call(styles[cls], prop)) styles[cls][prop] = [];
			if (!styles[cls][prop].includes(value)) styles[cls][prop].push(value);
		}
		const inner = m[2];
		if (inner.includes("{")) parseBlock(inner, vars, styles);
	}
};

const substituteVars = (value, depth = 0) =>
	value.replace(/var\(--([a-z0-9-]+)\)/g, (match, name) => {
		if (depth >= 4) return match;
		const resolved = designSystem.theme.resolve(null, [`--${name}`]);
		return resolved && String(resolved) !== match ? substituteVars(String(resolved), depth + 1) : match;
	});

const classStyles = (classes) => {
	const list = [...new Set(classes || [])];
	if (!designSystem) return { byClass: {}, unresolved: list };
	const out = designSystem.candidatesToCss(list);
	const vars = new Map();
	for (const m of String(out).matchAll(/--([a-z0-9-]+)\s*:\s*([^;{}]+);/g)) vars.set(m[1], m[2].trim());
	const styles = {};
	for (const b of out) if (typeof b === "string") parseBlock(b, vars, styles);
	const byClass = {};
	const unresolved = [];
	for (const cls of list) {
		const decls = styles[cls];
		if (decls && Object.keys(decls).length > 0) {
			byClass[cls] = Object.fromEntries(Object.entries(decls).map(([prop, values]) => [prop, values.map((value) => substituteVars(value))]));
		} else {
			unresolved.push(cls);
		}
	}
	return { byClass, unresolved };
};

const resolveClassesSync = (classes) => {
	const { byClass, unresolved } = classStyles(classes);
	const css = {};
	for (const decls of Object.values(byClass)) {
		for (const [prop, values] of Object.entries(decls)) {
			css[prop] = css[prop] || [];
			const joined = values.join(" ");
			if (!css[prop].includes(joined)) css[prop].push(joined);
		}
	}
	return { css, unresolved };
};

module.exports = { resolveClasses, resolveClassesSync, classStyles, ready, available: () => true };
