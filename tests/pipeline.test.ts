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

const buildConfig = () => {
	const config = normalizeOptions({
		root: pluginDir,
		componentsFolder: CANON_ROOTS,
		rawHtml: true,
		parts: true,
		thresholds: { duplicate: 0.4, similar: 0.2 },
	});

	return config;
};

describe("normalizeOptions", () => {
	it("normalizes componentsFolder to posix paths with trailing slash", () => {
		const config = buildConfig();

		expect(config.root).toBe(pluginDir);
		expect(config.componentsFolder).toEqual(["tests/components/lib/", "tests/components/lib/styled/", "tests/components/lib/mui/"]);
		expect(config.rawHtml).toBe(true);
		expect(config.parts).toBe(true);
		expect(config.framework).toBe("react");
		expect(config.styleSystem).toBe("tailwind");
	});

	it("applies default excludes", () => {
		const config = buildConfig();

		expect(config.exclude).toContain("*.test.*");
		expect(config.exclude).toContain("*.stories.*");
	});
});

describe("buildComponentReport", () => {
	it("finds full duplicates, cross-style duplicates, raw html, parts and drops usages", async () => {
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

		expect(comp.files).toBe(31);
		expect(comp.canonCount).toBe(29);

		const dupMatches = comp.matches.filter((m: any) => m.decision.tier === "duplicate");
		const dupApps = dupMatches.map((m: any) => m.app.name);

		expect(dupApps).toContain("FullBadgeDup");
		const badgeMatch = dupMatches.find((m: any) => m.app.name === "FullBadgeDup");
		expect(badgeMatch.canon.name).toBe("Badge");
		expect(badgeMatch.decision.confidence).toBeGreaterThanOrEqual(0.4);

		const notDupNames = new Set(comp.matches.map((m: any) => m.app.name));
		expect(notDupNames.has("NotDupTag")).toBe(false);
		expect(notDupNames.has("NotDupPanel")).toBe(false);
		expect(notDupNames.has("NotDupCard")).toBe(false);

		const rawButtons = comp.rawHtml.filter((r: any) => r.path.includes("raw/RawButtons.tsx"));
		expect(rawButtons.length).toBeGreaterThanOrEqual(2);
		expect(rawButtons.every((r: any) => r.suggestion.component === "Button")).toBe(true);

		const rawModal = comp.rawHtml.filter((r: any) => r.path.includes("raw/RawModalLike.tsx"));
		expect(rawModal.length).toBeGreaterThanOrEqual(3);

		const parts = comp.parts;
		expect(parts.length).toBeGreaterThanOrEqual(4);
		const formPart = parts.find((p: any) => p.owner === "MuiFormOverrideDup");
		expect(formPart).toBeTruthy();
		expect(formPart.suggestions[0].component).toBe("MuiForm");
		expect(formPart.suggestions[1].component).toBe("MuiFormOverride");

		const hintParts = parts.filter((p: any) => p.owner === "HintList");
		for (const p of hintParts) {
			const passthrough = p.suggestions.find((s: any) => s.component === "Passthrough" || s.component === "MuiPassthrough");
			expect(passthrough ? passthrough.confidence : 0).toBeLessThan(0.4);
		}

		const droppedBadges = comp.dropped.filter((d: any) => d.match.app.name === "MuiBadgeDup");
		expect(droppedBadges.length).toBe(1);
		expect(droppedBadges[0].filter).toBe("drop-usages");
		expect(droppedBadges[0].match.canon.name).toBe("Badge");

		const clusters = comp.missingClusters;
		expect(clusters.length).toBeGreaterThanOrEqual(3);
		const modalCluster = clusters.find((c: any) => c.canon.name === "Modal");
		expect(modalCluster).toBeTruthy();
		const modalApps = modalCluster.matches.map((m: any) => m.app.name);
		expect(modalApps).toContain("FullModalDup");
		expect(modalApps).toContain("TailwindModalDup");
		expect(modalApps).toContain("RawModalLike");

		const buttonCluster = clusters.find((c: any) => c.canon.name === "Button");
		expect(buttonCluster).toBeTruthy();
		const buttonApps = buttonCluster.matches.map((m: any) => m.app.name);
		expect(buttonApps).toContain("PrimaryAction");
		expect(buttonApps).toContain("SecondaryAction");
		expect(buttonApps).toContain("TertiaryAction");
		expect(buttonApps).not.toContain("SaveButton");
		expect(buttonApps).not.toContain("LinkButton");

		const cardCluster = clusters.find((c: any) => c.canon.name === "DataCard");
		expect(cardCluster).toBeTruthy();
		const cardApps = cardCluster.matches.map((m: any) => m.app.name);
		expect(cardApps).toContain("PatientCard");
		expect(cardApps).toContain("LabResultCard");
		expect(cardApps).toContain("VitalsCard");

		const panelCluster = clusters.find((c: any) => c.canon.name === "DetailPanel");
		expect(panelCluster).toBeTruthy();
		const panelApps = panelCluster.matches.map((m: any) => m.app.name);
		expect(panelApps).toContain("PatientSummaryPanel");
		expect(panelApps).toContain("LabOrderPanel");
		expect(panelApps).toContain("VitalsTrendPanel");

		const trapApps = new Set(["SaveButton", "DeleteButton", "LinkButton", "IntakeForm"]);
		const clusteredTrapApps = new Set(clusters.flatMap((c: any) => c.matches.map((m: any) => m.app.name)));
		for (const trap of trapApps) expect(clusteredTrapApps.has(trap)).toBe(false);

		const clusterNames = clusters.map((c: any) => c.name);
		expect(new Set(clusterNames).size).toBe(clusterNames.length);

		const clusterApps = new Set(clusters.flatMap((c: any) => c.matches.map((m: any) => m.app.name)));
		expect(clusterApps.has("FullModalDup")).toBe(true);
		const matchApps = new Set(comp.matches.map((m: any) => m.app.name));
		expect(matchApps.has("FullModalDup")).toBe(false);
	}, 120000);
});
