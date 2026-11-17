import { describe, expect, it } from "vitest";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const main = require("../dist/main.js");
const { normalizeOptions, isIgnored } = require("../dist/config.js");
const whenReady = require("../dist/playgrounds/style-entrypoint.js").whenReady;
const { SIGNAL, KIND } = require("../dist/constants.js");
const { SIGNALS, signalOf, kindOf } = require("../dist/report/vocabulary/labels.js");
const { explain } = require("../dist/report/explain.js");
const { describeComp } = require("../dist/report/errorTypes/index.js");
const { collectOverviewData } = require("../dist/report/user-report/data/collect.js");

const pluginDir = path.resolve(__dirname, "..");
const relPosix = (abs: string) => path.relative(pluginDir, abs).split(path.sep).join("/");

const CANON_ROOTS = ["tests/components/lib", "tests/components/lib/styled", "tests/components/lib/mui"];
const APP_ROOTS = ["tests/components/duplicates", "tests/components/NOT_duplicates"];

const buildConfig = () =>
	normalizeOptions({
		root: pluginDir,
		componentsFolder: CANON_ROOTS,
		rawHtml: true,
		parts: true,
		thresholds: { duplicate: 0.4, similar: 0.2 },
	});

const buildComp = async () => {
	const config = buildConfig();
	await whenReady(config);
	const shouldSkip = (abs: string) => isIgnored(relPosix(abs), [], config.exclude);

	return main.buildComponentReport(
		{ appRoots: APP_ROOTS, minCluster: 3, verbose: false, rawHtml: true, parts: true },
		pluginDir,
		CANON_ROOTS,
		shouldSkip,
		config,
		null,
		[],
	);
};

