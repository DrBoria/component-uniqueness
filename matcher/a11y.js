"use strict";


const TEST_ID_WEIGHT = 0.5;

const parseToken = (token) => {
	const t = String(token || "").toLowerCase();
	const m = t.match(/^(role|aria-[\w-]+)(?::(.*))?$/);
	if (m) return { name: m[1], value: m[2] || "" };
	return null;
};

const classify = (token) => {
	const t = String(token || "").toLowerCase();
	if (t.startsWith("data-test") || t.startsWith("data-testid") || t.startsWith("data-test-id")) return "testid";
	const p = parseToken(t);
	if (p) return "a11y";
	return null;
};

const tokensOf = (c, kind) => {
	const s = new Set();
	for (const t of c.a11y || []) {
		if (classify(t) === kind) s.add(String(t).toLowerCase());
	}
	return s;
};

const jaccard = (a, b) => {
	if (a.size === 0 || b.size === 0) return 0;
	let inter = 0;
	for (const t of a) if (b.has(t)) inter += 1;
	const union = a.size + b.size - inter;
	return union === 0 ? 0 : inter / union;
};

const matchA11y = (candidate, canon) => {
	const candA = tokensOf(candidate, "a11y");
	const canonA = tokensOf(canon, "a11y");
	const candT = tokensOf(candidate, "testid");
	const canonT = tokensOf(canon, "testid");

	const a11ySim = jaccard(candA, canonA);
	const testSim = jaccard(candT, canonT);

	const parts = [];
	if (candA.size > 0 || canonA.size > 0) parts.push({ w: 1 - TEST_ID_WEIGHT, v: a11ySim });
	if (candT.size > 0 || canonT.size > 0) parts.push({ w: TEST_ID_WEIGHT, v: testSim });

	const totalW = parts.reduce((s, p) => s + p.w, 0);
	const score = totalW === 0 ? 0 : parts.reduce((s, p) => s + p.w * p.v, 0) / totalW;

	const evidence = {
		candidateA11y: [...candA].sort(),
		canonicalA11y: [...canonA].sort(),
		candidateTestId: [...candT].sort(),
		canonicalTestId: [...canonT].sort(),
		a11ySimilarity: a11ySim,
		testIdSimilarity: testSim,
	};

	return { score, evidence };
};

module.exports = { matchA11y, tokensOf, classify, TEST_ID_WEIGHT };
