"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { minimatch } = require("minimatch");

const DEFAULT_EXCLUDE = [
	"*.stories.*",
	"*.test.*",
	"*.spec.*",
	"*.d.ts",
	"**/__tests__/**",
];
const DEFAULT_EXTS = [".tsx", ".ts", ".jsx", ".js"];
const DEFAULT_IGNORE_DIRS = ["node_modules", "dist", "build"];
const DEFAULT_ROOT_MARKERS = [".git"];

const findRepoRoot = (startDir, markers = DEFAULT_ROOT_MARKERS) => {
	const markerSet = new Set(markers);
	let dir = path.resolve(startDir);
	for (;;) {
		if (
			fs.existsSync(path.join(dir, "package.json")) &&
			fs.readdirSync(dir).some((name) => markerSet.has(name))
		) {
			return dir;
		}
		const parent = path.dirname(dir);
		if (parent === dir) return null;
		dir = parent;
	}
};

const ACTION_ATTR_NAMES = new Set([
	"onClick",
	"onMouseDown",
	"onMouseUp",
	"onMouseEnter",
	"onMouseLeave",
	"onMouseMove",
	"onTouchStart",
	"onTouchEnd",
	"onTouchMove",
	"onFocus",
	"onBlur",
	"onChange",
	"onInput",
	"onSubmit",
	"onKeyDown",
	"onKeyUp",
	"onKeyPress",
	"onDragStart",
	"onDragEnd",
	"onDrop",
	"onDragOver",
	"onDoubleClick",
	"onContextMenu",
]);

const SUPPORTED_FRAMEWORKS = new Set(["react", "angular", "vue"]);

const resolveFramework = (f) => {
	const s = String(f || "react").trim().toLowerCase();
	return SUPPORTED_FRAMEWORKS.has(s) ? s : "react";
};

const SUPPORTED_STYLE_SYSTEMS = new Set(["tailwind", "scss", "styled-components"]);

const resolveStyleSystem = (s) => {
	const k = String(s || "tailwind").trim().toLowerCase();
	return SUPPORTED_STYLE_SYSTEMS.has(k) ? k : "tailwind";
};

const normalizeFolders = (folders) => {
	return (folders || []).map((f) => {
		const raw = f && typeof f === "object" ? f.path : f;
		let s = String(raw).trim().split(path.sep).join("/");
		while (s.startsWith("./")) s = s.slice(2);
		if (!s.endsWith("/")) s += "/";
		return s;
	});
};

const normalizeOptions = (opts) => {
	const o = opts && typeof opts === "object" ? opts : {};
	const rootMarkers = o.rootMarkers || DEFAULT_ROOT_MARKERS;
	const root = o.root || findRepoRoot(process.cwd(), rootMarkers);

	return {
		root,
		registry: o.registry || null,
		registryPath: o.registryPath || "reports/component-registry.json",
		catalog: o.catalog || null,
		catalogPath: o.catalogPath || "reports/component-catalog.json",
		includeDynamic: o.includeDynamic === true,
		dynamicCatalog: o.dynamicCatalog || null,
		dynamicCatalogPath: o.dynamicCatalogPath || "reports/component-catalog-dynamic.json",
		rawHtml: o.rawHtml === true,
		parts: o.parts === true,
		framework: resolveFramework(o.framework),
		tsconfig: typeof o.tsconfig === "string" ? o.tsconfig : null,
		styleSystem: resolveStyleSystem(o.styleSystem),
		weights: o.weights && typeof o.weights === "object" ? o.weights : null,
		thresholds: o.thresholds && typeof o.thresholds === "object" ? o.thresholds : null,
		componentsFolder: normalizeFolders(o.componentsFolder || []),
		include: o.include || [],
		exclude: o.exclude || DEFAULT_EXCLUDE,
		exts: o.exts || DEFAULT_EXTS,
		ignoreDirs: o.ignoreDirs ? [...new Set([...DEFAULT_IGNORE_DIRS, ...o.ignoreDirs])] : DEFAULT_IGNORE_DIRS,
		rootMarkers,
	};
};

const folderRank = (folders) => {
	const map = new Map();
	(folders || []).forEach((f, i) => {
		const isObj = f && typeof f === "object";
		const raw = isObj ? f.path : f;
		let s = String(raw).trim().split(path.sep).join("/");
		while (s.startsWith("./")) s = s.slice(2);
		if (!s.endsWith("/")) s += "/";
		const r = isObj && typeof f.rank === "number" ? f.rank : i;
		if (!map.has(s)) map.set(s, r);
	});
	return map;
};

const inComponentsFolder = (relPath, componentsFolder) => {
	return componentsFolder.some((d) => relPath.startsWith(d));
};

const layerOf = (relPath, componentsFolder) => {
	return componentsFolder.findIndex((d) => relPath.startsWith(d));
};

const canSeeCanon = (appPath, canonPath, componentsFolder) => {
	const appLayer = layerOf(appPath, componentsFolder);

	return appLayer < 0 || layerOf(canonPath, componentsFolder) < appLayer;
};

const inCanonicalDir = (relPath, dirs) => {
	return dirs.some((d) => relPath === d || relPath.startsWith(d + "/"));
};

