"use strict";

// The FRAMEWORK model: the components each side USES and the props it PASSES,
// side by side. One row per matched component usage; the shared passed props are
// the correspondence. Accepted parameter props are never compared here.

const build = (left, right, signal) => {
	if (!left || !right) return null;
	const ev = signal?.evidence ?? {};
	const pairs = ev.pairs ?? [];
	const rows = pairs.map((pair) => ({
		name: pair.name,
		left: { name: pair.name, line: pair.leftLine },
		right: { name: pair.name, line: pair.rightLine },
		shared: true,
		same: (pair.sharedProps ?? []).length > 0 || (pair.leftProps ?? []).length === 0,
		sharedProps: pair.sharedProps ?? [],
		leftProps: pair.leftProps ?? [],
		rightProps: pair.rightProps ?? [],
	}));

	// Usages present on one side only: surplus rows, not correspondences.
	const leftOnly = (ev.candidateUsages ?? []).filter((n) => !(ev.sharedComponents ?? []).includes(n));
	const rightOnly = (ev.canonicalUsages ?? []).filter((n) => !(ev.sharedComponents ?? []).includes(n));
	for (const name of leftOnly) rows.push({ name, left: { name }, right: null, shared: false, same: false });
	for (const name of rightOnly) rows.push({ name, left: null, right: { name }, shared: false, same: false });

	return {
		rows,
		sharedCount: rows.filter((r) => r.shared).length,
		leftCount: (ev.candidateUsages ?? []).length,
		rightCount: (ev.canonicalUsages ?? []).length,
		score: signal?.score ?? 0,
		hasEvidence: rows.length > 0,
		evidence: ev,
	};
};

export { build };