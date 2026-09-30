"use strict";

/**
 * scanner/output.js
 *
 * Catalog output: dedupe, sort, and write reports/component-catalog.json.
 */

const fs = require("node:fs");
const path = require("node:path");

/**
 * Deduplicate and sort the collected signatures.
 *
 * @param {Array<object>} components raw entries { name, path, tag, styles, actions, a11y, data }
 * @returns {Array<object>} deduped + sorted
 */
function dedupeAndSort(components) {
	const seen = new Set();
	const out = [];
	for (const c of components) {
		const key = JSON.stringify({ n: c.name, ...c });
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(c);
	}
	out.sort((a, b) => (a.name + a.tag + a.path).localeCompare(b.name + b.tag + b.path));
	return out;
}

/**
 * Write the catalog JSON file (pretty, trailing newline).
 *
 * @param {string} outPath absolute output path
 * @param {Array<object>} components deduped + sorted entries
 */
function writeCatalog(outPath, components) {
	fs.mkdirSync(path.dirname(outPath), { recursive: true });
	fs.writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), components }, null, 2) + "\n", "utf8");
}

module.exports = { dedupeAndSort, writeCatalog };
