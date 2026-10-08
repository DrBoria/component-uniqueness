import { describe, expect, it } from "vitest";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const main = require("../main.js");
const { matchStructure } = require("../matcher/structure.js");
const { normalizeOptions, isIgnored } = require("../config.js");
const whenReady = require("../playgrounds/style-entrypoint.js").whenReady;

const pluginDir = path.resolve(__dirname, "..");
const relPosix = (abs: string) => path.relative(pluginDir, abs).split(path.sep).join("/");

// Canon: a dynamic list component (maps over props, renders rows with expression children)
const CANON_ROOTS = ["tests/components/fp/lib"];
// App: a static diagram/placeholder (no .map(), no {expr}, only literal text + static divs)
const APP_ROOTS = ["tests/components/fp/app"];

const buildConfig = () =>
	normalizeOptions({
		root: pluginDir,
		componentsFolder: CANON_ROOTS,
		rawHtml: true,
		parts: true,
		thresholds: { duplicate: 0.4, similar: 0.2 },
	});

// A normalized DOM node, in the exact shape `matchStructure` consumes
// (see normalize/dom.js `layoutOnly`).
const node = (tag: string, css: Record<string, string> = {}, text?: string, children: any[] = []) => ({
	tag,
	css,
	text,
	interactive: false,
	children,
});

// Build a partial candidate + canonical pair whose matched chain is a near-faithful
// copy of a list row: every node shares tag + styling EXCEPT the <strong>, whose text
// can differ between the candidate (a literal placeholder) and the canonical. That
// makes the AVERAGE per-node similarity ("quality") high while the MINIMUM is low.
const rowPair = (candidateStrongText: string, canonStrongText: string) => {
	const rowCss = { display: "flex", "align-items": "center", "justify-content": "space-between", border: "1px solid #ddd", padding: "8px 12px" };
	const minWCss = { "min-width": "0" };
	const titleCss = { "font-size": "14px", "font-weight": "600" };
	const detailCss = { "font-size": "12px", color: "#6b7280", overflow: "hidden" };
	const build = (text: string) =>
		node("div", rowCss, undefined, [
			node("div", minWCss, undefined, [
				node("div", titleCss, undefined, [node("strong", {}, text)]),
				node("span", detailCss, "shared detail text"),
			]),
		]);
	return {
		candidate: { partial: true, rootTag: "div", rawClasses: [], dom: { tree: build(candidateStrongText) } },
		canon: { name: "MatchList", rawClasses: [], dom: { tree: build(canonStrongText) } },
	};
};

describe("partial-duplicate false positives", () => {
	it("a near-faithful copy with one weak node is NOT a real partial duplicate (matcher level)", () => {
		// Faithful copy: every matched node is identical (min per-node sim = 1.0).
		// This is a genuine partial duplicate and MUST be kept.
		const faithful = rowPair("shared title text", "shared title text");
		const kept = matchStructure(faithful.candidate, faithful.canon);
		expect(kept.score).toBeGreaterThan(0.5);
		expect(kept.evidence.rejected).toBeUndefined();

		// Same layout, but the <strong> carries a different literal text. The average
		// per-node similarity ("quality") stays high (~0.9) because the other nodes are
		// byte-identical, but the minimum per-node similarity drops below the floor. This
		// is the false-positive shape: a generic container that merely resembles a list
		// row. It MUST be zeroed out.
		const weak = rowPair("totally different placeholder", "shared title text");
		const rejected = matchStructure(weak.candidate, weak.canon);
		expect(rejected.score).toBe(0);
		expect(rejected.evidence.rejected).toBe(true);
		expect(rejected.evidence.reason).toBe("node-sim-below-floor");

		// The discriminator is precisely the minimum, not the average: the weak pair's
		// quality is still high, so an average-based floor would not catch it.
		expect(rejected.evidence.quality).toBeGreaterThan(0.8);
		expect(rejected.evidence.minNodeSim).toBeLessThan(0.8);
	});

	it("static placeholder parts should NOT be flagged against a dynamic list component (e2e)", async () => {
		const config = buildConfig();
		await whenReady(config);

		const shouldSkip = (abs: string) => isIgnored(relPosix(abs), [], config.exclude);
		const comp = await main.buildComponentReport(
			{ appRoots: APP_ROOTS, minCluster: 3, verbose: false, rawHtml: true, parts: true },
			pluginDir,
			CANON_ROOTS,
			shouldSkip,
			config,
			null,
			[],
		);

		// The static DiagramBlock mirrors a list row's layout but is filled with
		// placeholder text. Under the old (average-only) logic it scored ~0.92 against
		// MatchList — a false "duplicate". The min per-node similarity floor must drop
		// it, so no part of it should be suggested at the similar tier.
		const allSuggestions = comp.parts.flatMap((p: any) =>
			p.suggestions.map((s: any) => ({ owner: p.owner, ...s })),
		);
		for (const s of allSuggestions) {
			expect(
				s.confidence,
				`${s.owner} part matched ${s.component} at ${s.confidence} — a static placeholder should stay below the similar threshold (0.2)`,
			).toBeLessThan(0.2);
		}
	});
});
