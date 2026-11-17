"use strict";

// The A11Y CLI text: the score, then the shared ARIA / test-id tokens.

const pct = (n) => `${Math.round((n ?? 0) * 100)}%`;

const text = (model) => {
	if (!model || !model.hasEvidence) return [];
	const shared = model.rows.filter((r) => r.shared).map((r) => r.name);
	const head = `${pct(model.score)}  ${shared.length} shared a11y token(s)  (${model.leftCount}↔${model.rightCount})`;
	const lines = [head];
	if (shared.length > 0) lines.push(`shared  ${shared.join(", ")}`);
	const onlyA = model.rows.filter((r) => r.left && !r.right).map((r) => r.name);
	const onlyB = model.rows.filter((r) => r.right && !r.left).map((r) => r.name);
	if (onlyA.length > 0) lines.push(`only local  ${onlyA.join(", ")}`);
	if (onlyB.length > 0) lines.push(`only canonical  ${onlyB.join(", ")}`);

	return lines;
};

export {  text  };
