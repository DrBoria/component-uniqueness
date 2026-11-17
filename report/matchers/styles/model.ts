"use strict";

// The STYLES model: per matched node pair, the CSS properties that matter for
// its element role and whether they agree. The engine already scored the pair;
// this arranges the evidence into rows the board draws.

const build = (left, right, signal) => {
	if (!left || !right || !signal) return null;
	const ev = signal.evidence ?? {};
	const details = ev.details ?? [];
	const rows = [];
	for (const detail of details) {
		for (const row of detail.rows ?? []) {
			rows.push({
				tag: detail.tag,
				name: row.prop,
				left: row.left === null ? null : { name: `${row.prop}: ${row.left}` },
				right: row.right === null ? null : { name: `${row.prop}: ${row.right}` },
				shared: row.left !== null && row.right !== null,
				same: row.same,
			});
		}
	}

	return {
		rows,
		details,
		sharedCount: rows.filter((r) => r.same).length,
		leftCount: rows.filter((r) => r.left).length,
		rightCount: rows.filter((r) => r.right).length,
		score: signal.score ?? 0,
		hasEvidence: signal.applicable !== false && rows.length > 0,
		evidence: ev,
	};
};

export { build };