"use strict";

// ── MATCHERS · the one registry ─────────────────────────────────────────────
//
// The five comparison groups each live in their own folder with their own MODEL
// and their own CLI TEXT:
//
//   matchers/structure/   { model.js, text.js }
//   matchers/behavior/
//   matchers/a11y/
//   matchers/framework/
//   matchers/name/
//
// This registry binds them by the SIGNAL key the engine uses, so the page, the
// markdown report and the decision can never disagree about which group is which.
//
// The component engine already scored every pair: `decision.signals[key]` carries
// {score, evidence}. `analyze(left, right, decision)` arranges those facts into
// one model per signal; `describe` produces the CLI lines. No re-deciding here.

import { SIGNAL, SIGNAL_ORDER } from "../../constants";

const structure = { key: SIGNAL.Structure, model: require("./structure/model"), text: require("./structure/text") };
const styles = { key: SIGNAL.Styles, model: require("./styles/model"), text: require("./styles/text") };
const behavior = { key: SIGNAL.Behavior, model: require("./behavior/model"), text: require("./behavior/text") };
const a11y = { key: SIGNAL.A11y, model: require("./a11y/model"), text: require("./a11y/text") };
const framework = { key: SIGNAL.Framework, model: require("./framework/model"), text: require("./framework/text") };
const name = { key: SIGNAL.Name, model: require("./name/model"), text: require("./name/text") };

const BY_KEY = new Map<string, any>([
	[structure.key, structure],
	[styles.key, styles],
	[behavior.key, behavior],
	[a11y.key, a11y],
	[framework.key, framework],
	[name.key, name],
]);

const MATCHERS = SIGNAL_ORDER.map((key) => BY_KEY.get(key)).filter(Boolean);

// Every model for one pair, keyed by SIGNAL: `{ structure: model, … }`.
const analyze = (left, right, decision) => {
	const out = {};
	for (const matcher of MATCHERS) {
		out[matcher.key] = matcher.model.build(left, right, decision?.signals?.[matcher.key] ?? null);
	}

	return out;
};

// The text lines for one pair, in the same order — used by the CLI report.
const describe = (left, right, decision) => {
	const out = [];
	for (const matcher of MATCHERS) {
		const model = matcher.model.build(left, right, decision?.signals?.[matcher.key] ?? null);
		if (!model) continue;
		const lines = matcher.text.text(model);
		if (lines.length > 0) out.push({ key: matcher.key, lines });
	}

	return out;
};

export const matcherOf = (key) => BY_KEY.get(key) ?? null;
export { MATCHERS, analyze, describe };