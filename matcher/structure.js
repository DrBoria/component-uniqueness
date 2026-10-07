"use strict";

const { NON_SEMANTIC_TAGS, isPascalCase } = require("../normalize/dom.js");

const CONFLICT_PENALTY = 0.6;
const CONFLICTED_RICH_CEILING = 0.8;
const RICH_DISTINCT_MIN = 3;
const CEILING_LADDER = [0.3, 0.5, 0.7, 0.9, 1.0];
const MISSING_CHILD_PENALTY = 0.15;
const NEAR_IDENTICAL_CEILING = 0.98;

const isTextNode = (node) => node.tag === "children" || node.tag === "text";
const isIconNode = (node) => isPascalCase(node.tag);

const pairsOf = (css) => new Set(Object.entries(css || {}).map(([prop, value]) => `${prop}:${value}`));

const overlap = (a, b) => [...a].filter((pair) => b.has(pair)).length;

const jaccard = (a, b) => {
	const union = a.size + b.size - overlap(a, b);

	return union === 0 ? 0 : overlap(a, b) / union;
};

const coverage = (a, b) => (a.size === 0 ? 0 : overlap(a, b) / a.size);

const textSim = (a, b) => {
	const ta = String(a.text || "").toLowerCase().trim();
	const tb = String(b.text || "").toLowerCase().trim();
	if (!ta && !tb) return 1;
	if (!ta || !tb) return 0;

	return ta === tb ? 1 : 0;
};

const tagMatch = (a, b) => {
	if (a.tag === b.tag) return 1;
	if (a.interactive && b.interactive) return 1;

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

const forestOf = (node) => (node.tag === "fragment" ? (node.children || []).flatMap(forestOf) : [node]);

const align = (xs, ys) => {
	const cells = xs.map((x) => ys.map((y) => compare(x, y)));
	const table = Array.from({ length: xs.length + 1 }, () => new Array(ys.length + 1).fill(0));
	for (let i = 1; i <= xs.length; i += 1) {
		for (let j = 1; j <= ys.length; j += 1) {
			table[i][j] = Math.max(table[i - 1][j], table[i][j - 1], table[i - 1][j - 1] + cells[i - 1][j - 1].score);
		}
	}
	const pairs = [];
	let i = xs.length;
	let j = ys.length;
	while (i > 0 && j > 0) {
		if (table[i][j] === table[i - 1][j]) i -= 1;
		else if (table[i][j] === table[i][j - 1]) j -= 1;
		else {
			pairs.push(...cells[i - 1][j - 1].pairs);
			i -= 1;
			j -= 1;
		}
	}

	return { total: table[xs.length][ys.length], pairs };
};

const compare = (a, b) => {
	const kidsA = (a.children || []).flatMap(forestOf);
	const kidsB = (b.children || []).flatMap(forestOf);
	const { total, pairs } = align(kidsA, kidsB);

	return { score: (nodeSimilarity(a, b) + total) / (1 + Math.max(kidsA.length, kidsB.length)), pairs: [[a, b], ...pairs] };
};

const compareForests = (a, b) => {
	const xs = forestOf(a);
	const ys = forestOf(b);
	const longest = Math.max(xs.length, ys.length);
	const { total, pairs } = align(xs, ys);

	return { score: longest === 0 ? 0 : total / longest, pairs };
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

const rootNodeScore = (cand, target) => {
	const parts = [];
	if (!NON_SEMANTIC_TAGS.has(cand.tag)) parts.push({ w: 0.6, v: tagMatch(cand, target) });
	const candPairs = pairsOf(cand.css);
	if (candPairs.size > 0) parts.push({ w: 0.4, v: coverage(candPairs, pairsOf(target.css)) });
	const totalW = parts.reduce((sum, part) => sum + part.w, 0);

	return totalW === 0 ? 0 : parts.reduce((sum, part) => sum + part.w * part.v, 0) / totalW;
};

const isInformative = (node) => !!node && (node.tag !== "fragment" || (node.children || []).some(isInformative));

const shapeOf = (node) => {
	const tags = new Set();
	let nodes = 0;
	const visit = (n) => {
		if (n.tag !== "fragment") {
			tags.add(n.tag);
			nodes += 1;
		}
		for (const child of n.children || []) visit(child);
	};
	visit(node);

	return { tags, nodes };
};

const componentNamesOf = (tree, out = new Set()) => {
	if (!tree) return out;
	for (const name of tree.via || []) out.add(name);
	for (const child of tree.children || []) componentNamesOf(child, out);

	return out;
};

const sizeOf = (candidate) => {
	const { tags, nodes } = shapeOf(candidate.dom.tree);
	const distinct = new Set([...tags, ...componentNamesOf(candidate.tree)]).size;

	return { nodes, distinct };
};

const ceilingOf = (nodes, distinct, stats) => {
	const base = CEILING_LADDER[Math.min(nodes - 1, CEILING_LADDER.length - 1)];
	if (distinct >= RICH_DISTINCT_MIN && stats.conflicts > 0) return Math.min(base, CONFLICTED_RICH_CEILING);

	return base;
};

const classTokensDiffer = (a, b) => {
	const A = new Set(a || []);
	const B = new Set(b || []);
	if (A.size === 0 && B.size === 0) return false;
	for (const token of A) if (!B.has(token)) return true;
	for (const token of B) if (!A.has(token)) return true;

	return false;
};

const matchStructure = (candidate, canon) => {
	const cand = candidate.dom && candidate.dom.tree;
	const target = canon.dom && canon.dom.tree;
	const mode = candidate.partial ? "root-node" : "tree";
	const applicable = isInformative(cand) || isInformative(target);
	let score = 0;
	let detail = null;
	if (applicable && cand && target) {
		if (candidate.partial) {
			const classesDiffer = classTokensDiffer(candidate.rawClasses, canon.rawClasses);
			const base = rootNodeScore(cand, target);
			score = Math.min(base, classesDiffer ? NEAR_IDENTICAL_CEILING : 1);
			detail = { similarity: base, ceiling: classesDiffer ? NEAR_IDENTICAL_CEILING : 1, classesDiffer };
		} else {
			const result = compareForests(cand, target);
			const stats = cssStats(result.pairs);
			const a = sizeOf(candidate);
			const b = sizeOf(canon);
			const classesDiffer = classTokensDiffer(candidate.rawClasses, canon.rawClasses);
			const ceiling = Math.min(ceilingOf(Math.min(a.nodes, b.nodes), Math.min(a.distinct, b.distinct), stats), classesDiffer ? NEAR_IDENTICAL_CEILING : 1);
			const missingRatio = Math.max(0, Math.max(a.nodes, b.nodes) - Math.min(a.nodes, b.nodes)) / Math.max(1, Math.max(a.nodes, b.nodes));
			score = Math.max(0, Math.min(result.score, ceiling) - CONFLICT_PENALTY * stats.ratio - MISSING_CHILD_PENALTY * missingRatio);
			detail = { similarity: result.score, ceiling, classesDiffer, conflicts: stats.conflicts, conflictRatio: stats.ratio, agreement: stats.agreement, missingRatio: Math.round(missingRatio * 100) / 100, nodes: Math.min(a.nodes, b.nodes), distinct: Math.min(a.distinct, b.distinct) };
		}
	}

	return { score, applicable, evidence: { mode, ...(detail || {}) } };
};

module.exports = { matchStructure };
