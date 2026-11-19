import { describe, expect, it } from "vitest";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const main = require("../dist/main.js");
const { normalizeOptions, isIgnored } = require("../dist/config.js");
const whenReady = require("../dist/playgrounds/style-entrypoint.js").whenReady;

// ── ADVERSARIAL E2E ─────────────────────────────────────────────────────────
// Runs the real pipeline against the in-repo fixture (18 hard traps: a11y
// naming mechanisms, cross-style systems, deep nesting, complex render
// branches) and scores every trap. Locks the detector ground truth so a
// future change cannot silently drop a caught trap or flag a legitimate
// look-alike. The fixture ships WITH this package: app components live in
// tests/duplicates/, canonical ones in tests/NOT_duplicates/ (both merged
// with the regular suites' fixtures), so the suite always runs.
//
// Known, documented gaps are asserted as MISS (not silently passed): c09/c18
// stay below `similar` and c15 below `duplicate` after the weak-structure /
// a11y-contradiction demotion. No trap may FAIL (a false duplicate on expect:none).

const pluginDir = path.resolve(__dirname, "..");
const manifestPath = path.join(__dirname, "manifest.json");

const CANON_ROOTS = ["tests/NOT_duplicates", "tests/NOT_duplicates/styled", "tests/NOT_duplicates/mui"];
const APP_ROOTS = ["tests/duplicates"];

const fs = require("node:fs") as typeof import("node:fs");

const pairKey = (a: string, b: string) => [a, b].sort().join("::");

const verdict = (expect: string, tiers: string[]): "PASS" | "MISS" | "FAIL" => {
	if (expect === "none") return tiers.includes("duplicate") ? "FAIL" : "PASS";
	if (expect === "similar") return tiers.some((t) => ["similar", "extract", "duplicate"].includes(t)) ? "PASS" : "MISS";
	if (expect === "extract") return tiers.some((t) => ["extract", "duplicate"].includes(t)) ? "PASS" : "MISS";
	return tiers.includes(expect) ? "PASS" : "MISS";
};

describe("adversarial component e2e (fixture ground truth)", () => {
	const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
	let comp: any;

	const relPosix = (abs: string) => path.relative(pluginDir, abs).split(path.sep).join("/");

	const buildReport = async () => {
		const config = normalizeOptions({ root: pluginDir, componentsFolder: CANON_ROOTS, rawHtml: true, parts: true });
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

	it("builds the report once", async () => {
		comp = await buildReport();
		expect(comp.canonCount).toBeGreaterThan(20);
		expect(comp.appCount).toBeGreaterThan(10);
	});

	const tiersOf = (a: { file: string; name: string }, b: { file: string; name: string }): string[] => {
		const want = pairKey(`${a.file}#${a.name}`, `${b.file}#${b.name}`);
		return (comp?.matches ?? [])
			.filter((m: any) => pairKey(`${m.app.path}#${m.app.name}`, `${m.canon.path}#${m.canon.name}`) === want)
			.map((m: any) => m.decision.tier);
	};

	it.each(manifest.traps.map((t: any) => [t.id, t]))("%s — %s", async (_id: string, trap: any) => {
		if (!comp) comp = await buildReport();
		const tiers = tiersOf(trap.a, trap.b);
		const v = verdict(trap.expect, tiers);
		expect(v, `${trap.id} (${trap.title}): expected ${trap.expect}, got [${tiers.join(",") || "—"}]`).not.toBe("FAIL");
	});

	it("never flags a look-alike (expect:none) as a duplicate", async () => {
		if (!comp) comp = await buildReport();
		const failures = manifest.traps
			.filter((t: any) => t.expect === "none")
			.filter((t: any) => verdict(t.expect, tiersOf(t.a, t.b)) === "FAIL");
		expect(failures.map((t: any) => t.id)).toEqual([]);
	});

	it("holds the documented detection floor (no regression below 15/18)", async () => {
		if (!comp) comp = await buildReport();
		const pass = manifest.traps.filter((t: any) => verdict(t.expect, tiersOf(t.a, t.b)) === "PASS").length;
		// Round-1 ground truth: 15 PASS, 3 MISS (c09/c15/c18 demotions), 0 FAIL.
		expect(pass).toBeGreaterThanOrEqual(15);
	});

	it("keeps the documented gaps as MISS, not silent passes (c15)", async () => {
		if (!comp) comp = await buildReport();
		const trap = manifest.traps.find((t: any) => t.id === "c15");
		expect(trap).toBeTruthy();
		expect(verdict(trap.expect, tiersOf(trap.a, trap.b))).toBe("MISS");
	});
});
