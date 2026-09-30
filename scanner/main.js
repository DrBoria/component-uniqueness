#!/usr/bin/env node
"use strict";

/**
 * scanner/main.js
 *
 * Orchestrator: scans the canonical packages, extracts component element
 * signatures, attributes each to a component, and writes the catalog JSON
 * that the ESLint rule matches app-code against.
 *
 * Usage:
 *   node scanner/main.js [options]
 *
 * Options:
 *   --roots <dir>[:<dir>...]   REQUIRED. Scan roots (repo-relative or
 *                              absolute) — the canonical component directories.
 *   --out <file>               output path. Default: reports/component-catalog.json
 *   --registry <file>          registry path (for name attribution).
 *                              Default: reports/component-registry.json
 *   --repo-root <dir>          repo root. Default: discovered by walking up
 *                              for pnpm-workspace.yaml from cwd.
 *   --check                    do not write; exit 1 when the catalog would
 *                              change (for CI gates).
 *   --report [file]            write a human-readable Markdown report of the
 *                              app-code duplicates (component -> counts by
 *                              similarity tier). With a value: that path.
 *                              Without: ./component-duplicates.md in cwd.
 *   --app-roots <dir>[:<dir>..] app-code roots scanned for the report.
 *                              Default: the repo root (canonical packages
 *                              are skipped).
 */

const fs = require("node:fs");
const path = require("node:path");

const { findRepoRoot } = require("../debt");
const { walk } = require("./walk");
const { signaturesFromFile } = require("./extract");
const { buildDirNameMap, componentNameFor } = require("./attribute");
const { dedupeAndSort, writeCatalog } = require("./output");
const { clusterSignatures, clusterCounts, renderDuplicateReport } = require("../report");

function fail(message) {
	// eslint-disable-next-line no-console
	console.error(`[react-component-uniqueness] ${message}`);
	process.exit(1);
}

/**
 * Parse command-line arguments into a config object.
 *
 * @param {string[]} argv process.argv.slice(2)
 * @returns {object} { roots, out, registry, repoRoot, check }
 */
function parseArgs(argv) {
	const cfg = { roots: null, out: null, registry: null, repoRoot: null, check: false, report: null, appRoots: null };
	for (let i = 0; i < argv.length; i += 1) {
		const a = argv[i];
		if (a === "--check") {
			cfg.check = true;
		} else if (a === "--report") {
			const next = argv[i + 1];
			if (next && !next.startsWith("--")) {
				cfg.report = argv[++i];
			} else {
				cfg.report = "component-duplicates.md"; // default: cwd
			}
		} else if (a === "--roots") {
			if (!argv[i + 1]) fail("--roots requires a value (colon-separated list of directories)");
			cfg.roots = argv[++i].split(":").filter(Boolean);
		} else if (a === "--out") {
			if (!argv[i + 1]) fail("--out requires a value");
			cfg.out = argv[++i];
		} else if (a === "--registry") {
			if (!argv[i + 1]) fail("--registry requires a value");
			cfg.registry = argv[++i];
		} else if (a === "--repo-root") {
			if (!argv[i + 1]) fail("--repo-root requires a value");
			cfg.repoRoot = argv[++i];
		} else if (a === "--app-roots") {
			if (!argv[i + 1]) fail("--app-roots requires a value (colon-separated list of directories)");
			cfg.appRoots = argv[++i].split(":").filter(Boolean);
		} else if (a === "--help" || a === "-h") {
			// eslint-disable-next-line no-console
			console.log("Usage: react-component-uniqueness [--roots a:b] [--out file] [--registry file] [--repo-root dir] [--check] [--report [file.md]] [--app-roots a:b]");
			process.exit(0);
		} else {
			fail(`unknown argument: ${a} (see --help)`);
		}
	}
	return cfg;
}

/** Resolve a possibly-relative path against the repo root. */
function resolveAgainst(value, repoRoot) {
	return path.isAbsolute(value) ? value : path.resolve(repoRoot, value);
}

