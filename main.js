#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const {
	findRepoRoot,
	isIgnored,
	inComponentsFolder,
	canSeeCanon,
	DEFAULT_EXTS,
	DEFAULT_IGNORE_DIRS,
	loadRuleOptions,
	normalizeOptions,
	loadRegistry,
	loadCatalog,
} = require("./config");
const { walk, writeCatalog } = require("./utils");
const { parseComponents: parseComponentsViaEntrypoint, parseElements: parseElementsViaEntrypoint, parseParts: parsePartsViaEntrypoint } = require("./playgrounds/framework-entrypoint.js");
const { buildCandidate, buildElementCandidate } = require("./normalize/candidate.js");
const { matchSignals } = require("./matcher");
const { getFrameworkMatcher } = require("./matcher/framework");
const { decide, bestOf } = require("./decision-maker");
const dropUsages = require("./filter/drop-usages");
const dropChildElement = require("./filter/drop-child-element");
const { findMissingComponents } = require("./filter/missing-component");
const { renderComponentReport } = require("./report");
const log = require("./logger");

const FILTERS = [dropUsages, dropChildElement];
const frameworkMatcher = getFrameworkMatcher("react");

const treeSummary = (tree) => {
	if (!tree) return null;
	const walk = (n) => {
		const kids = (n.children || []).map(walk);
		return { tag: n.tag, css: n.css ? Object.keys(n.css).length : 0, children: kids };
	};
	return walk(tree);
};

const candidateSummary = (c, role) => ({
	role,
	name: c.name,
	path: c.path,
	rootTags: c.rootTags,
	tree: treeSummary(c.tree),
	domTree: treeSummary(c.dom && c.dom.tree),
	framework: c.framework ? { props: c.framework.props, events: c.framework.events, names: c.framework.names, open: c.framework.open } : null,
	a11y: c.a11y,
});

const fail = (message) => {
	console.error(`[component-uniqueness] ${message}`);
	process.exit(1);
};

const parseArgs = (argv) => {
	const cfg = { roots: null, out: null, registry: null, repoRoot: null, check: false, report: null, appRoots: null, ignoreDirs: null, verbose: false, include: null, log: null, minCluster: 3 };
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
		} else if (a === "--ignore-dirs") {
			if (!argv[i + 1]) fail("--ignore-dirs requires a value (colon-separated list of directory names)");
			cfg.ignoreDirs = argv[++i].split(":").filter(Boolean);
		} else if (a === "--verbose") {
			cfg.verbose = true;
		} else if (a === "--include") {
			if (!argv[i + 1]) fail("--include requires a value (colon-separated list of file globs, e.g. a.tsx:b.tsx)");
			cfg.include = argv[++i].split(":").filter(Boolean);
		} else if (a === "--log") {
			if (!argv[i + 1]) fail("--log requires a value (path to the stage log file)");
			cfg.log = argv[++i];
		} else if (a === "--min-cluster") {
			if (!argv[i + 1]) fail("--min-cluster requires a value (min app components matching one canonical to flag it as a missing component)");
			const n = Number.parseInt(argv[i + 1], 10);
			if (!Number.isFinite(n) || n < 2) fail("--min-cluster must be an integer >= 2");
			cfg.minCluster = n;
			i += 1;
		} else if (a === "--help" || a === "-h") {
			console.log("Usage: component-uniqueness [--roots a:b] [--out file] [--registry file] [--repo-root dir] [--check] [--report [file.md]] [--app-roots a:b] [--ignore-dirs a:b] [--include a.tsx:b.tsx] [--log file] [--min-cluster N] [--verbose]");
			console.log("Without --roots, the options are read from the consumer's eslint.config.js (rule md-code/component-uniqueness) or component-uniqueness.config.js.");
			process.exit(0);
		} else {
			fail(`unknown argument: ${a} (see --help)`);
		}
	}
	return cfg;
};

const resolveAgainst = (value, repoRoot) => {
	return path.isAbsolute(value) ? value : path.resolve(repoRoot, value);
};

const relPosix = (repoRoot, abs) => {
	return path.relative(repoRoot, abs).split(path.sep).join("/");
};

