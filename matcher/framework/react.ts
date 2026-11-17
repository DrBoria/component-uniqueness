"use strict";

// The FRAMEWORK signal: which components each side USES, and what props it
// PASSES to them. Usage against usage — a `Button` used with `onClick` on both
// sides is the same framework fact. The props a component ACCEPTS in its
// parameter list are NOT compared here (that is a different question).

const matchFramework = (candidate, canon) => {
	const candUsages = (candidate.framework && candidate.framework.usages) || [];
	const canonUsages = (canon.framework && canon.framework.usages) || [];

	// Match usages by component name, in order (a name used twice pairs by occurrence).
	const pairs = [];
	const used = new Set();
	let cursor = 0;
	for (const a of candUsages) {
		let found = -1;
		for (let j = cursor; j < canonUsages.length; j += 1) {
			if (!used.has(j) && canonUsages[j].name === a.name) { found = j; break; }
		}
		if (found === -1) {
			for (let j = 0; j < cursor; j += 1) {
				if (!used.has(j) && canonUsages[j].name === a.name) { found = j; break; }
			}
		}
		if (found >= 0) {
			used.add(found);
			cursor = found + 1;
			pairs.push({ left: a, right: canonUsages[found] });
		}
	}

	const candNames = new Set(candUsages.map((u) => u.name));
	const canonNames = new Set(canonUsages.map((u) => u.name));
	const sharedNames = [...candNames].filter((n) => canonNames.has(n));
	const unionNames = new Set([...candNames, ...canonNames]);
	const nameSim = unionNames.size === 0 ? 0 : sharedNames.length / unionNames.size;

	let propSame = 0;
	let propTotal = 0;
	const details = [];
	for (const pair of pairs) {
		const a = new Set(pair.left.props || []);
		const b = new Set(pair.right.props || []);
		const inter = [...a].filter((p) => b.has(p)).length;
		const uni = new Set([...a, ...b]).size;
		propSame += inter;
		propTotal += uni;
		details.push({ name: pair.left.name, leftLine: pair.left.line, rightLine: pair.right.line, sharedProps: [...a].filter((p) => b.has(p)).sort(), leftProps: [...a].sort(), rightProps: [...b].sort() });
	}
	const propSim = propTotal === 0 ? 0 : propSame / propTotal;

	// Names dominate (using the same component is the fact); passed props refine it.
	// No shared usage at all → no framework evidence, score 0 (never a free 0.3).
	const score = pairs.length === 0 ? 0 : 0.7 * nameSim + 0.3 * propSim;

	return {
		score,
		evidence: {
			candidateUsages: candUsages.map((u) => u.name),
			canonicalUsages: canonUsages.map((u) => u.name),
			sharedComponents: sharedNames.sort(),
			pairs: details,
			nameSimilarity: nameSim,
			passedPropSimilarity: propSim,
		},
	};
};

export { matchFramework };
