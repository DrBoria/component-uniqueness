"use strict";

// The STYLES CLI text: the score, then WHICH styles are duplicated — per node
// tag, the agreeing properties with their values, comma-separated (the same
// rows the Styles tab paints), then the properties that differ.

const pct = (n) => `${Math.round((n ?? 0) * 100)}%`;

const valueOf = (side) => (side ? side.name.split(": ").slice(1).join(": ") : "—");

const text = (model) => {
	if (!model || !model.hasEvidence) return [];
	const ev = model.evidence ?? {};
	const head = `${pct(model.score)}  styles (${ev.agreeing ?? 0}/${ev.properties ?? 0} properties agree across ${ev.pairs ?? 0} node pair(s))`;
	const lines = [head];
	// Per node tag: what exactly agrees. `div  display: flex, gap: 24px` reads as
	// the Styles board's div block, in one line. Repeated tags (two divs matched)
	// keep their declarations distinct; identical declarations dedupe.
	const byTag = new Map();
	for (const row of model.rows) {
		if (!row.shared || !row.same) continue;
		const list = byTag.get(row.tag) ?? new Set();
		list.add(`${row.name}: ${valueOf(row.left)}`);
		byTag.set(row.tag, list);
	}
	for (const [tag, props] of byTag) lines.push(`${tag}  ${[...props].join(", ")}`);
	const differing = model.rows.filter((r) => !r.same && r.left && r.right);
	if (differing.length > 0) {
		lines.push(`differ  ${differing.map((r) => `${r.tag} ${r.name}: ${valueOf(r.left)} ≠ ${valueOf(r.right)}`).join(", ")}`);
	}
	const onlyA = model.rows.filter((r) => r.left && !r.right);
	const onlyB = model.rows.filter((r) => r.right && !r.left);
	if (onlyA.length > 0) lines.push(`only local  ${onlyA.map((r) => `${r.tag} ${r.name}: ${valueOf(r.left)}`).join(", ")}`);
	if (onlyB.length > 0) lines.push(`only canonical  ${onlyB.map((r) => `${r.tag} ${r.name}: ${valueOf(r.right)}`).join(", ")}`);

	return lines;
};

export { text };
