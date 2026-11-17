"use strict";

// One explanation per pair, in the SAME shape the entities report uses, so the
// DecisionPanel, the signal pills and the CLI verdict rows read it unchanged.
//
// `decision` is what the component `decide()` returned: it carries `signals`
// (score + evidence per group), `weights` and `thresholds`. This module only
// turns those numbers into the reader's words — it never re-decides.

import { SIGNALS } from "./vocabulary/labels";
import { PHRASES, fill } from "./vocabulary/phrases";
import { num, pct, showValue } from "./vocabulary/format";
import { labelOfEvidence } from "./vocabulary/evidence";
import { KIND, TIER, TONE } from "../constants";

const chips = (evidence) =>
	Object.entries(evidence ?? {})
		.filter(([, value]) => value !== undefined && value !== null)
		.map(([key, value]) => ({ key, label: labelOfEvidence(key), value: showValue(value) }));

// The share of the verdict each signal produced: weight × score over the total.
const contributionOf = (decision, key, totalWeight) => {
	const score = decision.signals?.[key]?.score ?? 0;
	const weight = decision.weights?.[key] ?? 0;

	return (weight * score) / (totalWeight || 1);
};

const explain = (decision) => {
	const totalWeight = SIGNALS.reduce((sum, s) => sum + (decision.weights?.[s.key] ?? 0), 0) || 1;

	const rows = SIGNALS.map((signal) => {
		const sig = decision.signals?.[signal.key] ?? {};
		const score = sig.score ?? 0;
		const weight = decision.weights?.[signal.key] ?? 0;
		// A signal whose weight was zeroed (no evidence / not applicable) is OFF:
		// it neither supports nor refutes the verdict.
		const applied = weight > 0;
		const contribution = contributionOf(decision, signal.key, totalWeight);

		return {
			key: signal.key,
			label: signal.label,
			short: signal.short,
			color: signal.color,
			what: signal.what,
			score,
			weight,
			contribution,
			applied,
			evidence: chips(sig.evidence),
		};
	});

	const why = [];
	for (const row of [...rows].sort((a, b) => b.contribution - a.contribution)) {
		if (!row.applied) {
			why.push({ tone: TONE.Off, signal: row.key, text: fill(PHRASES.signalOff, { label: row.label }) });
			continue;
		}
		const template = row.score >= 0.6 ? PHRASES.signal : PHRASES.signalDisagrees;
		why.push({
			tone: row.score >= 0.6 ? TONE.Agree : TONE.Disagree,
			signal: row.key,
			text: fill(template, { label: row.label, score: num(row.score), weight: pct(row.weight), what: row.what }),
		});
	}

	const verdict = decision.tier === TIER.Duplicate ? KIND.Duplicate : decision.tier === TIER.Similar ? KIND.Similar : "none";

	return {
		confidence: decision.confidence ?? 0,
		tier: decision.tier,
		verdict,
		thresholds: decision.thresholds ?? {},
		weights: decision.weights ?? {},
		vetoes: [],
		signals: rows,
		why,
		headline: (() => {
			const top = [...rows].sort((a, b) => b.contribution - a.contribution)[0];
			return fill(PHRASES.headline, { confidence: num(decision.confidence), top: top ? top.label : "—", share: pct(top ? top.contribution : 0) });
		})(),
	};
};

export {  explain  };