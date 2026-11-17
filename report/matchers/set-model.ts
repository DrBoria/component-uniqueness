"use strict";

// A set-comparison model: the two sides carry lists of tokens (events, ARIA
// attributes, props, child-component names). A token present on both sides is a
// shared row; a token on one side only is a surplus row. This is the comparison
// material the board draws for the behavior / a11y / framework signals.
//
// The engine already scored the pair; `signal` carries {score, evidence}. This
// only arranges the token lists into rows — it never re-decides.

const rowsOf = (leftTokens, rightTokens) => {
	const A = new Set(leftTokens ?? []);
	const B = new Set(rightTokens ?? []);
	const names = [...new Set([...A, ...B])];

	return names.map((name) => {
		const shared = A.has(name) && B.has(name);
		return {
			name,
			left: A.has(name) ? { name } : null,
			right: B.has(name) ? { name } : null,
			shared,
			same: shared,
		};
	});
};

const buildSet = (signal, leftTokens, rightTokens) => {
	if (!signal) return null;
	const rows = rowsOf(leftTokens, rightTokens);
	const shared = rows.filter((r) => r.shared);

	return {
		rows,
		sharedCount: shared.length,
		leftCount: new Set(leftTokens ?? []).size,
		rightCount: new Set(rightTokens ?? []).size,
		score: signal.score ?? 0,
		hasEvidence: (signal.score ?? 0) > 0 || shared.length > 0 || rows.length > 0,
		evidence: signal.evidence ?? {},
	};
};

export {  rowsOf, buildSet  };