function main() {
	const args = parseArgs(process.argv.slice(2));
	const repoRoot = args.repoRoot ? path.resolve(args.repoRoot) : findRepoRoot(process.cwd());
	if (!repoRoot) {
		fail("could not find the repository root (no pnpm-workspace.yaml found above the working directory); pass --repo-root");
	}
	// No default scan roots: the repo layout is the consumer's knowledge.
	if (!args.roots) fail("--roots is required (colon-separated list of canonical component directories, repo-relative or absolute)");
	const roots = args.roots;
	const outPath = resolveAgainst(args.out || "reports/component-catalog.json", repoRoot);
	const registryPath = args.registry ? resolveAgainst(args.registry, repoRoot) : path.join(repoRoot, "reports", "component-registry.json");

	const dirNameMap = buildDirNameMap(repoRoot, registryPath);
	const components = [];
	let scanned = 0;

	for (const relRoot of roots) {
		const rootDir = resolveAgainst(relRoot, repoRoot);
		if (!fs.existsSync(rootDir)) {
			// eslint-disable-next-line no-console
			console.warn(`[react-component-uniqueness] scan root not found, skipping: ${rootDir}`);
			continue;
		}
		for (const file of walk(rootDir)) {
			scanned += 1;
			let sigs;
			try {
				sigs = signaturesFromFile(file);
			} catch {
				continue; // unreadable / unparseable file — skip
			}
			const name = componentNameFor(file, repoRoot, dirNameMap);
			const relFile = path.relative(repoRoot, file).split(path.sep).join("/");
			for (const s of sigs) {
				components.push({ name, path: relFile, ...s });
			}
		}
	}

	const final = dedupeAndSort(components);

	if (args.check) {
		let current = null;
		try {
			current = JSON.parse(fs.readFileSync(outPath, "utf8"));
		} catch {
			// missing catalog — a change (unless the scan produced nothing)
		}
		const same = current && JSON.stringify(current.components || []) === JSON.stringify(final);
		if (!same) {
			fail(`catalog is out of date (${final.length} signature(s) expected at ${path.relative(repoRoot, outPath)}); regenerate it (node scanner/main.js)`);
		}
		// eslint-disable-next-line no-console
		console.log(`[react-component-uniqueness] catalog up to date (${final.length} signature(s))`);
		return;
	}

	writeCatalog(outPath, final);
	const tagCount = new Set(final.map((c) => c.tag)).size;
	// eslint-disable-next-line no-console
	console.log(`[react-component-uniqueness] wrote ${path.relative(repoRoot, outPath)} (${final.length} signature(s), ${tagCount} tag(s), ${scanned} file(s) scanned)`);

	if (args.report) {
		const reportPath = path.isAbsolute(args.report) ? args.report : path.resolve(process.cwd(), args.report);
		const { counts, files } = buildReportCounts(args, repoRoot, roots, final);
		fs.mkdirSync(path.dirname(reportPath), { recursive: true });
		fs.writeFileSync(reportPath, renderDuplicateReport(counts, { files, catalog: final.length }));
		// eslint-disable-next-line no-console
		console.log(`[react-component-uniqueness] wrote report ${reportPath} (${files} file(s) scanned, ${counts.size} component(s) with duplicates)`);
	}
}

/**
 * Build the report counts by clustering ALL scanned signatures — the
 * canonical component folders AND the app code — pairwise. This is what
 * makes duplicates that exist only inside the app code (e.g. two keystone
 * components) visible: they form a cluster even though neither is in the
 * catalog.
 *
 * @param {object} args parsed CLI args
 * @param {string} repoRoot absolute repo root
 * @param {string[]} roots canonical scan roots (repo-relative) — skipped in app walk
 * @param {object[]} catalog deduped catalog components (canonical signatures)
 * @returns {{ counts: Map<string, {exact:number, similar:number}>, files: number }}
 */
function buildReportCounts(args, repoRoot, roots, catalog) {
	const appRoots = args.appRoots || ["."];
	const skipDirs = new Set(roots.map((r) => path.resolve(repoRoot, r)));
	const appSigs = [];
	let files = 0;
	for (const relRoot of appRoots) {
		const rootDir = resolveAgainst(relRoot, repoRoot);
		if (!fs.existsSync(rootDir)) {
			// eslint-disable-next-line no-console
			console.warn(`[react-component-uniqueness] app root not found, skipping: ${rootDir}`);
			continue;
		}
		for (const file of walk(rootDir)) {
			let underCanonical = false;
			for (const sd of skipDirs) {
				if (file === sd || file.startsWith(sd + path.sep)) {
					underCanonical = true;
					break;
				}
			}
			if (underCanonical) continue;
			files += 1;
			let sigs;
			try {
				sigs = signaturesFromFile(file);
			} catch {
				continue; // unreadable / unparseable file — skip
			}
			// Stamp a repo-relative path so clusterSignatures can tell same-file
			// from cross-file (same-file a11y overlap is normal, cross-file is a
			// duplicate signal). Without this every app sig has path=undefined and
			// is wrongly treated as "same file" as every other app sig.
			const relFile = path.relative(repoRoot, file).split(path.sep).join("/");
			for (const s of sigs) {
				appSigs.push({ path: relFile, ...s });
			}
		}
	}
	// Canonical signatures carry their component name; app signatures do not.
	const allSigs = [...catalog, ...appSigs];
	const clusters = clusterSignatures(allSigs);
	return { counts: clusterCounts(clusters), files: files + catalog.length };
}

main();
