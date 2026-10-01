"use strict";

const fs = require("node:fs");
const path = require("node:path");

const { isIgnored, DEFAULT_EXCLUDE } = require("../config");
const { walk } = require("./walk");
const { signaturesFromFile } = require("./extract");
const { buildDirNameMap, componentNameFor } = require("./attribute");
const { dedupeAndSort } = require("./output");

const relPosix = (repoRoot, abs) => path.relative(repoRoot, abs).split(path.sep).join("/");

/**
 * Scan canonical roots and return the deduped catalog components array.
 * Shared by the CLI (writes to file) and the ESLint rule (in-memory fallback).
 *
 * @param {string[]} roots repo-relative canonical directories
 * @param {string} repoRoot absolute repo root
 * @param {string[]} [include] minimatch globs (empty = everything not excluded)
 * @param {string[]} [exclude] minimatch globs (default: node_modules, dist, build, .git)
 * @param {string} [registryPath] optional registry file for dir-name attribution
 * @returns {{ components: object[], scanned: number }}
 */
function generateCatalog(roots, repoRoot, include, exclude, registryPath) {
	const ex = exclude || DEFAULT_EXCLUDE;
	const inc = include || [];
	const shouldSkip = (abs) => isIgnored(relPosix(repoRoot, abs), inc, ex);
	const dirNameMap = buildDirNameMap(repoRoot, registryPath || null);

	const components = [];
	let scanned = 0;

	for (const relRoot of roots) {
		const rootDir = path.isAbsolute(relRoot) ? relRoot : path.resolve(repoRoot, relRoot);
		if (!fs.existsSync(rootDir)) continue;
		for (const file of walk(rootDir)) {
			if (shouldSkip(file)) continue;
			if (/\.(stories|test|spec)\.[tj]sx?$/.test(file)) continue;
			scanned += 1;
			let sigs;
			try {
				sigs = signaturesFromFile(file);
			} catch {
				continue;
			}
			const name = componentNameFor(file, repoRoot, dirNameMap);
			const relFile = path.relative(repoRoot, file).split(path.sep).join("/");
			for (const s of sigs) {
				components.push({ name, path: relFile, ...s });
			}
		}
	}

	return { components: dedupeAndSort(components), scanned };
}

module.exports = { generateCatalog };
