"use strict";

/**
 * config.js
 *
 * The single place that knows the rule's defaults and normalizes the
 * ESLint options into a runtime config object. Every error type reads from this
 * object, so changing a default or taxonomy is a one-file edit.
 *
 * Paths are GENERIC: the registry and catalog locations are options that
 * default to the conventional reports/ files under the repository root
 * (the repo root is discovered by walking up for pnpm-workspace.yaml).
 */

const path = require("node:path");
const { minimatch } = require("minimatch");
const { findRepoRoot } = require("./debt");

/** Raw interactive / form elements that are only legal inside the canonical packages. */
const DEFAULT_RAW_ELEMENTS = ["button", "label", "select", "textarea", "input", "form", "table", "dialog"];

/** Tags eligible for the behavior error type (plain building blocks + containers). */
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

/**
 * Default file exclusions (repo-relative paths): build artifacts and
 * dependency folders are never linted by the rule.
 */
const DEFAULT_EXCLUDE = ["**/node_modules/**", "**/dist/**", "**/build/**", ".git/**"];

/** Class tokens that turn a plain element into a specific hand-rolled component (shadcn / MUI / antd taxonomy). */
const SPINNER_CLASS_RE = /(^|[\s"'`-])(spin(ning)?|loading|loader|pulse|shimmer|skeleton)([\s"'`-]|$)/i;
const MODAL_CLASS_RE = /(^|[\s"'`-])(modal|dialog|drawer|overlay|backdrop|popup)([\s"'`-]|$)/i;
const CARD_CLASS_RE = /(^|[\s"'`-])(card|paper|panel|tile)([\s"'`-]|$)/i;
const CARD_SECOND_RE = /(^|[\s"'`-])(shadow|rounded|border|elevation)([\s"'`-]|$)/i;
const CONTAINER_CLASS_RE =
	/(^|[\s"'`-])(flex|grid|col(umn)?|row|justify-|items-|gap-|space-|stack|container|wrapper|layout)([\s"'`-]|$)/i;

/** role values that turn a plain element into a hand-rolled component. */
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

/**
 * Behavior -> canonical component names. A raw element whose behavior matches
 * is NOT reported when it lives inside the canonical directory of one of
 * these components (that is the canonical implementation, not a duplicate).
 */
const BEHAVIOR_CANONICAL = {
	"clickable element (a hand-rolled button)": ["Button"],
	"button (a hand-rolled control)": ["Button"],
	slider: ["Slider"],
	"checkbox (a hand-rolled control)": ["Checkbox"],
	"radio (a hand-rolled control)": ["Radio"],
	"switch (a hand-rolled control)": ["Switch", "Toggle"],
	"modal / dialog": ["Modal", "Dialog", "Drawer"],
	"dropdown / menu": ["Dropdown", "Menu"],
	"dropdown / menu trigger": ["Dropdown", "Menu"],
	"menu item (a hand-rolled control)": ["Dropdown", "Menu"],
	tabs: ["Tabs"],
	"tab (a hand-rolled control)": ["Tabs"],
	tooltip: ["Tooltip"],
	"progress indicator": ["Progress"],
	alert: ["Alert"],
	"accordion / collapsible": ["Collapse", "Accordion"],
	"card / paper": ["Card"],
	"spinner / skeleton": ["Loading", "Skeleton", "Spinner"],
	"layout container": ["Container"],
};

/** Raw elements that ALSO go through the behavior error type (input type=range, select, dialog, ...). */
const RAW_BEHAVIOR_TAGS = new Set(["input", "select", "textarea", "form", "table", "dialog"]);

/** Event-handler attribute names counted as "actions" in a signature. */
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

/**
 * Resolve a data-file option to an absolute path. A relative value is
 * resolved against the repository root (or cwd as a last resort), so the
 * default "reports/component-registry.json" works from any working directory.
 */
function resolveDataPath(value, root) {
	if (path.isAbsolute(value)) return value;
	const base = root || process.cwd();
	return path.resolve(base, value);
}

/**
 * Normalize the ESLint options into a runtime config object.
 *
 * @param {object} [opts] the first rule option (may be undefined)
 * @returns {object} config
 */
function normalizeOptions(opts) {
	const o = opts && typeof opts === "object" ? opts : {};
	const root = findRepoRoot(process.cwd());

	return {
		// Error type 1: the registry of canonical component names -> allowed dirs.
		registry: o.registry || null,
		registryPath: resolveDataPath(o.registryPath || "reports/component-registry.json", root),

		// Error type 3b: the catalog of canonical component element signatures.
		catalog: o.catalog || null,
		catalogPath: resolveDataPath(o.catalogPath || "reports/component-catalog.json", root),

		// Dynamic catalog: signatures captured from a REAL rendered DOM
		// (playground + getComputedStyle). Covers styles that are invisible
		// statically — MUI emotion/sx, antd cssinjs. When includeDynamic is
		// true the dynamic catalog entries are merged into the static one.
		includeDynamic: o.includeDynamic === true,
		dynamicCatalog: o.dynamicCatalog || null,
		dynamicCatalogPath: resolveDataPath(o.dynamicCatalogPath || "reports/component-catalog-dynamic.json", root),

		// Error type 2: raw elements to flag.
		rawElements: new Set(o.rawElements || DEFAULT_RAW_ELEMENTS),

		// Error type 3: tags eligible for behavior analysis.
		behaviorTags: new Set(o.behaviorTags || DEFAULT_BEHAVIOR_TAGS),

		// Component folders (raw HTML / styled.* legal inside; catalog source).
		// Trailing slashes are normalized so "packages/components" and
		// "packages/components/" mean the same folder.
		// NO DEFAULT: the canonical layout is the consumer's knowledge — the
		// ESLint config (or scanner) must pass the folders explicitly. Empty
		// list = every file is "outside the component folders".
		componentsFolder: normalizeFolders(o.componentsFolder || []),

		// File filters: include (empty = everything) / exclude (build artifacts).
		// Each entry is a minimatch glob or a regex ("..." or /.../ form).
		include: o.include || [],
		exclude: o.exclude || DEFAULT_EXCLUDE,

		// Debt ledger section (relpath::ruleId -> count).
		debt: o.debt || null,

		// Repo root (for repo-relative paths in messages).
		root,
	};
}

/**
 * Normalize a list of folder prefixes: posix separators, no leading "./",
 * exactly one trailing slash. "packages/components" and "packages/components/"
 * become the same string.
 *
 * @param {string[]} folders
 * @returns {string[]}
 */
function normalizeFolders(folders) {
	return (folders || []).map((f) => {
		let s = String(f).trim().split(path.sep).join("/");
		while (s.startsWith("./")) s = s.slice(2);
		if (!s.endsWith("/")) s += "/";
		return s;
	});
}

/**
 * True when a repo-relative path is inside any of the component folders
 * (folders are normalized to carry a trailing slash).
 */
function inComponentsFolder(relPath, componentsFolder) {
	return componentsFolder.some((d) => relPath.startsWith(d));
}

/**
 * Compile an include/exclude entry into a matcher. Accepts a minimatch glob
 * ("packages/apps/**") or a regex ("^packages/apps/" or /packages\/apps/).
 */
function compileMatcher(pattern) {
	if (pattern instanceof RegExp) return (p) => pattern.test(p);
	if (typeof pattern !== "string" || pattern.length === 0) return null;
	if (pattern.startsWith("/") && pattern.endsWith("/") && pattern.length > 2) {
		try {
			const re = new RegExp(pattern.slice(1, -1));
			return (p) => re.test(p);
		} catch {
			return null; // invalid regex — treat as glob
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

/**
 * True when the repo-relative file path should be skipped by the rule.
 * A non-empty `include` list means the file must match at least one entry;
 * any matching `exclude` entry always wins.
 */
function isIgnored(relPath, include, exclude) {
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

/**
 * True when a repo-relative path is exactly one of the given directories or
 * lives inside any of them. Used by the registry error type to decide whether a
 * declaration sits in its canonical directory.
 */
function inCanonicalDir(relPath, dirs) {
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
	BEHAVIOR_CANONICAL,
	RAW_BEHAVIOR_TAGS,
	ACTION_ATTR_NAMES,
	normalizeOptions,
	inComponentsFolder,
	inCanonicalDir,
	isIgnored,
};
