import { describe, expect, it } from "vitest";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const main = require("../main.js");
const { normalizeOptions, isIgnored } = require("../config.js");
const whenReady = require("../playgrounds/style-entrypoint.js").whenReady;

const pluginDir = path.resolve(__dirname, "..");
const relPosix = (abs: string) => path.relative(pluginDir, abs).split(path.sep).join("/");

const CANON_ROOTS = ["tests/components/lib", "tests/components/lib/styled", "tests/components/lib/mui"];
const APP_ROOTS = ["tests/components/duplicates", "tests/components/NOT_duplicates"];

const build = async () => {
	const config = normalizeOptions({
		root: pluginDir,
		componentsFolder: CANON_ROOTS,
		rawHtml: true,
		parts: true,
		thresholds: { duplicate: 0.4, similar: 0.2 },
	});
	await whenReady(config);

	const shouldSkip = (abs: string) => isIgnored(relPosix(abs), [], config.exclude);

	return main.buildComponentReport({ appRoots: APP_ROOTS, minCluster: 3, verbose: false, rawHtml: true, parts: true }, pluginDir, CANON_ROOTS, shouldSkip, config, null, []);
};

describe("fan-out guard", () => {
	it("no app component produces more than 2 similar matches", async () => {
		const comp = await build();
		const byApp = new Map<string, number>();
		for (const m of comp.matches) {
			if (m.decision.tier !== "similar") continue;
			byApp.set(m.app.name, (byApp.get(m.app.name) || 0) + 1);
		}
		const offenders = [...byApp.entries()].filter(([, count]) => count > 2);

		expect(offenders).toEqual([]);
	}, 120000);

	it("a generic div-with-children block is similar to at most two canons", async () => {
		const comp = await build();
		const generic = comp.matches.filter((m: any) => m.app.name === "GenericBlock");

		expect(generic.length).toBeLessThanOrEqual(2);
	}, 120000);

	it("a trivial submit button is similar to at most two canons", async () => {
		const comp = await build();
		const tiny = comp.matches.filter((m: any) => m.app.name === "TinySubmit");

		expect(tiny.length).toBeLessThanOrEqual(2);
	}, 120000);

	it("a generic block does not flood the potentially-missing clusters", async () => {
		const comp = await build();
		const genericInClusters = comp.missingClusters.flatMap((c: any) => c.matches.filter((m: any) => m.app.name === "GenericBlock"));

		expect(genericInClusters.length).toBeLessThanOrEqual(2);
	}, 120000);

	it("a real duplicate with matching classes is still flagged as duplicate", async () => {
		const comp = await build();
		const paper = comp.matches.find((m: any) => m.app.name === "PaperDup" && m.canon.name === "Paper");

		expect(paper).toBeTruthy();
		expect(paper.decision.tier).toBe("duplicate");
	}, 120000);
});
