"use strict";

/**
 * scanner/attribute.js
 *
 * Component attribution: map a source file to the canonical component it
 * belongs to.
 *
 * The component is the nearest PascalCase directory at or above the file's
 * directory (e.g. packages/components/default/forms/Button/index.tsx ->
 * Button). When the component registry is available, the registry's public
 * name for that directory wins (the registry is the source of truth for
 * public names).
 */

const fs = require("node:fs");
const path = require("node:path");

/** Build the dir -> public component name map from the registry (if present). */
function buildDirNameMap(repoRoot, registryPath) {
	const map = new Map();
	const regPath = registryPath || path.join(repoRoot, "reports", "component-registry.json");
	if (!fs.existsSync(regPath)) return map;
	try {
		const reg = JSON.parse(fs.readFileSync(regPath, "utf8"));
		for (const [name, dirs] of Object.entries((reg && reg.names) || {})) {
			for (const d of dirs) {
				if (!map.has(d)) map.set(d, name);
			}
		}
	} catch {
		// registry unreadable — fall back to directory basenames
	}
	return map;
}

/**
 * Attribute a file to a component name.
 *
 * @param {string} fileAbs absolute path to the source file
 * @param {string} repoRoot absolute repo root
 * @param {Map<string,string>} dirNameMap registry dir -> public name
 * @returns {string} component name
 */
function componentNameFor(fileAbs, repoRoot, dirNameMap) {
	let dir = path.dirname(fileAbs);
	// Fallback: the file's own basename (e.g. useCampaignRun.tsx -> useCampaignRun).
	// The old fallback was the directory basename, which produced garbage names
	// like "hooks" or "components" for files sitting in generic folders.
	let name = path.basename(fileAbs).replace(/\.[^.]+$/, "");
	// index.tsx / styles.tsx inside a PascalCase dir belong to that dir's component
	// (e.g. Pagination/index.tsx -> Pagination, Button/styles.ts -> Button).
	const isFileScoped = /^(index|styles|types|constants|utils|hooks|test|stories)$/i.test(name);
	// The file's OWN dir is the most likely component dir (Pagination/index.tsx).
	let up = dir;
	if (/^[A-Z][A-Za-z0-9]*$/.test(path.basename(dir)) && isFileScoped) {
		name = path.basename(dir);
	} else {
		for (let i = 0; i < 4; i += 1) {
			const parent = path.dirname(up);
			if (parent === up) break;
			const bn = path.basename(parent);
			if (/^[A-Z][A-Za-z0-9]*$/.test(bn)) {
				up = parent;
				if (isFileScoped) name = bn; // index/styles/etc. -> dir component name
				break;
			}
			up = parent;
		}
	}
	// Prefer the registry's public name for this directory.
	const relDir = path.relative(repoRoot, dir).split(path.sep).join("/");
	const relUp = path.relative(repoRoot, up).split(path.sep).join("/");
	const regName = dirNameMap.get(relDir) || dirNameMap.get(relUp);
	if (regName) name = regName;
	return name;
}

module.exports = { buildDirNameMap, componentNameFor };