const collectFiles = (roots, repoRoot, shouldSkip, skipDirs, exts, ignoreDirs) => {
	const files = [];
	let count = 0;
	for (const relRoot of roots) {
		const rootDir = resolveAgainst(relRoot, repoRoot);
		if (!fs.existsSync(rootDir)) continue;
		for (const file of walk(rootDir, exts, ignoreDirs)) {
			if (shouldSkip(file)) continue;
			if (skipDirs && [...skipDirs].some((d) => file === d || file.startsWith(d + path.sep))) continue;
			const rel = relPosix(repoRoot, file);
			count += 1;
			files.push({ file, rel });
		}
	}
	return { files, count };
};

const parseComponents = (files, canonNames, config, role = "CANONICAL") => {
	const comps = [];
	for (const { file, rel } of files) {
		let parsed;
		let source;
		try {
			source = fs.readFileSync(file, "utf8");
			parsed = parseComponentsViaEntrypoint(file, canonNames, config);
		} catch (err) {
			console.warn(`[component-uniqueness] could not parse ${rel}: ${err && err.message ? err.message : err}`);
			continue;
		}
		for (const c of parsed) {
			if (log.enabled()) {
				log.stage("normalizer:before", { role, file: rel, name: c.name, tree: treeSummary(c.tree), rootTags: c.rootTags, a11y: c.a11y });
			}
			const candidate = buildCandidate(c, config);
			const withPath = { ...candidate, path: rel };
			if (log.enabled()) {
				log.stage("normalizer:after", { role, file: rel, name: c.name, tree: treeSummary(c.tree), domTree: treeSummary(candidate.dom && candidate.dom.tree), framework: { props: candidate.framework.props, events: candidate.framework.events, names: candidate.framework.names, open: candidate.framework.open } });
			}
			comps.push(withPath);
		}
	}
	return comps;
};

const matchPairs = (appComponents, canonComponents, config) => {
	const canonNames = [...new Set(canonComponents.map((c) => c.name))];
	const matches = [];
	for (const app of appComponents) {
		for (const canon of canonComponents) {
			if (canon.path === app.path && canon.name === app.name) continue;
			if (!canSeeCanon(app.path, canon.path, config.componentsFolder)) continue;
			if (log.enabled()) {
				log.stage("matcher:before", { app: candidateSummary(app, "candidate"), canon: candidateSummary(canon, "canonical") });
			}
			const signals = matchSignals(app, canon, { canonNames, frameworkMatcher });
			if (log.enabled()) {
				log.stage("matcher:after", { app: { name: app.name, path: app.path }, canon: { name: canon.name, path: canon.path }, signals });
			}
			if (log.enabled()) {
				log.stage("decision:before", { app: { name: app.name, path: app.path }, canon: { name: canon.name, path: canon.path }, signals });
			}
			const decision = decide(app, canon, { signals, weights: config.weights, thresholds: config.thresholds });
			if (log.enabled()) {
				log.stage("decision:after", { app: { name: app.name, path: app.path }, canon: { name: canon.name, path: canon.path }, confidence: decision.confidence, tier: decision.tier, isDuplicate: decision.isDuplicate, weights: decision.weights, signals: Object.fromEntries(Object.entries(decision.signals).map(([k, s]) => [k, s.score])) });
			}
			if (!decision.tier) continue;
			matches.push({ app, canon, decision, tier: decision.tier, reason: decision.reason });
		}
	}
	return matches;
};

const applyFilters = (matches) => {
	const kept = [];
	const dropped = [];
	for (const match of matches) {
		if (log.enabled()) {
			log.stage("filter:before", { app: { name: match.app.name, path: match.app.path }, canon: { name: match.canon.name, path: match.canon.path }, confidence: match.decision.confidence });
		}
		let hit = null;
		for (const f of FILTERS) {
			const reason = f.test(match);
			if (reason) {
				hit = { match, filter: f.name, reason };
				break;
			}
		}
		if (hit) {
			dropped.push(hit);
			if (log.enabled()) log.stage("filter:after", { app: { name: match.app.name, path: match.app.path }, canon: { name: match.canon.name, path: match.canon.path }, outcome: "dropped", filter: hit.filter, reason: hit.reason });
		} else {
			kept.push(match);
			if (log.enabled()) log.stage("filter:after", { app: { name: match.app.name, path: match.app.path }, canon: { name: match.canon.name, path: match.canon.path }, outcome: "kept", confidence: match.decision.confidence });
		}
	}
	return { kept, dropped };
};

