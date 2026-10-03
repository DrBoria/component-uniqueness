#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const { findRepoRoot } = require("../debt");
const { isIgnored, DEFAULT_EXCLUDE } = require("../config");
const { loadRuleOptions } = require("./load-config");
const { walk } = require("./walk");
const { signaturesFromFile } = require("./extract");
const { componentsFromFile, isHtmlTag } = require("./component");
const { matchComponents, matchJsxBlocks, computeGenericTokens } = require("./matching");
const { clusterComponents, matchFamilies } = require("./clusters");
const { buildDirNameMap, componentNameFor } = require("./attribute");
const { dedupeAndSort, writeCatalog } = require("./output");
const { applyFilters, FILTERS } = require("./filters");
const { folderRank } = require("../config");
const { CANON_DUP_STRICT } = require("../thresholds");

const fail = (message) => {
	
	console.error(`[react-component-uniqueness] ${message}`);
	process.exit(1);
}

const parseArgs = (argv) => {
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
				cfg.report = "reports/component-duplicates-components.md"; 
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
			
			console.log("Usage: react-component-uniqueness [--roots a:b] [--out file] [--registry file] [--repo-root dir] [--check] [--report [file.md]] [--app-roots a:b] [--verbose] (report = component-level duplicate funnel)");
			
			console.log("Without --roots, the options are read from the consumer's eslint.config.js (rule react-component-uniqueness/react-component-uniqueness) or react-component-uniqueness.config.js.");
			process.exit(0);
		} else {
			fail(`unknown argument: ${a} (see --help)`);
		}
	}
	return cfg;
}

/** Resolve a possibly-relative path against the repo root. */
const resolveAgainst = (value, repoRoot) => {
	return path.isAbsolute(value) ? value : path.resolve(repoRoot, value);
}

/** Repo-relative posix path for the ignore matcher. */
const relPosix = (repoRoot, abs) => {
	return path.relative(repoRoot, abs).split(path.sep).join("/");
}

/**
 * Walk every scan root and collect one signature entry per component element.
 *
 * @returns {{ components: object[], scanned: number }}
 */
const scanCatalog = (roots, repoRoot, shouldSkip, dirNameMap) => {
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
			if (shouldSkip(file)) continue;
			if (/\.(stories|test|spec)\.[tj]sx?$/.test(file)) continue;
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
	return { components, scanned };
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
	
	const configRoots = (configOptions.componentsFolder || []).map((d) => (d && typeof d === "object" ? d.path : d)).map((d) => String(d).replace(/\\/g, "/").replace(/\/+$/, ""));
	const roots = args.roots || configRoots;
	if (!roots || roots.length === 0) {
		fail("no scan roots: pass --roots <dir1>:<dir2> or set componentsFolder in the rule options (eslint.config.js / react-component-uniqueness.config.js)");
	}

	const outPath = resolveAgainst(args.out || configOptions.catalogPath || "reports/component-catalog.json", repoRoot);
	const registryPath = args.registry ? resolveAgainst(args.registry, repoRoot) : path.join(repoRoot, "reports", "component-registry.json");

	const include = configOptions.include || [];
	const exclude = configOptions.exclude || DEFAULT_EXCLUDE;
	const shouldSkip = (abs) => isIgnored(relPosix(repoRoot, abs), include, exclude);

	const dirNameMap = buildDirNameMap(repoRoot, registryPath);
	const { components, scanned } = scanCatalog(roots, repoRoot, shouldSkip, dirNameMap);

	const final = dedupeAndSort(components);

	if (args.check) {
		let current = null;
		try {
			current = JSON.parse(fs.readFileSync(outPath, "utf8"));
		} catch {
			
		}
		const same = current && JSON.stringify(current.components || []) === JSON.stringify(final);
		if (!same) {
			fail(`catalog is out of date (${final.length} signature(s) expected at ${path.relative(repoRoot, outPath)}); regenerate it (node scanner/main.js)`);
		}
		
		console.log(`[react-component-uniqueness] catalog up to date (${final.length} signature(s))`);
		return;
	}

	writeCatalog(outPath, final);
	const tagCount = new Set(final.map((c) => c.tag)).size;
	
	console.log(`[react-component-uniqueness] wrote ${path.relative(repoRoot, outPath)} (${final.length} signature(s), ${tagCount} tag(s), ${scanned} file(s) scanned)`);

	if (args.report) {
		const reportPath = path.isAbsolute(args.report) ? args.report : path.resolve(process.cwd(), args.report);
		const comp = buildComponentReport(args, repoRoot, roots, shouldSkip, configOptions);
		fs.mkdirSync(path.dirname(reportPath), { recursive: true });
		fs.writeFileSync(reportPath, renderComponentReport(comp, args.verbose));
		
		console.log(`[react-component-uniqueness] wrote report ${reportPath} (${comp.matches.length} duplicate component(s) across ${comp.files} file(s))`);
	}
}

const rankOfPath = (relPath, ranks) => {
	for (const [dir, rank] of [...ranks].sort((a, b) => b[0].length - a[0].length)) {
		if (relPath.startsWith(dir)) return rank;
	}
	return null;
}

const collectCanonicalFiles = (roots, repoRoot, shouldSkip) => {
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

const parseCanonicalComponents = (canonFiles, ranks) => {
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
	const initial = parse(null);

	return parse(new Set(initial.map((c) => c.name)));
}

const findCanonicalDuplicates = (canonComponents, ranks, thresholds) => {
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

const collectAppFiles = (appRoots, repoRoot, shouldSkip, skipDirs) => {
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

const parseAppComponents = (files, canonNames) => {
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

const matchAppComponents = (appComponents, uniqueCanon, canonicalFiles, thresholds) => {
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

const buildComponentReport = (args, repoRoot, roots, shouldSkip, configOptions) => {
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

const renderHeader = (comp) => {
	const lines = [];
	lines.push("# Component duplicates (component-level funnel)");
	lines.push("");
	lines.push(`Scanned ${comp.files} app file(s), ${comp.appCount} app component(s) against ${comp.canonCount} canonical component(s)${comp.uniqueCanonCount !== undefined && comp.uniqueCanonCount !== comp.canonCount ? ` (${comp.uniqueCanonCount} unique after removing ${comp.canonCount - comp.uniqueCanonCount} canonical duplicate(s))` : ""}.`);
	lines.push(`Found ${comp.matches.length} duplicate component(s)${comp.dropped && comp.dropped.length > 0 ? ` (after filtering out ${comp.dropped.length} match(es))` : ""}.`);
	lines.push("");

	return lines;
}

const renderCanonDupSection = (rows) => {
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

const renderTierSection = (tier, rows) => {
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

const renderFilteredSection = (dropped) => {
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

const renderComponentReport = (comp, verbose) => {
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
