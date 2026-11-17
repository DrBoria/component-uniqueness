"use strict";

// The NAME model: the two component names side by side. A name is one row; the
// engine's name signal already decided exact / basename / fuzzy / word-overlap.

const build = (left, right, signal) => {
	if (!left || !right || !signal) return null;
	const ev = signal.evidence ?? {};
	const same = !!ev.exactName || (signal.score ?? 0) >= 1;
	const rows = [
		{
			name: "name",
			left: { name: left.name },
			right: { name: right.name },
			shared: true,
			same,
		},
	];

	return {
		rows,
		sharedCount: 1,
		leftCount: 1,
		rightCount: 1,
		score: signal.score ?? 0,
		hasEvidence: (signal.score ?? 0) > 0,
		evidence: ev,
	};
};

export {  build  };