const pairKey = (match) => [match.app.name, match.canon.name].sort().join("::");

const dedupPairs = (matches) => {
	const best = new Map();
	for (const match of matches) {
		const key = pairKey(match);
		const prev = best.get(key);
		if (!prev || match.decision.confidence > prev.decision.confidence) best.set(key, match);
	}
	return [...best.values()];
};

const collectRawHtml = (appFiles, canonComponents, config, canonNames) => {
	if (!config.rawHtml) return [];
	const rows = [];
	for (const { file, rel } of appFiles) {
		if (inComponentsFolder(rel, config.componentsFolder)) continue;
		let elements;
		try {
			elements = parseElementsViaEntrypoint(file, canonNames, config);
		} catch (err) {
			console.warn(`[component-uniqueness] could not parse elements of ${rel}: ${err && err.message ? err.message : err}`);
			continue;
		}
		for (const element of elements) {
			const candidate = buildElementCandidate(element, config);
			if (!candidate) continue;
			const best = bestOf(matchPairs([{ ...candidate, path: rel }], canonComponents, config));
			if (!best) continue;
			rows.push({
				tag: element.name,
				path: rel,
				line: element.line,
				suggestion: { component: best.canon.name, path: best.canon.path },
				confidence: best.decision.confidence,
				reason: best.decision.reason,
			});
		}
	}

	return rows;
};

const SIZE_RATIO = 3;
const MIN_PART_CANON_NODES = 3;
const sizeCache = new WeakMap();

const nodeCount = (tree) => {
	if (!tree) return 0;
	const own = tree.tag === "fragment" || tree.tag === "children" ? 0 : 1;

	return own + (tree.children || []).reduce((sum, child) => sum + nodeCount(child), 0);
};

const sizeOf = (item) => {
	if (!sizeCache.has(item)) sizeCache.set(item, nodeCount(item.tree));

	return sizeCache.get(item);
};

const tagBag = (tree, bag = new Map()) => {
	if (!tree) return bag;
	if (tree.tag !== "fragment" && tree.tag !== "children") bag.set(tree.tag, (bag.get(tree.tag) || 0) + 1);
	for (const child of tree.children || []) tagBag(child, bag);

	return bag;
};

const bagCache = new WeakMap();

const bagOf = (item) => {
	if (!bagCache.has(item)) bagCache.set(item, tagBag(item.tree));

	return bagCache.get(item);
};

const bagDice = (a, b) => {
	let shared = 0;
	let total = 0;
	for (const n of a.values()) total += n;
	for (const n of b.values()) total += n;
	for (const [tag, n] of a) shared += Math.min(n, b.get(tag) || 0);

	return total === 0 ? 0 : (2 * shared) / total;
};

const MIN_TAG_DICE = 0.5;

const comparableCanons = (part, canonComponents) => {
	const partSize = sizeOf(part);
	const partBag = bagOf(part);

	return canonComponents.filter((canon) => {
		const size = sizeOf(canon);

		return size >= MIN_PART_CANON_NODES && size <= partSize * SIZE_RATIO && partSize <= size * SIZE_RATIO && bagDice(partBag, bagOf(canon)) >= MIN_TAG_DICE;
	});
};

const largestParts = (found) => {
	const sorted = [...found].sort((a, b) => b.part.endLine - b.part.line - (a.part.endLine - a.part.line));
	const kept = [];
	for (const item of sorted) {
		const inside = kept.some((k) => k.best.canon.name === item.best.canon.name && k.part.line <= item.part.line && k.part.endLine >= item.part.endLine);
		if (!inside) kept.push(item);
	}

	return kept.sort((a, b) => a.part.line - b.part.line);
};

