"use strict";

const { isPascalCase, tagAffinity, GENERIC_CONTAINER_TAGS } = require("../normalize/dom.js");

const CONFLICT_PENALTY = 0.6;
const NEAR_IDENTICAL_CEILING = 0.98;

const isTextNode = (node) => node.tag === "children" || node.tag === "text";
const isIconNode = (node) => isPascalCase(node.tag);

const nodeCount = (tree) => {
	if (!tree) return 0;
	const own = tree.tag === "fragment" || tree.tag === "children" ? 0 : 1;

	return own + (tree.children || []).reduce((sum, child) => sum + nodeCount(child), 0);
};

const pairsOf = (css) => new Set(Object.entries(css || {}).map(([prop, value]) => `${prop}:${value}`));

const overlap = (a, b) => [...a].filter((pair) => b.has(pair)).length;

const jaccard = (a, b) => {
	const union = a.size + b.size - overlap(a, b);

	return union === 0 ? 0 : overlap(a, b) / union;
};

const textSim = (a, b) => {
	const ta = String(a.text || "").toLowerCase().trim();
	const tb = String(b.text || "").toLowerCase().trim();
	if (!ta && !tb) return 1;
	if (!ta || !tb) return 0;

	return ta === tb ? 1 : 0;
};

const tagMatch = (a, b) => {
	if (a.interactive && b.interactive) return 1;
	const affinity = tagAffinity(a.tag, b.tag);
	if (affinity > 0) return affinity;

	return 0;
};

const nodeSimilarity = (a, b) => {
	if (isTextNode(a) && isTextNode(b)) return textSim(a, b);
	if (isIconNode(a) && isIconNode(b)) return a.tag === b.tag ? 1 : 0.1;
	const tag = tagMatch(a, b);
	const pa = pairsOf(a.css);
	const pb = pairsOf(b.css);
	let score = pa.size === 0 && pb.size === 0 ? tag : 0.6 * tag + 0.4 * jaccard(pa, pb);
	const ta = String(a.text || "").trim();
	const tb = String(b.text || "").trim();
	if (ta || tb) score = 0.7 * score + 0.3 * textSim(a, b);

	return score;
};

const chainList = (node) => {
	const list = [];
	const walk = (n, parentIdx) => {
		if (!n) return;
		if (n.tag === "fragment" || n.tag === "children") {
			for (const child of n.children || []) walk(child, parentIdx);
			return;
		}
		if (n.tag === "text") return;
		const idx = list.length;
		list.push({ node: n, parent: parentIdx });
		for (const child of n.children || []) walk(child, idx);
	};
	walk(node, -1);

	return list;
};

const bestChain = (a, b) => {
	const xs = chainList(a);
	const ys = chainList(b);
	const refSize = Math.max(xs.length, ys.length);
	if (xs.length === 0 || ys.length === 0) return { score: 0, quality: 0, chainSize: 0, refSize, pairs: [] };
	const dp = xs.map(() => new Array(ys.length).fill(0));
	const len = xs.map(() => new Array(ys.length).fill(0));
	let best = { score: 0, quality: 0, chainSize: 0, i: -1, j: -1 };
	for (let i = 0; i < xs.length; i += 1) {
		for (let j = 0; j < ys.length; j += 1) {
			const sim = nodeSimilarity(xs[i].node, ys[j].node);
			let value = sim;
			let length = 1;
			const pi = xs[i].parent;
			const pj = ys[j].parent;
			if (pi >= 0 && pj >= 0 && dp[pi][pj] > 0) {
				value += dp[pi][pj];
				length += len[pi][pj];
			}
			dp[i][j] = value;
			len[i][j] = length;
			const quality = value / length;
			const score = quality * (length / refSize);
			if (score > best.score) best = { score, quality, chainSize: length, i, j };
		}
	}
	const pairs = [];
	if (best.i >= 0) {
		let i = best.i;
		let j = best.j;
		while (i >= 0 && j >= 0) {
			pairs.unshift([xs[i].node, ys[j].node]);
			i = xs[i].parent;
			j = ys[j].parent;
		}
	}

	return { score: best.score, quality: best.quality, chainSize: best.chainSize, refSize, pairs };
};

const cssStats = (pairs) => {
	let comparable = 0;
	let conflicts = 0;
	let shared = 0;
	let union = 0;
	for (const [a, b] of pairs) {
		for (const [prop, value] of Object.entries(a.css || {})) {
			if (!Object.prototype.hasOwnProperty.call(b.css || {}, prop)) continue;
			comparable += 1;
			if (b.css[prop] !== value) conflicts += 1;
		}
		const pa = pairsOf(a.css);
		const pb = pairsOf(b.css);
		shared += overlap(pa, pb);
		union += pa.size + pb.size - overlap(pa, pb);
	}

	return { conflicts, ratio: comparable === 0 ? 0 : conflicts / comparable, agreement: union === 0 ? 0 : shared / union };
};

