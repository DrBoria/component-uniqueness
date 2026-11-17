"use strict";

// The STRUCTURE model: the DOM-chain comparison the engine already scored.
//
// The component engine's structure matcher reports a best-matching chain of DOM
// nodes (tag + CSS + text) between the two trees. The model surfaces that chain's
// facts as rows the board can draw: the root tags on each side, and the chain
// quality / size. It does NOT recompute the chain — the engine's evidence is the
// source of truth; this only arranges it for the report.

const rootTagOf = (candidate) => {
	const tree = candidate?.dom?.tree ?? candidate?.tree;
	if (!tree) return null;
	const firstReal = (n) => {
		if (!n) return null;
		if (n.tag === "fragment" || n.tag === "children" || n.tag === "text") {
			for (const child of n.children || []) {
				const found = firstReal(child);
				if (found) return found;
			}
			return null;
		}
		return n;
	};
	const root = firstReal(tree);
	return root ? root.tag : null;
};

// `signal` is the engine's structure signal {score, applicable, evidence}.
const build = (left, right, signal) => {
	if (!left || !right || !signal) return null;
	const ev = signal.evidence ?? {};
	const leftTag = rootTagOf(left);
	const rightTag = rootTagOf(right);
	const rows = [];
	if (leftTag || rightTag) {
		rows.push({
			name: "root",
			left: leftTag ? { name: leftTag } : null,
			right: rightTag ? { name: rightTag } : null,
			shared: !!leftTag && !!rightTag,
			same: !!leftTag && leftTag === rightTag,
		});
	}

	return {
		rows,
		sharedCount: rows.filter((r) => r.shared).length,
		leftCount: leftTag ? 1 : 0,
		rightCount: rightTag ? 1 : 0,
		score: signal.score ?? 0,
		hasEvidence: signal.applicable !== false && (ev.chainSize > 0 || ev.rootSim > 0 || rows.length > 0),
		evidence: ev,
	};
};

export {  build  };