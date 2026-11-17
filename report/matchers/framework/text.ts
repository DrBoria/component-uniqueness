"use strict";

// The FRAMEWORK CLI text: the score, then the shared component usages and the
// props passed to them. Usage against usage — never accepted parameter props.

const pct = (n) => `${Math.round((n ?? 0) * 100)}%`;

const text = (model) => {
	if (!model || !model.hasEvidence) return [];
	const shared = model.rows.filter((r) => r.shared).map((r) => r.name);
	const head = `${pct(model.score)}  ${shared.length} shared component usage(s)  (${model.leftCount}↔${model.rightCount})`;
	const lines = [head];
	if (shared.length > 0) lines.push(`shared  ${shared.join(", ")}`);
	const withProps = model.rows.filter((r) => r.shared && (r.sharedProps ?? []).length > 0);
	if (withProps.length > 0) lines.push(`passed props  ${withProps.map((r) => `${r.name}: ${r.sharedProps.join(", ")}`).join("  ·  ")}`);
	const onlyA = model.rows.filter((r) => r.left && !r.right).map((r) => r.name);
	const onlyB = model.rows.filter((r) => r.right && !r.left).map((r) => r.name);
	if (onlyA.length > 0) lines.push(`only local  ${onlyA.join(", ")}`);
	if (onlyB.length > 0) lines.push(`only canonical  ${onlyB.join(", ")}`);

	return lines;
};

export { text };
