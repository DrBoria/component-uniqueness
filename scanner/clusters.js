"use strict";

const { computeGenericTokens, distinctiveTokens } = require("./matching");
const { resolveThresholds } = require("../thresholds");

const JACCARD_MIN = 0.3;
const FAMILY_MATCH_MIN = resolveThresholds({}).familyMatchMin;
const MIN_FAMILY_TOKENS = 3;

const componentTokenSet = (c, generic) => {
	const s = new Set();
	for (const e of c.elementProps || []) for (const t of e.tokens || []) s.add(t);
	return distinctiveTokens([...s], generic);
};

const jaccard = (a, b) => {
	if (a.size === 0 || b.size === 0) return 0;
	let inter = 0;
	for (const t of a) if (b.has(t)) inter += 1;
	const union = a.size + b.size - inter;
	return union === 0 ? 0 : inter / union;
};

const clusterComponents = (canonComponents) => {
	const generic = computeGenericTokens(canonComponents);
	const sets = canonComponents.map((c) => componentTokenSet(c, generic));
	const clusters = [];
	for (let i = 0; i < canonComponents.length; i += 1) {
		const s = sets[i];
		if (s.size < MIN_FAMILY_TOKENS) continue;
		let best = null;
		for (const cl of clusters) {
			const j = jaccard(s, cl.tokenSet);
			if (j >= JACCARD_MIN && (!best || j > best.j)) best = { cl, j };
		}
		if (best) best.cl.members.push(i);
		else clusters.push({ members: [i], tokenSet: new Set(s) });
	}
	const families = [];
	for (const cl of clusters) {
		if (cl.members.length < 2) continue;
		const count = new Map();
		for (const i of cl.members) for (const t of sets[i]) count.set(t, (count.get(t) || 0) + 1);
		const half = cl.members.length / 2;
		const tokenSet = new Set();
		for (const [t, n] of count) if (n >= half) tokenSet.add(t);
		if (tokenSet.size < MIN_FAMILY_TOKENS) continue;
		families.push({ members: cl.members, tokenSet, sets });
	}
	return { families, sets, generic };
}

const nearestMember = (family, appTokens) => {
	let best = null;
	for (const i of family.members) {
		const j = jaccard(appTokens, family.sets[i]);
		if (!best || j > best.j) best = { idx: i, j };
	}
	return best;
}

const matchFamilies = (appComponents, canonComponents, cluster, opts) => {
	const { families, sets, generic } = cluster;
	const th = resolveThresholds(opts);
	const matches = [];
	const seen = new Set();
	for (const app of appComponents) {
		const appTokens = componentTokenSet(app, generic);
		if (appTokens.size < MIN_FAMILY_TOKENS) continue;
		let best = null;
		for (const family of families) {
			const j = jaccard(appTokens, family.tokenSet);
			if (j < th.familyMatchMin) continue;
			const near = nearestMember(family, appTokens);
			if (!near || near.j < th.familyMatchMin) continue;
			const member = canonComponents[near.idx];
			if ((app.usesCanonical || []).includes(member.name)) continue;
			if ((app.elementProps || []).length > 3 * (member.elementProps || []).length) continue;
			if (!best || near.j > best.j) best = { canon: member, j: near.j, familyJ: j };
		}
		if (best) {
			const key = `${app.path}:${app.line}->${best.canon.path}:${best.canon.name}`;
			if (seen.has(key)) continue;
			seen.add(key);
			matches.push({
				app,
				canon: best.canon,
				tier: "family",
				reason: `token profile matches the ${best.canon.name} family (${(best.j * 100).toFixed(0)}% overlap)`,
			});
		}
	}
	return matches;
}

module.exports = { clusterComponents, matchFamilies, componentTokenSet, jaccard, JACCARD_MIN, FAMILY_MATCH_MIN, MIN_FAMILY_TOKENS };
