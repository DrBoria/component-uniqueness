"use strict";

// Assemble the ONE JSON payload the overview renders.
//
// The MODEL states facts only: the two source spans (raw lines), the SEMANTIC
// links (which token matches which, per signal), the per-signal scores, the
// decision and the CLI block. It computes NO diff, NO character range, NO mark —
// code-diff does all of that in the browser from these facts. The HTML file is
// self-contained: openable from disk, no server, no network, no sidecar files.

import * as path from "node:path";
import * as pkg from "../../../package.json";
import { DEFAULT_WEIGHTS, DEFAULT_THRESHOLDS } from "../../../decision-maker";

import { describeComp } from "../../errorTypes";
import { findingText } from "../../cli-report";
import { SIGNALS } from "../../vocabulary/labels";
import { buildGroups } from "./groups";
import { buildFolders } from "./folders";
import * as source from "./source";
import { analyze } from "../../matchers";
import { linksBySignal } from "./links";
import { snapshotOf } from "./snapshot";
import { KIND } from "../../../constants";

// A pair (duplicate/similar) and a copied part are shown side-by-side; a missing
// cluster, raw-html element and filtered-out pair are informational rows.
const DIFFABLE = new Set([KIND.Duplicate, KIND.Similar, KIND.Part]);

const abs = (repoRoot, relPath) => (path.isAbsolute(relPath) ? relPath : path.resolve(repoRoot, relPath));

const spanForPlace = (repoRoot, item) => {
	if (!item || !item.path) return null;
	const span = source.spanOf(abs(repoRoot, item.path), item.line, item.endLine ?? item.line);

	return { name: item.name ?? null, path: item.path, line: item.line ?? span.startLine, startLine: span.startLine, endLine: span.endLine, lines: span.lines.map((l) => l.text), missing: span.missing };
};

// The CLI block for a pair: the single string the terminal prints for it.
const cliText = (finding, candidates) => findingText(finding, candidates);

const buildPair = ({ finding, repoRoot, candidates }) => {
	const left = spanForPlace(repoRoot, finding.left);
	const right = spanForPlace(repoRoot, finding.right);
	if (!left || !right || left.missing || right.missing) return null;

	const leftComp = candidates.get(`${finding.left.path}#${finding.left.name}`);
	const rightComp = candidates.get(`${finding.right?.path}#${finding.right?.name}`);
	// The matcher models read the ENGINE decision (signals keyed by name), not the
	// explained one (signals as an array of rows for the panel).
	const analysis = analyze(leftComp, rightComp, finding.evidence?.engine ?? null);
	const links = linksBySignal(analysis, left, right);
	// The expanded HTML snapshot and the screen-reader view of each side: the
	// material the Structure and Accessibility boards draw in their middle columns.
	const snapshots = { left: snapshotOf(leftComp, left), right: snapshotOf(rightComp, right) };

	return {
		findingId: finding.id,
		kind: finding.kind,
		columns: [{ path: finding.left.path }, { path: finding.right?.path }],
		left,
		right,
		links,
		analysis,
		snapshots,
		cli: cliText(finding, candidates),
	};
};

const countBy = (findings, key) => {
	const map = new Map();
	for (const finding of findings) map.set(finding[key], (map.get(finding[key]) ?? 0) + 1);

	return [...map.entries()].map(([value, count]) => ({ value, count }));
};

const collectOverviewData = ({ comp, repoRoot, config = {}, candidates = [], generatedAt }: any) => {
	const findings = describeComp(comp);
	const candidateMap = new Map(candidates.map((c) => [`${c.path}#${c.name}`, c]));

	const pairs = [];
	const pairsById = new Map();
	for (const finding of findings) {
		if (!DIFFABLE.has(finding.kind)) continue;
		const pair = buildPair({ finding, repoRoot, candidates: candidateMap });
		if (!pair) continue;
		pairs.push(pair);
		pairsById.set(finding.id, pair.findingId);
	}
	const withPair = findings.map((finding) => ({ ...finding, hasPair: pairsById.has(finding.id) }));
	withPair.sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0));

	const groups = buildGroups(withPair);
	const folders = buildFolders(withPair);
	const folderCount = (node) => 1 + node.children.reduce((sum, child) => sum + folderCount(child), 0);
	const roots = new Set(findings.map((f) => (f.left?.path ?? "").split("/")[0]).filter(Boolean));
	const weights = { ...DEFAULT_WEIGHTS, ...(config.weights ?? {}) };
	const thresholds = { ...DEFAULT_THRESHOLDS, ...(config.thresholds ?? {}) };

	return {
		meta: {
			tool: pkg.name,
			version: pkg.version,
			repoRoot,
			repoName: path.basename(repoRoot),
			generatedAt: generatedAt ?? new Date().toISOString(),
			scanRoots: config.componentsFolder ?? [],
			weights,
			thresholds,
			filesScanned: comp.files ?? 0,
			canonCount: comp.canonCount ?? 0,
			appCount: comp.appCount ?? 0,
			roots: [...roots],
		},
		stats: {
			findings: withPair.length,
			duplicates: withPair.filter((f) => f.kind === KIND.Duplicate).length,
			similar: withPair.filter((f) => f.kind === KIND.Similar).length,
			missing: withPair.filter((f) => f.kind === KIND.Missing).length,
			rawHtml: withPair.filter((f) => f.kind === KIND.RawHtml).length,
			parts: withPair.filter((f) => f.kind === KIND.Part).length,
			dropped: withPair.filter((f) => f.kind === KIND.Dropped).length,
			pairs: pairs.length,
			groups: groups.length,
			folders: folderCount(folders),
		},
		byKind: countBy(withPair, "kind"),
		signals: SIGNALS.map((s) => ({ key: s.key, label: s.label, short: s.short, color: s.color, what: s.what })),
		findings: withPair,
		pairs,
		groups,
		folders,
		decisions: { weights, thresholds },
	};
};

export {  collectOverviewData, spanForPlace  };