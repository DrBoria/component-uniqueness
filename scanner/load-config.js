"use strict";

const fs = require("node:fs");
const path = require("node:path");

const RULE_NAME = "md-code/react-component-uniqueness";
const RULE_SHORT = "md-code";

const FLAT_CANDIDATES = ["eslint.config.js", "eslint.config.mjs", "eslint.config.cjs", "eslint.config.ts"];
const LEGACY_CANDIDATES = [".eslintrc.js", ".eslintrc.cjs", ".eslintrc.json", ".eslintrc.yaml", ".eslintrc.yml"];

const loadModule = (file) => {
	const src = fs.readFileSync(file, "utf8");
	if (file.endsWith(".json")) return JSON.parse(src);
	if (/^s*(exports+(default|const|let|var)|imports)/m.test(src)) {
		const { pathToFileURL } = require("node:url");
		return import(pathToFileURL(file).href).catch((esmErr) => {
			try {
				return require(file);
			} catch {
				throw esmErr;
			}
		});
	}
	return Promise.resolve().then(() => require(file));
};

const pickOptions = (v) => {
	if (v === undefined || v === null) return null;
	if (Array.isArray(v)) return v[1] && typeof v[1] === "object" ? v[1] : {};
	if (typeof v === "object") return v;
	return {};
};

const loadFlatOptions = async (file) => {
	const mod = await loadModule(file);
	const list = mod && mod.default !== undefined ? mod.default : mod;
	if (!Array.isArray(list)) return null;
	for (const entry of list) {
		if (!entry || typeof entry !== "object" || !entry.rules) continue;
		const v = entry.rules[RULE_NAME] ?? entry.rules[RULE_SHORT];
		if (v === undefined || v === null) continue;
		return pickOptions(v);
	}
	return null;
};

const loadLegacyOptions = async (file) => {
	const mod = await loadModule(file);
	const rules = (mod && mod.rules) || {};
	return pickOptions(rules[RULE_NAME] ?? rules[RULE_SHORT]);
};

const loadRuleOptions = async (dir) => {
	let d = dir;
	for (;;) {
		const standalone = path.join(d, "md-code-react-component-uniqueness.config.js");
		if (fs.existsSync(standalone)) {
			const mod = await loadModule(standalone);
			const options = mod && mod.default !== undefined ? mod.default : mod;
			if (options && typeof options === "object") return { options, source: standalone };
		}
		for (const name of FLAT_CANDIDATES) {
			const file = path.join(d, name);
			if (!fs.existsSync(file)) continue;
			try {
				const options = await loadFlatOptions(file);
				if (options) return { options, source: file };
			} catch {}
		}
		for (const name of LEGACY_CANDIDATES) {
			const file = path.join(d, name);
			if (!fs.existsSync(file)) continue;
			try {
				const options = await loadLegacyOptions(file);
				if (options) return { options, source: file };
			} catch {}
		}
		const parent = path.dirname(d);
		if (parent === d) break;
		d = parent;
	}
	return null;
};

module.exports = { loadRuleOptions, RULE_NAME };
