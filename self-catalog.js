"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");

const { parseComponents } = require("./main");
const { walk, dedupeAndSort, writeCatalog } = require("./utils");
const { isIgnored, resolveAgainst, DEFAULT_EXTS, DEFAULT_IGNORE_DIRS } = require("./config");

// Self-maintained catalog: the rule keeps its own catalog fresh by walking the
// configured componentsFolder on every lint and re-parsing only the files
// whose mtime+size changed since the last refresh (per-file cache in
// os.tmpdir()). This is the "cache WHAT to compare against" part — the file
// being linted is always judged from its live editor buffer by the rule
// itself, so the disk catalog only ever supplies the OTHER files.
//
// Two-pass parsing (same logic as the old external refresher): pass 1 parses
// changed files with canonNames=null to recover their component names; a
// file's `usesCanonical` fields depend on the GLOBAL name set, so when that
// set changes every file's final records are rebuilt (rare — only when a
// component is added, renamed, or removed).
//
// Budget guard: the refresh is capped at `budgetMs`; past it the partial
// catalog is written as-is (better a slightly stale catalog than a frozen
// editor). The per-file cache makes the fast path ~0ms and a single changed
// file ~100-300ms.

const relPosix = (repoRoot, abs) => path.relative(repoRoot, abs).split(path.sep).join("/");

const cachePathFor = (root) => {
	const key = crypto.createHash("md5").update(path.resolve(root)).digest("hex");
	return path.join(os.tmpdir(), ".md-code-cache", `components-${key}.json`);
};

const readCache = (cachePath) => {
	try {
		const parsed = JSON.parse(fs.readFileSync(cachePath, "utf8"));
		return parsed && typeof parsed === "object" ? parsed : { files: {}, componentsSig: null };
	} catch {
		return { files: {}, componentsSig: null };
	}
};

// Refresh the on-disk catalog in place. `config` is the normalized rule
// config (see config.js normalizeOptions). Returns true when the catalog was
// rewritten (or created), false when nothing changed or the refresh was
// skipped entirely.
const refreshCatalog = (config, { budgetMs = 30000 } = {}) => {
	let wrote = false;
	const root = config.root;
	if (!root) return false;
	const folders = config.componentsFolder || [];
	if (folders.length === 0) return false;
	const catalogPath = path.isAbsolute(config.catalogPath) ? config.catalogPath : path.join(root, config.catalogPath);
	const cachePath = cachePathFor(root);
	const started = Date.now();
	const cache = readCache(cachePath);
	const bucket = (cache.files = cache.files || {});

	const shouldSkip = (abs) => isIgnored(relPosix(root, abs), [], config.exclude);
	const files = [];
	for (const relRoot of folders) {
		const dir = resolveAgainst(relRoot, root);
		if (!fs.existsSync(dir)) continue;
		for (const file of walk(dir, config.exts || DEFAULT_EXTS, config.ignoreDirs || DEFAULT_IGNORE_DIRS)) {
			if (shouldSkip(file)) continue;
			files.push({ file, rel: relPosix(root, file) });
		}
	}

	// Pass 1: re-parse changed files with canonNames=null to recover names.
	let reparsed = 0;
	let pruned = 0;
	let budgetHit = false;
	for (const { file, rel } of files) {
		let stat;
		try {
			stat = fs.statSync(file);
		} catch {
			continue;
		}
		const prev = bucket[rel];
		if (prev && prev.mtimeMs === stat.mtimeMs && prev.size === stat.size) continue;
		if (Date.now() - started > budgetMs) {
			budgetHit = true;
			break;
		}
		try {
			const recs = parseComponents([{ file, rel }], null, config);
			bucket[rel] = { mtimeMs: stat.mtimeMs, size: stat.size, names: recs.map((c) => c.name), finalRecords: null };
			reparsed += 1;
		} catch (err) {
			// Keep the previous records for a file that fails to parse — a
			// transient error must not silently drop half the catalog.
			if (prev) bucket[rel] = prev;
			else bucket[rel] = { mtimeMs: stat.mtimeMs, size: stat.size, names: [], finalRecords: [] };
		}
	}
	for (const rel of Object.keys(bucket)) {
		if (!files.some((f) => f.rel === rel)) {
			delete bucket[rel];
			pruned += 1;
		}
	}

	// Pass 2: final records, rebuilt for every file when the global name set
	// changed (a component was added/renamed/removed), otherwise only for
	// files that were reparsed in pass 1.
	const allNames = new Set();
	for (const { rel } of files) for (const n of (bucket[rel] || {}).names || []) allNames.add(n);
	const canonNames = allNames;
	const newSig = JSON.stringify([...allNames].sort());
	const sigChanged = cache.componentsSig !== newSig;
	for (const { file, rel } of files) {
		const b = bucket[rel];
		if (!b) continue;
		if (!sigChanged && b.finalRecords) continue;
		if (Date.now() - started > budgetMs) {
			budgetHit = true;
			break;
		}
		b.finalRecords = parseComponents([{ file, rel }], canonNames, config);
	}
	cache.componentsSig = newSig;

	const final = files.flatMap(({ rel }) => (bucket[rel] && bucket[rel].finalRecords) || []);

	if (reparsed > 0 || pruned > 0 || !fs.existsSync(catalogPath)) {
		try {
			writeCatalog(catalogPath, dedupeAndSort(final));
			wrote = true;
		} catch (err) {
			console.warn(`[component-uniqueness] self-catalog: could not write ${catalogPath}: ${err && err.message ? err.message : err}`);
			return false;
		}
	}

	try {
		fs.mkdirSync(path.dirname(cachePath), { recursive: true });
		fs.writeFileSync(cachePath, JSON.stringify(cache), "utf8");
	} catch {
		// Cache write failure is non-fatal: the catalog is already written,
		// the next lint simply re-parses more files.
	}

	if (budgetHit) console.warn("[component-uniqueness] self-catalog: budget exhausted, catalog may be partially stale");
	return wrote;
};

module.exports = { refreshCatalog };