const findParts = (file, rel, canonComponents, config, canonNames) => {
	let parts;
	try {
		parts = parsePartsViaEntrypoint(file, canonNames, config);
	} catch (err) {
		console.warn(`[component-uniqueness] could not parse parts of ${rel}: ${err && err.message ? err.message : err}`);

		return [];
	}
	const found = [];
	for (const part of parts) {
		const pool = comparableCanons(part, canonComponents);
		if (pool.length === 0) continue;
		const candidate = { ...buildCandidate(part, config), path: rel };
		const { kept } = applyFilters(matchPairs([candidate], pool, config));
		const best = bestOf(kept);
		if (best) found.push({ part, best });
	}

	return largestParts(found);
};

const collectParts = (appFiles, canonComponents, config, canonNames) => {
	if (!config.parts) return [];
	const rows = [];
	for (const { file, rel } of appFiles) {
		for (const { part, best } of findParts(file, rel, canonComponents, config, canonNames)) {
			rows.push({
				owner: part.owner,
				tag: part.rootTag,
				path: rel,
				line: part.line,
				endLine: part.endLine,
				suggestion: { component: best.canon.name, path: best.canon.path },
				confidence: best.decision.confidence,
				reason: best.decision.reason,
			});
		}
	}

	return rows;
};

const stageLog = (enabled) => {
	const started = Date.now();

	return (label) => {
		if (!enabled) return;
		if (global.gc) global.gc();
		console.log(`[component-uniqueness] ${label}: ${((Date.now() - started) / 1000).toFixed(1)}s, heap ${Math.round(process.memoryUsage().heapUsed / 1048576)} MB`);
	};
};

const buildComponentReport = async (args, repoRoot, roots, shouldSkip, config, registry, catalogComponents) => {
	const exts = config.exts || DEFAULT_EXTS;
	const ignoreDirs = config.ignoreDirs;
	const stage = stageLog(args.verbose);

	const shouldSkipCanon = (abs) => isIgnored(relPosix(repoRoot, abs), [], config.exclude);
	const canonFiles = collectFiles(roots, repoRoot, shouldSkipCanon, null, exts, ignoreDirs).files;
	const canonComponents = parseComponents(canonFiles, null, config);
	const canonNames = new Set(canonComponents.map((c) => c.name));
	const uniqueCanon = parseComponents(canonFiles, canonNames, config);
	stage(`canonical parsed (${uniqueCanon.length})`);

	const appShouldSkip = (abs) => {
		const rel = relPosix(repoRoot, abs);

		return isIgnored(rel, inComponentsFolder(rel, config.componentsFolder) ? [] : config.include, config.exclude);
	};
	const appFiles = collectFiles(args.appRoots || ["."], repoRoot, appShouldSkip, null, exts, ignoreDirs);
	const appComponents = parseComponents(appFiles.files, canonNames, config, "CANDIDATE");
	stage(`app parsed (${appComponents.length})`);

	const matches = matchPairs(appComponents, uniqueCanon, config);
	const { kept, dropped } = applyFilters(matches);
	const deduped = dedupPairs(kept);
	stage("components matched");
	const { clusters, remaining } = findMissingComponents(deduped, { minCluster: args.minCluster });
	if (log.enabled()) {
		log.stage("missing-component", { minCluster: args.minCluster, clusters: clusters.map((c) => ({ name: c.name, canon: c.canon.name, apps: c.matches.map((m) => m.app.name) })), remaining: remaining.length });
	}
	stage("missing-component clustered");
	const rawHtml = collectRawHtml(appFiles.files, uniqueCanon, config, canonNames);
	stage("raw html done");
	const parts = collectParts(appFiles.files, uniqueCanon, config, canonNames);
	stage("parts done");

	return {
		matches: remaining,
		dropped,
		missingClusters: clusters,
		rawHtml,
		parts,
		layerFolders: config.componentsFolder,
		files: appFiles.count,
		canonCount: uniqueCanon.length,
		appCount: appComponents.length,
	};
};

