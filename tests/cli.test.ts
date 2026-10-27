import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const pluginDir = path.resolve(__dirname, "..");
const mainJs = path.join(pluginDir, "main.js");
const tmpRoot = mkdtempSync(path.join(os.tmpdir(), "cu-cli-"));

const runCli = (args: string[], opts: { cwd?: string } = {}) => {
	const stdout = execFileSync(process.execPath, [mainJs, ...args], {
		cwd: opts.cwd || pluginDir,
		encoding: "utf8",
		stdio: ["ignore", "pipe", "pipe"],
		timeout: 240000,
	});

	return stdout;
};

const baseArgs = (report: string) => ["--repo-root", ".", "--roots", "tests/components/lib:tests/components/lib/styled:tests/components/lib/mui", "--app-roots", "tests/components/duplicates:tests/components/NOT_duplicates", "--report", report];

const readReport = (report: string) => readFileSync(path.join(pluginDir, report), "utf8");

describe("CLI", () => {
	it("prints usage and exits 0 on --help", () => {
		const out = runCli(["--help"]);

		expect(out).toContain("Usage: component-uniqueness");
		expect(out).toContain("--thresholds");
	});

	it("fails with exit 1 on unknown argument", () => {
		expect(() => runCli(["--nope"])).toThrow();
	});

	it("runs the full pipeline with CLI flags", () => {
		const report = `cli-flags.md`;
		runCli(baseArgs(report).concat(["--raw-html", "--parts", "--verbose"]));
		const md = readReport(report);

		expect(md).toContain("# Component duplicates (component-level funnel)");
expect(md).toMatch(/Scanned 31 app file\(s\), 32 app component\(s\) against 29 canonical component\(s\)\./);
		expect(md).toContain("## Duplicate (confidence ≥ threshold) (");
		expect(md).toContain("| FullBadgeDup |");
		expect(md).toContain("| Badge |");
		expect(md).toContain("## Raw HTML outside canonical packages (");
		expect(md).toContain("raw/RawButtons.tsx");
		expect(md).toContain("## Partial duplicates (parts) (");
		expect(md).toContain("MuiFormOverrideDup");
		expect(md).toContain("## Potentially missing component (");
		expect(md).toContain("## Filtered out by `drop-usages` (");
		expect(md).toContain("MuiBadgeDup");
	}, 30_000);

	it("applies --thresholds override (high threshold removes duplicates)", () => {
		const report = "cli-thresholds.md";
		runCli(baseArgs(report).concat(["--thresholds", "0.99:0.98"]));
		const md = readReport(report);

		expect(md).toContain("Found 0 duplicate component(s) and 0 similar component(s)");
		expect(md).not.toContain("## Duplicate (confidence ≥ threshold)");
		expect(md).not.toContain("## Similar (below duplicate threshold)");
	}, 30_000);

	it("reads options from --config file", () => {
		const report = "cli-config.md";
		runCli(["--repo-root", ".", "--config", "tests/eslint.config.js", "--app-roots", "tests/components/duplicates:tests/components/NOT_duplicates", "--report", report]);
		const md = readReport(report);

		expect(md).toContain("against 29 canonical component(s)");
		expect(md).toContain("## Raw HTML outside canonical packages (");
		expect(md).toContain("## Partial duplicates (parts) (");
	}, 30_000);

	it("honors --min-cluster 2 so small clusters are detected", () => {
		const report = "cli-mincluster.md";
		runCli(baseArgs(report).concat(["--min-cluster", "2"]));
		const md = readReport(report);

		expect(md).toContain("## Potentially missing component (");
	}, 30_000);

	it("writes a JSONL stage log with --log", () => {
		const report = "cli-log.md";
		const logFile = path.join(tmpRoot, "stage.log");
		runCli(baseArgs(report).concat(["--log", logFile]));

		expect(existsSync(logFile)).toBe(true);
		const lines = readFileSync(logFile, "utf8").trim().split("\n").filter(Boolean);
		expect(lines.length).toBeGreaterThan(0);
		const stages = new Set(lines.map((l) => JSON.parse(l).stage));
		expect(stages.has("normalizer:before")).toBe(true);
		expect(stages.has("matcher:after")).toBe(true);
		expect(stages.has("decision:after")).toBe(true);
		expect(stages.has("missing-component")).toBe(true);
	}, 30_000);

	it("restricts app files with --include", () => {
		const report = "cli-include.md";
		runCli(["--repo-root", ".", "--roots", "tests/components/lib:tests/components/lib/styled:tests/components/lib/mui", "--report", report, "--include", "tests/components/duplicates/FullBadgeDup.tsx"]);
		const md = readReport(report);

		expect(md).toMatch(/Scanned 1 app file\(s\), 1 app component\(s\)/);
		expect(md).toContain("| FullBadgeDup |");
	}, 30_000);

	it("explicit --app-roots are not filtered out by a non-matching config include", () => {
		const report = "cli-approots-include.md";
		runCli(["--repo-root", ".", "--config", "tests/eslint.config.approots.js", "--app-roots", "tests/components/duplicates:tests/components/NOT_duplicates", "--report", report]);
		const md = readReport(report);

expect(md).toMatch(/Scanned 31 app file\(s\), 32 app component\(s\) against 29 canonical component\(s\)\./);
		expect(md).toContain("| FullBadgeDup |");
	}, 30_000);

	it("exits 1 when --check finds a stale catalog", () => {
		const stale = path.join(tmpRoot, "stale-catalog.json");
		const { writeFileSync } = require("node:fs");
		writeFileSync(stale, JSON.stringify({ components: [] }));
		expect(() => runCli(["--repo-root", ".", "--roots", "tests/components/lib", "--out", stale, "--check"])).toThrow();
	});

	it("--files scans only the listed files without roots and skips the catalog", () => {
		const report = "cli-files.md";
		const catalog = path.join(pluginDir, "reports", "component-catalog.json");
		const { existsSync } = require("node:fs");
		const before = existsSync(catalog) ? readFileSync(catalog, "utf8") : null;
		runCli(["--repo-root", ".", "--roots", "tests/components/lib", "--files", "tests/components/duplicates/FullBadgeDup.tsx", "--report", report]);
		const md = readReport(report);

		expect(md).toContain("Scanned 1 app file(s)");
		expect(md).toContain("| FullBadgeDup |");
		// a single-file scan must not clobber the folder-based catalog
		expect(existsSync(catalog) ? readFileSync(catalog, "utf8") : null).toBe(before);
	}, 30_000);

	it("--files silently skips missing files", () => {
		const report = "cli-files-missing.md";
		runCli(["--repo-root", ".", "--roots", "tests/components/lib", "--files", "tests/components/duplicates/does-not-exist.tsx", "--report", report]);
		const md = readReport(report);

		expect(md).toContain("Scanned 0 app file(s)");
	}, 30_000);
});
