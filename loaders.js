"use strict";

/**
 * loaders.js
 *
 * Loads the two data files the rule depends on:
 *
 *   - the component registry  (reports/component-registry.json)
 *   - the component catalog   (reports/component-catalog.json)
 *
 * Both are cached per process. Errors are reported once per process with a
 * clear, actionable message (English) and the error type degrades to strict /
 * no-op rather than crashing the lint run.
 */

const fs = require("node:fs");
const path = require("node:path");

const cache = new Map(); // absolutePath -> { loaded: boolean, value: any, warned: boolean }

/**
 * Read and parse a JSON data file, with caching and a one-time, actionable
 * warning when the file is missing or invalid.
 *
 * @param {string} absPath absolute path to the JSON file
 * @param {string} label human label used in the warning (e.g. "component registry")
 * @returns {object|null} the parsed object, or null when unavailable
 */
function loadJson(absPath, label) {
	if (cache.has(absPath)) return cache.get(absPath).value;

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
		// One warning per process, per file — not per linted file.
		if (!entry.warned) {
			entry.warned = true;
			const rel = path.isAbsolute(absPath) ? absPath : path.resolve(absPath);
			// eslint-disable-next-line no-console
			console.warn(
				`[react-component-uniqueness] ${label} ${reason} at ${rel}. ` +
					`The ${label} error type is disabled for this run. ` +
					`Generate it first (see the package README) or pass it via the rule options.`
			);
		}
	}

	cache.set(absPath, entry);
	return entry.value;
}

/**
 * Load the component registry.
 *
 * @param {object} config runtime config (from config.normalizeOptions)
 * @returns {object|null} { names: { Name: [dir, ...] }, known: {...} } or null
 */
function loadRegistry(config) {
	if (config.registry) return config.registry;
	return loadJson(config.registryPath, "component registry");
}

/**
 * Load the component catalog.
 *
 * @param {object} config runtime config (from config.normalizeOptions)
 * @returns {object|null} { components: [{ name, path, tag, styles, actions, a11y, data }] } or null
 */
function loadCatalog(config) {
	if (config.catalog) return config.catalog;
	return loadJson(config.catalogPath, "component catalog");
}

/**
 * Load the DYNAMIC component catalog (signatures captured from a rendered
 * DOM via the playground). Returns null when unavailable — the rule degrades
 * to the static catalog only.
 *
 * @param {object} config runtime config (from config.normalizeOptions)
 * @returns {object|null} { components: [...] } or null
 */
function loadDynamicCatalog(config) {
	if (config.dynamicCatalog) return config.dynamicCatalog;
	return loadJson(config.dynamicCatalogPath, "dynamic component catalog");
}

module.exports = { loadJson, loadRegistry, loadCatalog, loadDynamicCatalog };