const main = async () => {
	const args = parseArgs(process.argv.slice(2));
	const cwd = process.cwd();

	const loaded = args.roots ? null : await loadRuleOptions(cwd);
	const configOptions = loaded ? { ...loaded.options } : {};
	if (loaded) {
		console.log(`[component-uniqueness] config from ${loaded.source}`);
	}
	if (args.ignoreDirs) {
		const base = Array.isArray(configOptions.ignoreDirs) ? configOptions.ignoreDirs : [];
		configOptions.ignoreDirs = [...new Set([...base, ...args.ignoreDirs])];
	}

	const config = normalizeOptions(configOptions);
	if (args.include) config.include = [...new Set([...(config.include || []), ...args.include])];
	if (args.log) log.enable(args.log);
	await require("./playgrounds/style-entrypoint.js").whenReady(config);
	const rootMarkers = config.rootMarkers;
	const repoRoot = args.repoRoot ? path.resolve(cwd, args.repoRoot) : findRepoRoot(cwd, rootMarkers) || cwd;

	const configRoots = (config.componentsFolder || []).map((d) => String(d).replace(/\\/g, "/").replace(/\/+$/, ""));
	const roots = args.roots || configRoots;
	if (!roots || roots.length === 0) {
		fail("no scan roots: pass --roots <dir1>:<dir2> or set componentsFolder in the rule options (eslint.config.js / component-uniqueness.config.js)");
	}

	const outPath = resolveAgainst(args.out || config.catalogPath, repoRoot);
	const registry = args.registry ? loadRegistry({ ...config, registry: null, registryPath: args.registry }) : loadRegistry(config);
	const catalogComponents = ((loadCatalog(config) || {}).components) || [];

	const include = config.include;
	const exclude = config.exclude;
	const shouldSkip = (abs) => isIgnored(relPosix(repoRoot, abs), include, exclude);
	const exts = config.exts;
	const ignoreDirs = config.ignoreDirs;

	const shouldSkipCanon = (abs) => isIgnored(relPosix(repoRoot, abs), [], config.exclude);
	const canonFiles = collectFiles(roots, repoRoot, shouldSkipCanon, null, exts, ignoreDirs).files;
	const canonComponents = parseComponents(canonFiles, null, config);
	const canonNames = new Set(canonComponents.map((c) => c.name));
	const final = parseComponents(canonFiles, canonNames, config);

	if (args.check) {
		let current = null;
		try {
			current = JSON.parse(fs.readFileSync(outPath, "utf8"));
		} catch {}
		const same = current && JSON.stringify(current.components || []) === JSON.stringify(final);
		if (!same) {
			fail(`catalog is out of date (${final.length} component(s) expected at ${path.relative(repoRoot, outPath)}); regenerate it (node main.js)`);
		}
		console.log(`[component-uniqueness] catalog up to date (${final.length} component(s))`);
		return;
	}

	writeCatalog(outPath, final);
	const tagCount = new Set(final.map((c) => (c.rootTags || [])[0]).filter(Boolean)).size;
	console.log(`[component-uniqueness] wrote ${path.relative(repoRoot, outPath)} (${final.length} component(s), ${tagCount} root tag(s), ${canonFiles.length} file(s) scanned)`);

	if (args.report) {
		const reportPath = path.isAbsolute(args.report) ? args.report : path.resolve(process.cwd(), args.report);
		const comp = await buildComponentReport(args, repoRoot, roots, shouldSkip, config, registry, catalogComponents);
		fs.mkdirSync(path.dirname(reportPath), { recursive: true });
		fs.writeFileSync(reportPath, renderComponentReport(comp, args.verbose));
		console.log(`[component-uniqueness] wrote report ${reportPath} (${comp.matches.length} duplicate component(s), ${comp.rawHtml.length} raw-html element(s) across ${comp.files} file(s))`);
	}
	log.flush();
};

if (require.main === module) {
	main().catch((err) => {
		fail(err && err.message ? err.message : String(err));
	});
}

module.exports = {
	buildCandidate,
	parseComponents,
	matchPairs,
	applyFilters,
	collectRawHtml,
	findParts,
	frameworkMatcher,
};
