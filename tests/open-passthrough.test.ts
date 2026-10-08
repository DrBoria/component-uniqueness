import { describe, expect, it } from "vitest";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { matchSignals } = require("../matcher/index.js");
const { getFrameworkMatcher } = require("../matcher/framework/index.js");
const { decide } = require("../decision-maker.js");

const frameworkMatcher = getFrameworkMatcher("react");

const makePart = (props: string[]) => ({
	name: "Hint",
	path: "tests/components/NOT_duplicates/HintList.tsx",
	partial: true,
	dom: { tree: { tag: "div", css: {}, children: [] }, available: true },
	framework: { props, events: [], names: [], open: false },
	a11y: [],
	rawClasses: [],
});

const makeOpenCanon = (name: string) => ({
	name,
	path: `tests/components/lib/${name}.tsx`,
	partial: false,
	dom: { tree: { tag: "div", css: {}, children: [] }, available: true },
	framework: { props: [], events: [], names: [], open: true },
	a11y: [],
	rawClasses: [],
});

describe("open passthrough canonical (framework=1.00 regression)", () => {
	it("does not inherit the candidate's props into an open canonical", () => {
		const candidate = makePart(["className", "data-index"]);
		const canon = makeOpenCanon("Passthrough");
		const signals = matchSignals(candidate, canon, { canonNames: ["Passthrough"], frameworkMatcher });

		expect(signals.framework.evidence.canonicalProps).toEqual([]);
		expect(signals.framework.score).toBe(0);
	});

	it("scores an unrelated prop-bearing part against an open canonical as not a duplicate", () => {
		const candidate = makePart(["className", "data-index"]);
		const canon = makeOpenCanon("Passthrough");
		const signals = matchSignals(candidate, canon, { canonNames: ["Passthrough"], frameworkMatcher });
		const decision = decide(candidate, canon, { signals, weights: {}, thresholds: { duplicate: 0.4, similar: 0.2 } });

		expect(decision.tier).toBeNull();
		expect(decision.isDuplicate).toBe(false);
		expect(decision.confidence).toBe(0);
	});

	it("still matches a prop-bearing part against a non-open canonical that shares props", () => {
		const candidate = makePart(["className", "data-index"]);
		const canon = {
			...makeOpenCanon("Box"),
			framework: { props: ["className", "data-index"], events: [], names: [], open: false },
		};
		const signals = matchSignals(candidate, canon, { canonNames: ["Box"], frameworkMatcher });

		expect(signals.framework.evidence.canonicalProps).toEqual(["className", "data-index"]);
		expect(signals.framework.score).toBeGreaterThan(0);
	});
});