describe("report vocabulary", () => {
	it("names the six component signals in order", () => {
		expect(SIGNALS.map((s: any) => s.key)).toEqual([
			SIGNAL.Structure,
			SIGNAL.Styles,
			SIGNAL.Behavior,
			SIGNAL.A11y,
			SIGNAL.Framework,
			SIGNAL.Name,
		]);
		expect(signalOf(SIGNAL.Structure).label).toBe("Structure");
		expect(signalOf("nope").key).toBe(SIGNAL.Structure);
	});

	it("colours every kind", () => {
		for (const key of Object.values(KIND)) {
			expect(kindOf(key).color).toMatch(/^#[0-9a-f]{6}$/i);
		}
	});
});

describe("explain", () => {
	it("turns a decision into one row per signal with a contribution", async () => {
		const comp = await buildComp();
		const match = comp.matches.find((m: any) => m.decision.tier === "duplicate");
		expect(match).toBeTruthy();

		const decision = explain(match.decision);
		expect(decision.signals).toHaveLength(SIGNALS.length);
		expect(decision.confidence).toBeCloseTo(match.decision.confidence, 5);
		const total = decision.signals.reduce((sum: number, s: any) => sum + s.contribution, 0);
		expect(total).toBeCloseTo(match.decision.confidence, 5);
		expect(decision.why.length).toBeGreaterThan(0);
		expect(decision.headline).toContain("confidence");
	});
});

describe("describeComp", () => {
	it("produces findings of every kind the run found", async () => {
		const comp = await buildComp();
		const findings = describeComp(comp);
		const kinds = new Set(findings.map((f: any) => f.kind));

		expect(kinds.has(KIND.Duplicate)).toBe(true);
		expect(kinds.has(KIND.RawHtml)).toBe(true);
		expect(kinds.has(KIND.Part)).toBe(true);
		expect(kinds.has(KIND.Missing)).toBe(true);
		for (const f of findings) {
			expect(f.id).toBeTruthy();
			expect(f.message).toBeTruthy();
			expect(f.color).toMatch(/^#[0-9a-f]{6}$/i);
		}
	});
});

describe("collectOverviewData", () => {
	it("assembles a payload with pairs, links per signal and source spans", async () => {
		const comp = await buildComp();
		const config = buildConfig();
		const data = collectOverviewData({ comp, repoRoot: pluginDir, config, candidates: comp.candidates });

		expect(data.meta.tool).toBe("@md-code/component-uniqueness");
		expect(data.signals.map((s: any) => s.key)).toEqual(SIGNALS.map((s: any) => s.key));
		expect(data.pairs.length).toBeGreaterThan(0);
		expect(data.stats.duplicates).toBeGreaterThan(0);

		const pair = data.pairs.find((p: any) => p.kind === KIND.Duplicate);
		expect(pair).toBeTruthy();
		// Every signal key is present in the links map.
		expect(Object.keys(pair.links).sort()).toEqual([...SIGNALS.map((s: any) => s.key)].sort());
		// The duplicate has at least one semantic link somewhere.
		const totalLinks = Object.values(pair.links).reduce((n: number, l: any) => n + l.length, 0);
		expect(totalLinks).toBeGreaterThan(0);
		// Source spans carry real lines.
		expect(pair.left.lines.length).toBeGreaterThan(0);
		expect(pair.right.lines.length).toBeGreaterThan(0);
		expect(typeof pair.cli).toBe("string");
	});

	it("a copied part is a FULL pair: both snapshots, the canon body span, red lanes", async () => {
		const comp = await buildComp();
		const config = buildConfig();
		const data = collectOverviewData({ comp, repoRoot: pluginDir, config, candidates: comp.candidates });

		const pair = data.pairs.find((p: any) => p.kind === KIND.Part);
		expect(pair).toBeTruthy();
		// The part's own parsed tree AND the canonical's are both on the payload —
		// the snapshot boards draw from them; without them the board was empty.
		expect(pair.snapshots.left?.html?.length).toBeGreaterThan(0);
		expect(pair.snapshots.right?.html?.length).toBeGreaterThan(0);
		// The right span is the canonical BODY, not its first line (a type alias).
		expect(pair.right.lines.length).toBeGreaterThan(1);
		// Every shared correspondence is red (`same`); green is one-sided only.
		const links = Object.values(pair.links).flat() as any[];
		expect(links.length).toBeGreaterThan(0);
		for (const link of links) {
			const oneSided = link.left === null || link.right === null;
			expect(link.tone).toBe(oneSided ? "differs" : "same");
		}
		// The decision is explained: the panel and the CLI read its signal rows.
		const finding = data.findings.find((f: any) => f.id === pair.findingId);
		expect(finding.decision?.signals?.length).toBe(SIGNALS.length);
		expect(finding.confidence).toBeGreaterThan(0);
	});

	it("the structure board pairs interactive elements the way the engine does", async () => {
		const { rowSim } = await import("../report/user-report/src/domain/snapshot-board");
		// input ↔ button: two controls are the SAME kind of thing (the engine's
		// interactive rule). Without it a real duplicate showed an empty board.
		expect(rowSim({ tag: "input" }, { tag: "button" })).toBe(1);
		expect(rowSim({ tag: "input", css: { display: "flex" } }, { tag: "button" })).toBeGreaterThanOrEqual(0.5);
		// Unrelated non-interactive tags still do not pair.
		expect(rowSim({ tag: "img" }, { tag: "table" })).toBe(0);
	});

	it("no board column ever renders a textless fold placeholder", async () => {
		const comp = await buildComp();
		const config = buildConfig();
		const data = collectOverviewData({ comp, repoRoot: pluginDir, config, candidates: comp.candidates });
		const { buildSnapshotBoard } = await import("../report/user-report/src/domain/snapshot-board");

		let checked = 0;
		for (const pair of data.pairs) {
			const board = buildSnapshotBoard(pair, "structure");
			if (!board) continue;
			checked += 1;
			// The derived columns (snapshot/match) must never hold a textless
			// placeholder — it used to leak its raw id (`fold-end-0`) onto the
			// screen. Code columns may legitimately hold blank source lines.
			for (const column of board.columns.filter((c: any) => ["1", "2", "3"].includes(c.id))) {
				for (const item of column.items ?? []) {
					expect(typeof item.text).toBe("string");
					expect(item.text.length).toBeGreaterThan(0);
				}
			}
		}
		expect(checked).toBeGreaterThan(0);
	});
});