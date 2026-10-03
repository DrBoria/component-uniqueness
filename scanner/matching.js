"use strict";

const path = require("node:path");
const { resolveThresholds, DEFAULT_THRESHOLDS } = require("../thresholds");

const GENERIC_FREQ = 0.25;
const MIN_SHARED = DEFAULT_THRESHOLDS.minShared;
const MIN_RATIO_SAME_TAG = DEFAULT_THRESHOLDS.minRatioSameTag;
const MIN_RATIO_ANY_TAG = DEFAULT_THRESHOLDS.minRatioAnyTag;
const EXACT_RATIO = DEFAULT_THRESHOLDS.exactRatio;
const FUZZY_NAME_MIN_LEN = 5;
const FUZZY_BASENAME_MIN_LEN = 4;
const JSX_BLOCK_MIN_SEQ = 3;
const JSX_BLOCK_MIN_RATIO = 0.5;
const JSX_BLOCK_MAX_SUBTREES = 25;

const kebabToPascal = (s) =>
	s
		.split(/[-_ ]+/)
		.filter(Boolean)
		.map((w) => w[0].toUpperCase() + w.slice(1))
		.join("");

const basenameToPascal = (file) => kebabToPascal(path.basename(file, path.extname(file)));

const pascalWords = (s) => String(s || "").replace(/([a-z0-9])([A-Z])/g, "$1 $2").split(/[^A-Za-z0-9]+/).filter(Boolean);
const kebabWords = (s) => String(s || "").split(/[^A-Za-z0-9]+/).filter(Boolean);
const singular = (w) => (w.length > 3 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w);

const fuzzyNameHit = (appName, canonNames) => {
	const words = pascalWords(appName);
	if (words.length === 0) return null;
	let best = null;
	for (const cn of canonNames) {
		if (cn.length < FUZZY_NAME_MIN_LEN) continue;
		const lc = cn.toLowerCase();
		for (const w of words) {
			const lw = w.toLowerCase();
			if (lw === lc || (lw.length >= FUZZY_NAME_MIN_LEN && (lw.startsWith(lc) || lw.endsWith(lc)))) {
				if (!best || cn.length > best.name.length) best = { name: cn };
				break;
			}
		}
	}
	return best;
}

const fuzzyBasenameHit = (appPath, canonNames) => {
	const base = path.basename(appPath, path.extname(appPath));
	const words = kebabWords(base).map((w) => w.toLowerCase());
	if (words.length === 0) return null;
	const fullKebab = words.join("-");
	let best = null;
	for (const cn of canonNames) {
		if (cn.length < FUZZY_BASENAME_MIN_LEN) continue;
		const cnWords = pascalWords(cn).map((w) => w.toLowerCase());
		const cnKebab = cnWords.join("-");
		if (fullKebab === cnKebab || fullKebab === singular(cnKebab) || fullKebab === cnKebab.replace(/s$/, "")) {
			if (!best || cn.length > best.name.length) best = { name: cn };
			continue;
		}
		const lc = cn.toLowerCase();
		const lcs = singular(lc);
		for (const w of words) {
			if (w === lc || w === lcs || singular(w) === lc) {
				if (!best || cn.length > best.name.length) best = { name: cn };
				break;
			}
		}
		if (best && best.name === cn) continue;
		for (const w of words) {
			if (w.length < 4) continue;
			const ws = singular(w);
			if (cnWords.some((cw) => cw === w || cw === ws || singular(cw) === ws)) {
				if (!best || cn.length > best.name.length) best = { name: cn };
				break;
			}
		}
	}
	return best;
}

const computeGenericTokens = (canonComponents) => {
	const elements = [];
	for (const c of canonComponents) {
		for (const e of c.elementProps || []) {
			if ((e.tokens || []).length > 0) elements.push(e.tokens);
		}
	}
	const total = elements.length || 1;
	const freq = new Map();
	for (const toks of elements) {
		for (const t of new Set(toks)) freq.set(t, (freq.get(t) || 0) + 1);
	}
	const generic = new Set();
	for (const [t, n] of freq) if (n / total >= GENERIC_FREQ) generic.add(t);
	return generic;
}

const distinctiveTokens = (tokens, generic) => {
	const out = new Set();
	for (const t of tokens || []) if (!generic.has(t)) out.add(t);
	return out;
};

const buildCanonicalIndex = (canonComponents) => {
	const byName = new Map();
	const byBasename = new Map();
	for (const c of canonComponents) {
		const name = c.name;
		const key = name.toLowerCase();
		if (!byName.has(key)) byName.set(key, []);
		byName.get(key).push(c);
		const base = basenameToPascal(c.path).toLowerCase();
		if (!byBasename.has(base)) byBasename.set(base, []);
		byBasename.get(base).push(c);
	}
	return { byName, byBasename };
}

const canonElementIndex = (canonComponents, generic) => {
	const out = [];
	for (const c of canonComponents) {
		for (const e of c.elementProps || []) {
			const tag = (e.tag || "").toLowerCase();
			if (!tag) continue;
			const toks = distinctiveTokens(e.tokens, generic);
			if (toks.size === 0) continue;
			out.push({ canon: c, tag, toks });
		}
	}
	return out;
}

const findStructuralBest = (app, canonEls, generic, th, skipSelf) => {
	let best = null;
	for (const el of app.elementProps || []) {
		const appTag = (el.tag || "").toLowerCase();
		if (!appTag) continue;
		const appToks = distinctiveTokens(el.tokens, generic);
		if (appToks.size < th.minShared) continue;
		for (const cel of canonEls) {
			if (skipSelf && cel.canon.path === app.path) continue;
			const sameTag = cel.tag === appTag;
			const threshold = sameTag ? th.minRatioSameTag : th.minRatioAnyTag;
			let shared = 0;
			for (const t of cel.toks) if (appToks.has(t)) shared += 1;
			if (shared < th.minShared) continue;
			const ratio = shared / cel.toks.size;
			if (ratio < threshold) continue;
			const score = shared + (sameTag ? 1 : 0);
			if (!best || score > best.score || (score === best.score && ratio > best.ratio)) {
				best = { canon: cel.canon, ratio, shared, tag: appTag, sameTag, canonSize: cel.toks.size };
			}
		}
	}

	return best;
}