const isInformative = (node) => !!node && (node.tag !== "fragment" || (node.children || []).some(isInformative));

const classTokensDiffer = (a, b) => {
	const A = new Set(a || []);
	const B = new Set(b || []);
	if (A.size === 0 && B.size === 0) return false;
	for (const token of A) if (!B.has(token)) return true;
	for (const token of B) if (!A.has(token)) return true;

	return false;
};

const treeSimilarity = (a, b) => {
	const result = bestChain(a, b);
	return { score: result.score, quality: result.quality, detail: { similarity: result.score, quality: result.quality, chainSize: result.chainSize, refSize: result.refSize, pairs: result.pairs.length } };
};

const firstReal = (node) => {
	if (!node) return null;
	if (node.tag === "fragment" || node.tag === "children" || node.tag === "text") {
		for (const child of node.children || []) {
			const found = firstReal(child);
			if (found) return found;
		}
		return null;
	}
	return node;
};

const rootSimilarity = (a, b) => {
	const ra = firstReal(a);
	const rb = firstReal(b);
	if (!ra || !rb) return { score: 0, detail: { rootSim: 0 } };

	return { score: nodeSimilarity(ra, rb), detail: { rootSim: nodeSimilarity(ra, rb) } };
};

const MIN_CROSS_TAG_CLASS_OVERLAP = 3;

const rootClassOverlap = (candidate, canon) => {
	const rt = firstReal(candidate.tree);
	if (!rt) return 0;
	const partToks = new Set(String(rt.className || "").split(/\s+/).filter(Boolean));
	const canonToks = new Set(canon.rawClasses || []);
	let n = 0;
	for (const t of partToks) if (canonToks.has(t)) n += 1;

	return n;
};

const matchStructure = (candidate, canon) => {
	const cand = candidate.dom && candidate.dom.tree;
	const target = canon.dom && canon.dom.tree;
	const mode = candidate.partial ? "partial" : "tree";
	const applicable = isInformative(cand) || isInformative(target);
	let score = 0;
	let detail = null;
	if (applicable && cand && target) {
		if (candidate.partial) {
			const singleton = nodeCount(target) === 1;
			const partNodes = nodeCount(cand);
			const classesDiffer = classTokensDiffer(candidate.rawClasses, canon.rawClasses);
			if (singleton) {
				const ra = firstReal(cand);
				const rb = firstReal(target);
				const partTag = ra ? ra.tag : "";
				const canonTag = rb ? rb.tag : "";
				const crossTag = GENERIC_CONTAINER_TAGS.has(partTag) && GENERIC_CONTAINER_TAGS.has(canonTag) && partTag !== canonTag;
				if (crossTag) {
					const overlap = rootClassOverlap(candidate, canon);
					if (overlap < MIN_CROSS_TAG_CLASS_OVERLAP) {
						score = 0;
						detail = { singleton, crossTag, overlap, rejected: true };
					} else {
						score = Math.min(0.9, 0.5 + 0.05 * overlap);
						detail = { singleton, crossTag, overlap };
					}
				} else if (partNodes > 4) {
					score = 0;
					detail = { singleton, partNodes, leafVsWrapper: true };
				} else {
					const { score: q, detail: d } = rootSimilarity(cand, target);
					score = Math.min(q, classesDiffer ? NEAR_IDENTICAL_CEILING : 1);
					detail = { ...d, singleton, classesDiffer };
				}
			} else {
				const { quality, detail: d } = treeSimilarity(cand, target);
				const sizeFactor = Math.min(1, nodeCount(target) / nodeCount(cand));
				const base = quality * sizeFactor;
				score = Math.min(base, classesDiffer ? NEAR_IDENTICAL_CEILING : 1);
				detail = { ...d, singleton, sizeFactor, classesDiffer };
			}
		} else {
			const result = bestChain(cand, target);
			const stats = cssStats(result.pairs);
			const classesDiffer = classTokensDiffer(candidate.rawClasses, canon.rawClasses);
			const ceiling = classesDiffer ? NEAR_IDENTICAL_CEILING : 1;
			score = Math.max(0, Math.min(result.score, ceiling) - CONFLICT_PENALTY * stats.ratio);
			detail = { similarity: result.score, quality: result.quality, chainSize: result.chainSize, refSize: result.refSize, ceiling, classesDiffer, conflicts: stats.conflicts, conflictRatio: stats.ratio, agreement: stats.agreement };
		}
	}

	return { score, applicable, evidence: { mode, ...(detail || {}) } };
};

module.exports = { matchStructure };
