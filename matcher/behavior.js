"use strict";


const jaccard = (a, b) => {
	if (a.size === 0 || b.size === 0) return 0;
	let inter = 0;
	for (const t of a) if (b.has(t)) inter += 1;
	const union = a.size + b.size - inter;
	return union === 0 ? 0 : inter / union;
};

const matchBehavior = (candidate, canon) => {
	const candA = new Set((candidate.framework && candidate.framework.events) || []);
	const canonA = new Set((canon.framework && canon.framework.events) || []);
	const shared = new Set([...candA].filter((event) => canonA.has(event)));
	const score = jaccard(candA, canonA);
	return {
		score,
		evidence: {
			candidateEvents: [...candA].sort(),
			canonicalEvents: [...canonA].sort(),
			sharedEvents: [...shared].sort(),
		},
	};
};;

module.exports = { matchBehavior };
