"use strict";

// The NAME CLI text: the score and how the names matched.

const pct = (n) => `${Math.round((n ?? 0) * 100)}%`;

const text = (model) => {
	if (!model || !model.hasEvidence) return [];
	const ev = model.evidence ?? {};
	const row = model.rows[0];
	const head = `${pct(model.score)}  ${row.left.name} ↔ ${row.right.name}`;
	const lines = [head];
	if (ev.matchType) lines.push(`match  ${ev.matchType}${ev.wordSim != null ? `  ·  word overlap ${pct(ev.wordSim)}` : ""}`);

	return lines;
};

export {  text  };