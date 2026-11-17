import { describe, expect, it } from "vitest";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { matchSignals } = require("../dist/matcher/index.js");
const { getFrameworkMatcher } = require("../dist/matcher/framework/index.js");
const { decide } = require("../dist/decision-maker.js");

const frameworkMatcher = getFrameworkMatcher("react");

const makePart = (props: string[], usages: any[] = []) => ({
	name: "Hint",
	path: "tests/components/NOT_duplicates/HintList.tsx",
	partial: true,
	dom: { tree: { tag: "div", css: {}, children: [] }, available: true },
	framework: { props, events: [], names: [], usages, open: false },
	a11y: [],
	rawClasses: [],
});

const makeOpenCanon = (name: string) => ({
	name,
	path: `tests/components/lib/${name}.tsx`,
	partial: false,
	dom: { tree: { tag: "div", css: {}, children: [] }, available: true },
	framework: { props: [], events: [], names: [], usages: [], open: true },
	a11y: [],
	rawClasses: [],
});

describe("open passthrough canonical (framework=1.00 regression)", () => {
	it("does not inherit the candidate's usages into an open canonical", () => {
		const candidate = makePart(["className", "data-index"], [{ name: "Button", props: ["onClick"], line: 3 }]);
		const canon = makeOpenCanon("Passthrough");
		const signals = matchSignals(candidate, canon, { canonNames: ["Passthrough"], frameworkMatcher });

		expect(signals.framework.evidence.canonicalUsages).toEqual([]);
		expect(signals.framework.score).toBe(0);
	});

	it("scores an unrelated prop-bearing part against an open canonical as not a duplicate", () => {
		const candidate = makePart(["className", "data-index"], [{ name: "Button", props: ["onClick"], line: 3 }]);
		const canon = makeOpenCanon("Passthrough");
		const signals = matchSignals(candidate, canon, { canonNames: ["Passthrough"], frameworkMatcher });
		const decision = decide(candidate, canon, { signals, weights: {}, thresholds: { duplicate: 0.4, similar: 0.2 } });

		expect(decision.tier).toBeNull();
		expect(decision.isDuplicate).toBe(false);
		expect(decision.confidence).toBe(0);
	});

	it("still matches a part against a non-open canonical that uses the same component", () => {
		const candidate = makePart(["className", "data-index"], [{ name: "Box", props: ["className"], line: 3 }]);
		const canon = {
			...makeOpenCanon("Box"),
			framework: { props: ["className", "data-index"], events: [], names: [], usages: [{ name: "Box", props: ["className"], line: 5 }], open: false },
		};
		const signals = matchSignals(candidate, canon, { canonNames: ["Box"], frameworkMatcher });

		expect(signals.framework.evidence.canonicalUsages).toEqual(["Box"]);
		expect(signals.framework.score).toBeGreaterThan(0);
	});
});