const isSubsequence = (needle, hay) => {
	let i = 0;
	for (const t of hay) {
		if (i < needle.length && needle[i] === t) i += 1;
	}
	return i === needle.length;
}

const matchJsxBlocks = (appComponents, canonComponents, generic, opts) => {
	const th = resolveThresholds(opts);
	const o = opts || {};
	const index = new Map();
	for (const c of canonComponents) {
		const seq = (c.subtrees && c.subtrees[0] && c.subtrees[0].seq) || (c.elementProps || []).map((e) => e.tag).filter(Boolean);
		if (seq.length < JSX_BLOCK_MIN_SEQ) continue;
		const toks = new Set();
		for (const e of c.elementProps || []) for (const t of e.tokens || []) toks.add(t);
		const dtoks = distinctiveTokens([...toks], generic);
		if (dtoks.size === 0) continue;
		const key = seq[0];
		if (!index.has(key)) index.set(key, []);
		index.get(key).push({ canon: c, seq, toks: dtoks });
	}
	const matches = [];
	const seen = new Set();
	for (const app of appComponents) {
		const subtrees = (app.subtrees || []).slice(0, JSX_BLOCK_MAX_SUBTREES);
		for (const st of subtrees) {
			const candidates = index.get(st.seq[0]);
			if (!candidates) continue;
			for (const cand of candidates) {
				if (cand.canon.name === app.name) continue;
				if (o.skipSelf && cand.canon.path === app.path) continue;
				if ((app.usesCanonical || []).includes(cand.canon.name)) continue;
				if (cand.seq.length > st.seq.length) continue;
				if (cand.seq.length / st.seq.length < JSX_BLOCK_MIN_RATIO) continue;
				if (!isSubsequence(cand.seq, st.seq)) continue;
				let shared = 0;
				for (const t of st.tokens) if (cand.toks.has(t)) shared += 1;
				if (shared < th.minShared) continue;
				const key = `${app.path}:${app.line}->${cand.canon.path}:${cand.canon.name}`;
				if (seen.has(key)) continue;
				seen.add(key);
				matches.push({
					app,
					canon: cand.canon,
					tier: "jsx-block",
					subtree: st,
					reason: `JSX block <${st.tag}> (${st.seq.length} elements) contains the full structure of ${cand.canon.name} (${cand.seq.length} elements, ${shared} shared token(s))`,
				});
				break;
			}
		}
	}
	return matches;
}

const matchComponents = (appComponents, canonComponents, opts) => {
	const o = opts || {};
	const th = resolveThresholds(o);
	const index = buildCanonicalIndex(canonComponents);
	const generic = computeGenericTokens(canonComponents);
	const canonEls = canonElementIndex(canonComponents, generic);
	const canonNames = [...new Set(canonComponents.map((c) => c.name))];
	const matches = [];
	const seen = new Set();

	const push = (app, canon, tier, reason) => {
		const key = `${app.path}:${app.line}->${canon.path}:${canon.name}`;
		if (seen.has(key)) return;
		seen.add(key);
		matches.push({ app, canon, tier, reason });
	};

	for (const app of appComponents) {
		if (o.canonicalFiles && o.canonicalFiles.has(app.path)) continue;
		if (o.isHtmlOnly && o.isHtmlOnly(app)) continue;

		const nameHits = [...(index.byName.get(app.name.toLowerCase()) || []), ...(o.skipBasename ? [] : index.byBasename.get(basenameToPascal(app.path).toLowerCase()) || [])].filter((c) => !(o.skipSelf && c.path === app.path));
		if (nameHits.length > 0) {
			const canon = nameHits[0];
			push(app, canon, "name", `name "${app.name}" matches canonical ${canon.name} (${canon.path})`);
			continue;
		}

		const structBest = findStructuralBest(app, canonEls, generic, th, o.skipSelf);

		const fuzzy = fuzzyNameHit(app.name, canonNames) || fuzzyBasenameHit(app.path, canonNames);
		if (fuzzy && structBest) {
			const canon = index.byName.get(fuzzy.name.toLowerCase());
			if (canon && canon.length > 0 && structBest.canon.path === canon[0].path) {
				push(app, canon[0], "name-fuzzy", `"${app.name}" (${path.basename(app.path)}) references canonical "${fuzzy.name}"`);
				continue;
			}
		}

		if (o.skipWrappers && (app.usesCanonical || []).length > 0) continue;

		if (structBest) {
			const tier = structBest.ratio >= th.exactRatio ? "structural-exact" : "structural-similar";
			const tagNote = structBest.sameTag ? `common element <${structBest.tag}>` : `element <${structBest.tag}> (no canonical tag match)`;
			push(app, structBest.canon, tier, `${structBest.shared}/${structBest.canonSize} distinctive class tokens shared (${(structBest.ratio * 100).toFixed(0)}%), ${tagNote}`);
		}
	}

	return matches;
}

module.exports = { matchComponents, matchJsxBlocks, buildCanonicalIndex, computeGenericTokens, distinctiveTokens, kebabToPascal, basenameToPascal, fuzzyNameHit, fuzzyBasenameHit, MIN_SHARED, MIN_RATIO_SAME_TAG, MIN_RATIO_ANY_TAG, EXACT_RATIO, GENERIC_FREQ };
