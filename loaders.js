"use strict";

const fs = require("node:fs");
const path = require("node:path");

const cache = new Map(); 

const loadJson = (absPath, label) => {
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
		
		if (!entry.warned) {
			entry.warned = true;
			const rel = path.isAbsolute(absPath) ? absPath : path.resolve(absPath);
			
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

const loadRegistry = (config) => {
	if (config.registry) return config.registry;
	return loadJson(config.registryPath, "component registry");
}

const loadCatalog = (config) => {
	if (config.catalog) return config.catalog;
	return loadJson(config.catalogPath, "component catalog");
}

const loadDynamicCatalog = (config) => {
	if (config.dynamicCatalog) return config.dynamicCatalog;
	return loadJson(config.dynamicCatalogPath, "dynamic component catalog");
}

module.exports = { loadJson, loadRegistry, loadCatalog, loadDynamicCatalog };
