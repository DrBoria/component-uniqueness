"use strict";

const path = require("node:path");
const { minimatch } = require("minimatch");
const { findRepoRoot } = require("./debt");

const DEFAULT_RAW_ELEMENTS = ["button", "label", "select", "textarea", "input", "form", "table", "dialog"];

const DEFAULT_BEHAVIOR_TAGS = [
	"div",
	"main",
	"section",
	"header",
	"footer",
	"nav",
	"aside",
	"span",
	"ul",
	"li",
	"a",
	"p",
	"figure",
	"img",
];

const DEFAULT_EXCLUDE = ["**/node_modules/**", "**/dist/**", "**/build/**", ".git/**"];

const SPINNER_CLASS_RE = /(^|[\s"'`-])(spin(ning)?|loading|loader|pulse|shimmer|skeleton)([\s"'`-]|$)/i;
const MODAL_CLASS_RE = /(^|[\s"'`-])(modal|dialog|drawer|overlay|backdrop|popup)([\s"'`-]|$)/i;
const CARD_CLASS_RE = /(^|[\s"'`-])(card|paper|panel|tile)([\s"'`-]|$)/i;
const CARD_SECOND_RE = /(^|[\s"'`-])(shadow|rounded|border|elevation)([\s"'`-]|$)/i;
const CONTAINER_CLASS_RE =
	/(^|[\s"'`-])(flex|grid|col(umn)?|row|justify-|items-|gap-|space-|stack|container|wrapper|layout)([\s"'`-]|$)/i;

const ROLE_WHAT = {
	dialog: "modal / dialog",
	alertdialog: "modal / dialog",
	menu: "dropdown / menu",
	menubar: "dropdown / menu",
	menuitem: "menu item (a hand-rolled control)",
	tablist: "tabs",
	tab: "tab (a hand-rolled control)",
	slider: "slider",
	tooltip: "tooltip",
	progressbar: "progress indicator",
	alert: "alert",
	status: "live status region",
	group: "accordion / collapsible",
	switch: "switch (a hand-rolled control)",
	checkbox: "checkbox (a hand-rolled control)",
	radio: "radio (a hand-rolled control)",
	button: "button (a hand-rolled control)",
};

const RAW_BEHAVIOR_TAGS = new Set(["input", "select", "textarea", "form", "table", "dialog"]);

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

const resolveDataPath = (value, root) => {
	if (path.isAbsolute(value)) return value;
	const base = root || process.cwd();
	return path.resolve(base, value);
}

const normalizeOptions = (opts) => {
	const o = opts && typeof opts === "object" ? opts : {};
	const root = findRepoRoot(process.cwd());

	return {
		
		registry: o.registry || null,
		registryPath: resolveDataPath(o.registryPath || "reports/component-registry.json", root),

		
		catalog: o.catalog || null,
		catalogPath: resolveDataPath(o.catalogPath || "reports/component-catalog.json", root),

		
		
		
		
		includeDynamic: o.includeDynamic === true,
		dynamicCatalog: o.dynamicCatalog || null,
		dynamicCatalogPath: resolveDataPath(o.dynamicCatalogPath || "reports/component-catalog-dynamic.json", root),

		
		rawElements: new Set(o.rawElements || DEFAULT_RAW_ELEMENTS),

		
		behaviorTags: new Set(o.behaviorTags || DEFAULT_BEHAVIOR_TAGS),

		
		
		
		
		
		
		componentsFolder: normalizeFolders(o.componentsFolder || []),

		
		
		include: o.include || [],
		exclude: o.exclude || DEFAULT_EXCLUDE,

		
		debt: o.debt || null,

		
		root,
	};
}

const normalizeFolders = (folders) => {
	return (folders || []).map((f, i) => {
		const raw = f && typeof f === "object" ? f.path : f;
		let s = String(raw).trim().split(path.sep).join("/");
		while (s.startsWith("./")) s = s.slice(2);
		if (!s.endsWith("/")) s += "/";
		return s;
	});
}

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
}

const inComponentsFolder = (relPath, componentsFolder) => {
	return componentsFolder.some((d) => relPath.startsWith(d));
}

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
}

const isIgnored = (relPath, include, exclude) => {
	for (const pattern of exclude || []) {
		const m = compileMatcher(pattern);
		if (m && m(relPath)) return true;
	}
	if (include && include.length > 0) {
		return !include.some((pattern) => {
			const m = compileMatcher(pattern);
			return m ? m(relPath) : false;
		});
	}
	return false;
}

const inCanonicalDir = (relPath, dirs) => {
	return dirs.some((d) => relPath === d || relPath.startsWith(d + "/"));
}

module.exports = {
	DEFAULT_RAW_ELEMENTS,
	DEFAULT_BEHAVIOR_TAGS,
	DEFAULT_EXCLUDE,
	SPINNER_CLASS_RE,
	MODAL_CLASS_RE,
	CARD_CLASS_RE,
	CARD_SECOND_RE,
	CONTAINER_CLASS_RE,
	ROLE_WHAT,
	RAW_BEHAVIOR_TAGS,
	ACTION_ATTR_NAMES,
	normalizeOptions,
	inComponentsFolder,
	inCanonicalDir,
	isIgnored,
	folderRank,
};
