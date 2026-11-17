"use strict";

// The STRUCTURE CLI text: the score, the chain facts, then WHICH nodes
// correspond — the aligned tag pairs (`div↔div:32`, `header↔header:33`), the
// same correspondence the Structure tab draws.

const pct = (n) => `${Math.round((n ?? 0) * 100)}%`;

const text = (model) => {
	if (!model || !model.hasEvidence) return [];
	const ev = model.evidence ?? {};
	const head = `${pct(model.score)}  structure (${ev.mode ?? "tree"})`;
	const lines = [head];
	const facts = [];
	if (ev.chainSize != null) facts.push(`chain ${ev.chainSize}/${ev.refSize ?? "?"}`);
	if (ev.quality != null) facts.push(`quality ${pct(ev.quality)}`);
	if (ev.agreement != null) facts.push(`CSS agreement ${pct(ev.agreement)}`);
	if (ev.conflicts) facts.push(`${ev.conflicts} CSS conflict(s)`);
	if (ev.classesDiffer) facts.push("class names differ");
	if (facts.length > 0) lines.push(facts.join("  ·  "));
	const nodes = ev.nodes ?? [];
	if (nodes.length > 0) {
		const shown = nodes.slice(0, 20).map((p) => {
			const pair = p.left === p.right ? p.left : `${p.left}↔${p.right}`;
			const at = p.leftLine != null ? `:${p.leftLine}` : "";
			return `${pair}${at}`;
		});
		if (nodes.length > 20) shown.push(`…+${nodes.length - 20} more`);
		lines.push(`matched nodes  ${shown.join(", ")}`);
	}

	return lines;
};

export {  text  };
