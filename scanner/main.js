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
 *   --report [file]            write the component-level Markdown report of
 *                              app-code duplicates. With a value: that path.
 *                              Without: reports/component-duplicates-components.md
 *   --app-roots <dir>[:<dir>..] app-code roots scanned for the report.
 *                              Default: the repo root (canonical packages
 *                              are skipped).
 *   --verbose                  Include the "Filtered out" section in the
 *                              report (hidden by default).
 */

const fs = require("node:fs");
const path = require("node:path");

const { findRepoRoot } = require("../debt");
const { isIgnored, DEFAULT_EXCLUDE } = require("../config");
const { loadRuleOptions } = require("./load-config");
const { walk } = require("./walk");
const { componentsFromFile, isHtmlTag } = require("./component");
const { matchComponents, matchJsxBlocks, computeGenericTokens } = require("./matching");
const { clusterComponents, matchFamilies } = require("./clusters");
const { dedupeAndSort, writeCatalog } = require("./output");
const { generateCatalog } = require("./generate");
const { applyFilters, FILTERS } = require("./filters");
const { folderRank } = require("../config");
const { CANON_DUP_STRICT } = require("../thresholds");

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
	const cfg = { roots: null, out: null, registry: null, repoRoot: null, check: false, report: null, appRoots: null, verbose: false };
	for (let i = 0; i < argv.length; i += 1) {
		const a = argv[i];
		if (a === "--check") {
			cfg.check = true;
		} else if (a === "--report") {
			const next = argv[i + 1];
			if (next && !next.startsWith("--")) {
				cfg.report = argv[++i];
			} else {
				cfg.report = "reports/component-duplicates-components.md"; // default
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
		} else if (a === "--verbose") {
			cfg.verbose = true;
		} else if (a === "--help" || a === "-h") {
			// eslint-disable-next-line no-console
			console.log("Usage: md-code-react-component-uniqueness [--roots a:b] [--out file] [--registry file] [--repo-root dir] [--check] [--report [file.md]] [--app-roots a:b] [--verbose] (report = component-level duplicate funnel)");
			// eslint-disable-next-line no-console
			console.log("Without --roots, the options are read from the consumer's eslint.config.js (rule md-code/react-component-uniqueness) or md-code-react-component-uniqueness.config.js.");
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

async function main() {
	const args = parseArgs(process.argv.slice(2));
	const cwd = process.cwd();

	const loaded = args.roots ? null : await loadRuleOptions(cwd);
	const configOptions = loaded ? loaded.options : {};
	if (loaded) {
		// eslint-disable-next-line no-console
		console.log(`[react-component-uniqueness] config from ${loaded.source}`);
	}

	const repoRoot = args.repoRoot ? path.resolve(cwd, args.repoRoot) : findRepoRoot(cwd) || cwd;

	// No default scan roots: the repo layout is the consumer's knowledge.
	// CLI --roots always wins over the rule options' componentsFolder.
	const configRoots = (configOptions.componentsFolder || []).map((d) => (d && typeof d === "object" ? d.path : d)).map((d) => String(d).replace(/\\/g, "/").replace(/\/+$/, ""));
	const roots = args.roots || configRoots;
	if (!roots || roots.length === 0) {
		fail("no scan roots: pass --roots <dir1>:<dir2> or set componentsFolder in the rule options (eslint.config.js / md-code-react-component-uniqueness.config.js)");
	}

	const outPath = resolveAgainst(args.out || configOptions.catalogPath || "reports/component-catalog.json", repoRoot);
	const registryPath = args.registry ? resolveAgainst(args.registry, repoRoot) : path.join(repoRoot, "reports", "component-registry.json");

	const include = configOptions.include || [];
	const exclude = configOptions.exclude || DEFAULT_EXCLUDE;
	const shouldSkip = (abs) => isIgnored(path.relative(repoRoot, abs).split(path.sep).join("/"), include, exclude);

	const { components, scanned } = generateCatalog(roots, repoRoot, include, exclude, registryPath);

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
		const comp = buildComponentReport(args, repoRoot, roots, shouldSkip, configOptions);
		fs.mkdirSync(path.dirname(reportPath), { recursive: true });
		fs.writeFileSync(reportPath, renderComponentReport(comp, args.verbose));
		// eslint-disable-next-line no-console
		console.log(`[react-component-uniqueness] wrote report ${reportPath} (${comp.matches.length} duplicate component(s) across ${comp.files} file(s))`);
	}
}

function rankOfPath(relPath, ranks) {
	for (const [dir, rank] of [...ranks].sort((a, b) => b[0].length - a[0].length)) {
		if (relPath.startsWith(dir)) return rank;
	}
	return null;
}

/**
 * Walk the canonical roots: every file (for the canonicalFiles set) plus the
 * parseable ones (stories/tests/specs excluded).
 */
function collectCanonicalFiles(roots, repoRoot, shouldSkip) {
	const canonicalFiles = new Set();
	const canonFiles = [];
	for (const relRoot of roots) {
		const rootDir = resolveAgainst(relRoot, repoRoot);
		if (!fs.existsSync(rootDir)) continue;
		for (const file of walk(rootDir)) {
			if (shouldSkip(file)) continue;
			const rel = path.relative(repoRoot, file).split(path.sep).join("/");
			canonicalFiles.add(rel);
			if (/\.(stories|test|spec)\.[tj]sx?$/.test(file)) continue;
			canonFiles.push({ file, rel });
		}
	}
	return { canonicalFiles, canonFiles };
}

/**
 * Parse canonical components in two passes: the first pass discovers the
 * canonical names, the second re-parses with them so `usesCanonical` is
 * populated inside canonical files (needed by the wrapper rule).
 */
function parseCanonicalComponents(canonFiles, ranks) {
	const parse = (names) => {
		const out = [];
		for (const { file, rel } of canonFiles) {
			let comps;
			try {
				comps = componentsFromFile(file, names);
			} catch {
				continue;
			}
			for (const c of comps) out.push({ ...c, path: rel, rank: rankOfPath(rel, ranks) });
		}
		return out;
	};
	const first = parse(null);

	return parse(new Set(first.map((c) => c.name)));
}

/**
 * Canonical-vs-canonical pass: strict thresholds, no basename index, and the
 * wrapper rule (a higher-rank component that uses the lower-rank one is a
 * wrapper, not a duplicate). Returns the matches and the keys of the
 * components that are duplicates themselves.
 */
function findCanonicalDuplicates(canonComponents, ranks, thresholds) {
	const matches = [];
	const dupKeys = new Set();
	if (ranks.size === 0) return { matches, dupKeys };

	const generic = computeGenericTokens(canonComponents);
	const seenPairs = new Set();
	const pushCanonDup = (a, b, tier, reason) => {
		if (a.rank === null || b.rank === null || a.rank === b.rank) return;
		const dup = a.rank > b.rank ? a : b;
		const target = a.rank > b.rank ? b : a;
		if ((dup.usesCanonical || []).includes(target.name)) return;
		const key = [`${dup.path}:${dup.name}`, `${target.path}:${target.name}`].sort().join("|");
		if (seenPairs.has(key)) return;
		seenPairs.add(key);
		dupKeys.add(`${dup.path}:${dup.name}`);
		matches.push({
			app: dup,
			canon: target,
			tier: "canon-dup",
			direction: `move down to rank ${target.rank}`,
			reason: tier === "jsx-block" ? `rank ${dup.rank} hand-draws the structure of rank ${target.rank} (${reason})` : `rank ${dup.rank} duplicates rank ${target.rank} (${reason})`,
		});
	};
	const canonTh = { ...(thresholds || {}), ...CANON_DUP_STRICT };
	for (const m of matchComponents(canonComponents, canonComponents, { skipSelf: true, skipBasename: true, thresholds: canonTh })) {
		pushCanonDup(m.app, m.canon, m.tier, m.reason);
	}
	for (const m of matchJsxBlocks(canonComponents, canonComponents, generic, { skipSelf: true, thresholds: canonTh })) {
		pushCanonDup(m.app, m.canon, "jsx-block", m.reason);
	}

	return { matches, dupKeys };
}

/** Walk the app roots, excluding canonical dirs, tests, _medplum and iris. */
function collectAppFiles(appRoots, repoRoot, shouldSkip, skipDirs) {
	const files = [];
	let count = 0;
	for (const relRoot of appRoots) {
		const rootDir = resolveAgainst(relRoot, repoRoot);
		if (!fs.existsSync(rootDir)) continue;
		for (const file of walk(rootDir)) {
			if (shouldSkip(file)) continue;
			if ([...skipDirs].some((d) => file === d || file.startsWith(d + path.sep))) continue;
			const rel = path.relative(repoRoot, file).split(path.sep).join("/");
			if (/\.(stories|test|spec)\.[tj]sx?$/.test(file)) continue;
			if (/_medplum\//.test(rel) || /(^|\/)iris\//.test(rel)) continue;
			count += 1;
			files.push({ file, rel });
		}
	}
	return { files, count };
}

/** Parse app files into components, filling `usesCanonical` from canonNames. */
function parseAppComponents(files, canonNames) {
	const comps = [];
	for (const { file, rel } of files) {
		let parsed;
		try {
			parsed = componentsFromFile(file, canonNames);
		} catch {
			continue;
		}
		for (const c of parsed) comps.push({ ...c, path: rel });
	}
	return comps;
}

/** All four app-vs-canonical matching tiers in one step. */
function matchAppComponents(appComponents, uniqueCanon, canonicalFiles, thresholds) {
	const matches = matchComponents(appComponents, uniqueCanon, {
		canonicalFiles,
		skipWrappers: true,
		thresholds,
		isHtmlOnly: (c) => c.rootTags.length > 0 && c.rootTags.every((t) => isHtmlTag(t)) && (c.elementProps || []).every((e) => (e.tokens || []).length === 0),
	});
	for (const m of matchFamilies(appComponents, uniqueCanon, clusterComponents(uniqueCanon), { thresholds })) matches.push(m);
	for (const m of matchJsxBlocks(appComponents, uniqueCanon, computeGenericTokens(uniqueCanon), { thresholds })) matches.push(m);

	return matches;
}

/**
 * The report pipeline, read top to bottom:
 *
 *   scan canonical files
 *     -> parse canonical components (two passes)
 *     -> find canonical-vs-canonical duplicates (strict thresholds)
 *     -> keep only the unique canonicals
 *     -> scan app files (canonical dirs / tests / _medplum / iris excluded)
 *     -> parse app components
 *     -> match app vs unique canonicals (name / structural / family / jsx)
 *     -> apply filters
 */
function buildComponentReport(args, repoRoot, roots, shouldSkip, configOptions) {
	const ranks = folderRank(configOptions.componentsFolder || []);
	const thresholds = configOptions.thresholds;

	const { canonicalFiles, canonFiles } = collectCanonicalFiles(roots, repoRoot, shouldSkip);
	const canonComponents = parseCanonicalComponents(canonFiles, ranks);
	const { matches: canonDup, dupKeys } = findCanonicalDuplicates(canonComponents, ranks, thresholds);
	const uniqueCanon = canonComponents.filter((c) => !dupKeys.has(`${c.path}:${c.name}`));

	const skipDirs = new Set(roots.map((r) => path.resolve(repoRoot, r)));
	const { files, count } = collectAppFiles(args.appRoots || ["."], repoRoot, shouldSkip, skipDirs);
	const appComponents = parseAppComponents(files, new Set(canonComponents.map((c) => c.name)));

	const matches = matchAppComponents(appComponents, uniqueCanon, canonicalFiles, thresholds);
	const { kept, dropped } = applyFilters(matches);

	return { matches: kept, dropped, canonDup, files: count, canonCount: canonComponents.length, uniqueCanonCount: uniqueCanon.length, appCount: appComponents.length };
}

const TIERS = ["name", "name-fuzzy", "structural-exact", "structural-similar", "family", "jsx-block"];
const TIER_LABEL = {
	name: "Name match",
	"name-fuzzy": "Name contains canonical",
	"structural-exact": "Structural (exact)",
	"structural-similar": "Structural (similar)",
	family: "Family (hand-built library piece)",
	"jsx-block": "JSX block (canonical drawn by hand inside)",
};

function renderHeader(comp) {
	const lines = [];
	lines.push("# Component duplicates (component-level funnel)");
	lines.push("");
	lines.push(`Scanned ${comp.files} app file(s), ${comp.appCount} app component(s) against ${comp.canonCount} canonical component(s)${comp.uniqueCanonCount !== undefined && comp.uniqueCanonCount !== comp.canonCount ? ` (${comp.uniqueCanonCount} unique after removing ${comp.canonCount - comp.uniqueCanonCount} canonical duplicate(s))` : ""}.`);
	lines.push(`Found ${comp.matches.length} duplicate component(s)${comp.dropped && comp.dropped.length > 0 ? ` (after filtering out ${comp.dropped.length} match(es))` : ""}.`);
	lines.push("");

	return lines;
}

function renderCanonDupSection(rows) {
	const lines = [];
	lines.push(`## Canonical duplicates (layered folders) (${rows.length})`);
	lines.push("");
	lines.push("A canonical component duplicates another canonical one. The duplicate must live in the LOWER layer (smaller rank) — the upper layer should wrap it, not re-draw it. Duplicates are removed from the canonical set before the app pass, so the app is only ever compared against unique canonicals.");
	lines.push("");
	lines.push("| Duplicate | Location | Duplicates canonical | Canonical location | Action | Why |");
	lines.push("| --- | --- | --- | --- | --- | --- |");
	const sorted = [...rows].sort((a, b) => a.canon.name.localeCompare(b.canon.name) || a.app.path.localeCompare(b.app.path));
	for (const m of sorted) {
		lines.push(`| ${m.app.name} | \`${m.app.path}:${m.app.line}\` | ${m.canon.name} | \`${m.canon.path}\` | ${m.direction} | ${m.reason} |`);
	}
	lines.push("");

	return lines;
}

function renderTierSection(tier, rows) {
	const lines = [];
	lines.push(`## ${TIER_LABEL[tier]} (${rows.length})`);
	lines.push("");
	lines.push("| Local component | Location | Duplicates canonical | Canonical location | Why |");
	lines.push("| --- | --- | --- | --- | --- |");
	const sorted = [...rows].sort((a, b) => a.canon.name.localeCompare(b.canon.name) || a.app.path.localeCompare(b.app.path));
	for (const m of sorted) {
		lines.push(`| ${m.app.name} | \`${m.app.path}:${m.app.line}\` | ${m.canon.name} | \`${m.canon.path}\` | ${m.reason} |`);
	}
	lines.push("");

	return lines;
}

function renderFilteredSection(dropped) {
	const lines = [];
	const byFilter = new Map();
	for (const d of dropped) {
		if (!byFilter.has(d.filter)) byFilter.set(d.filter, []);
		byFilter.get(d.filter).push(d);
	}
	for (const [filter, rows] of byFilter) {
		lines.push(`## Filtered out by \`${filter}\` (${rows.length})`);
		lines.push("");
		lines.push("These matched a canonical component, but the filter decided they are not duplicates. See the reason per row.");
		lines.push("");
		lines.push("| Local component | Location | Canonical | Canonical location | Why dropped |");
		lines.push("| --- | --- | --- | --- | --- |");
		const sorted = [...rows].sort((a, b) => a.match.canon.name.localeCompare(b.match.canon.name) || a.match.app.path.localeCompare(b.match.app.path));
		for (const d of sorted) {
			lines.push(`| ${d.match.app.name} | \`${d.match.app.path}:${d.match.app.line}\` | ${d.match.canon.name} | \`${d.match.canon.path}\` | ${d.reason} |`);
		}
		lines.push("");
	}

	return lines;
}

function renderComponentReport(comp, verbose) {
	const lines = [];
	lines.push(...renderHeader(comp));
	if (comp.canonDup && comp.canonDup.length > 0) lines.push(...renderCanonDupSection(comp.canonDup));
	for (const tier of TIERS) {
		const rows = comp.matches.filter((m) => m.tier === tier);
		if (rows.length === 0) continue;
		lines.push(...renderTierSection(tier, rows));
	}
	if (verbose && comp.dropped && comp.dropped.length > 0) lines.push(...renderFilteredSection(comp.dropped));

	return lines.join("\n");
}

main().catch((err) => {
	fail(err && err.message ? err.message : String(err));
});