const compileMatcher = (pattern) => {
	if (pattern instanceof RegExp) return (p) => pattern.test(p);
	if (typeof pattern !== "string" || pattern.length === 0) return null;
	if (pattern.startsWith("/") && pattern.endsWith("/") && pattern.length > 2) {
		try {
			const re = new RegExp(pattern.slice(1, -1));
			return (p) => re.test(p);
		} catch {
			return null;
		}
	}
	if (pattern.startsWith("^") && pattern.endsWith("$")) {
		try {
			const re = new RegExp(pattern);
			return (p) => re.test(p);
		} catch {
			return null;
		}
	}
	return (p) => minimatch(p, pattern);
};

const matchesPath = (m, relPath) => {
	if (m(relPath)) return true;
	const base = relPath.slice(relPath.lastIndexOf("/") + 1);
	return base !== relPath && m(base);
};

const isIgnored = (relPath, include, exclude) => {
	for (const pattern of exclude || []) {
		const m = compileMatcher(pattern);
		if (m && matchesPath(m, relPath)) return true;
	}
	if (include && include.length > 0) {
		return !include.some((pattern) => {
			const m = compileMatcher(pattern);
			return m ? matchesPath(m, relPath) : false;
		});
	}
	return false;
};

const RULE_NAME = "md-code/component-uniqueness";
const RULE_SHORT = "md-code";

const FLAT_CANDIDATES = ["eslint.config.js", "eslint.config.mjs", "eslint.config.cjs", "eslint.config.ts"];
const LEGACY_CANDIDATES = [".eslintrc.js", ".eslintrc.cjs", ".eslintrc.json", ".eslintrc.yaml", ".eslintrc.yml"];

const loadModule = (file) => {
	const src = fs.readFileSync(file, "utf8");
	if (file.endsWith(".json")) return Promise.resolve(JSON.parse(src));
	if (/^\s*(exports?\s+(default|const|let|var)|import\s)/m.test(src)) {
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

const isRuleKey = (key) => key === RULE_NAME || key === RULE_SHORT || key === "component-uniqueness" || key.endsWith("/component-uniqueness");

const ruleValue = (rules) => {
	for (const [key, v] of Object.entries(rules)) {
		if (!isRuleKey(key)) continue;
		if (v === undefined || v === null) continue;
		return v;
	}
	return null;
};

const loadFlatOptions = async (file) => {
	const mod = await loadModule(file);
	const list = mod && mod.default !== undefined ? mod.default : mod;
	if (!Array.isArray(list)) return null;
	for (const entry of list) {
		if (!entry || typeof entry !== "object" || !entry.rules) continue;
		const v = ruleValue(entry.rules);
		if (v === undefined || v === null) continue;
		return pickOptions(v);
	}
	return null;
};

const loadLegacyOptions = async (file) => {
	const mod = await loadModule(file);
	const v = ruleValue((mod && mod.rules) || {});
	return v === undefined || v === null ? null : pickOptions(v);
};

const loadRuleOptions = async (dir) => {
	let d = dir;
	for (;;) {
		const standalone = path.join(d, "md-code-component-uniqueness.config.js");
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

const jsonCache = new Map();

const loadJson = (absPath, label) => {
	if (jsonCache.has(absPath)) return jsonCache.get(absPath).value;

	let entry = { loaded: false, value: null, warned: false };
	try {
		const raw = fs.readFileSync(absPath, "utf8");
		const parsed = JSON.parse(raw);
		entry.value = parsed && typeof parsed === "object" ? parsed : null;
		entry.loaded = true;
	} catch (err) {
		entry.value = null;
		entry.loaded = false;
		const reason = err && err.code === "ENOENT" ? "file not found" : `could not be read/parsed (${err && err.message ? err.message : err})`;
		if (!entry.warned) {
			entry.warned = true;
			const rel = path.isAbsolute(absPath) ? absPath : path.resolve(absPath);
			console.warn(
				`[component-uniqueness] ${label} ${reason} at ${rel}. ` +
					`The ${label} is disabled for this run. ` +
					`Generate it first (see the package README) or pass it via the rule options.`
			);
		}
	}

	jsonCache.set(absPath, entry);
	return entry.value;
};

const resolveAgainst = (p, root) => (path.isAbsolute(p) ? p : path.join(root, p));

const loadRegistry = (config) => {
	if (config.registry) return config.registry;
	return loadJson(resolveAgainst(config.registryPath, config.root), "component registry");
};

const loadCatalog = (config) => {
	if (config.catalog) return config.catalog;
	return loadJson(resolveAgainst(config.catalogPath, config.root), "component catalog");
};

const loadDynamicCatalog = (config) => {
	if (config.dynamicCatalog) return config.dynamicCatalog;
	return loadJson(resolveAgainst(config.dynamicCatalogPath, config.root), "dynamic component catalog");
};

module.exports = {
	DEFAULT_EXCLUDE,
	DEFAULT_EXTS,
	DEFAULT_IGNORE_DIRS,
	DEFAULT_ROOT_MARKERS,
	ACTION_ATTR_NAMES,
	findRepoRoot,
	normalizeOptions,
	normalizeFolders,
	inComponentsFolder,
	canSeeCanon,
	inCanonicalDir,
	isIgnored,
	folderRank,
	loadRuleOptions,
	RULE_NAME,
	RULE_SHORT,
	loadJson,
	resolveAgainst,
	loadRegistry,
	loadCatalog,
	loadDynamicCatalog,
};
