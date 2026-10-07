"use strict";

const path = require("node:path");
const { pascalWords, GENERIC_WORDS } = require("../normalize/words.js");

const FUZZY_NAME_MIN_LEN = 5;
const FUZZY_BASENAME_MIN_LEN = 4;

const kebabToPascal = (s) =>
	s
		.split(/[-_ ]+/)
		.filter(Boolean)
		.map((w) => w[0].toUpperCase() + w.slice(1))
		.join("");

const basenameToPascal = (file) => kebabToPascal(path.basename(file, path.extname(file)));

const kebabWords = (s) => String(s || "").split(/[^A-Za-z0-9]+/).filter(Boolean);
const singular = (w) => (w.length > 3 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w);

const wordSim = (a, b) => {
	const wa = new Set(pascalWords(a).map((w) => singular(w.toLowerCase())).filter((w) => w.length >= 3 && !GENERIC_WORDS.has(w)));
	const wb = new Set(pascalWords(b).map((w) => singular(w.toLowerCase())).filter((w) => w.length >= 3 && !GENERIC_WORDS.has(w)));
	if (wa.size === 0 || wb.size === 0) return 0;
	let inter = 0;
	for (const w of wa) if (wb.has(w)) inter += 1;
	const union = wa.size + wb.size - inter;

	return union === 0 ? 0 : inter / union;
};

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
};

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
};

const matchName = (candidate, canon, ctx) => {
	const o = ctx || {};
	const canonNames = o.canonNames || [canon.name];

	const exactName = candidate.name === canon.name;
	const exactBasename = !exactName && basenameToPascal(candidate.path) === canon.name;

	let fuzzy = null;
	if (!exactName && !exactBasename) {
		fuzzy = fuzzyNameHit(candidate.name, [canon.name]) || fuzzyBasenameHit(candidate.path, [canon.name]);
	}

	const word = wordSim(candidate.name, canon.name);

	let score = 0;
	let matchType = null;
	if (exactName) {
		score = 1;
		matchType = "exact-name";
	} else if (exactBasename) {
		score = 0.9;
		matchType = "exact-basename";
	} else if (fuzzy) {
		const byName = !!fuzzyNameHit(candidate.name, [canon.name]);
		score = (byName ? 0.7 : 0.6) * (0.5 + 0.5 * word);
		matchType = byName ? "fuzzy-name" : "fuzzy-basename";
	} else if (word > 0) {
		score = 0.6 * word;
		matchType = "word-overlap";
	}

	const evidence = {
		exactName,
		exactBasename,
		fuzzy: fuzzy ? fuzzy.name : null,
		wordSim: Math.round(word * 100) / 100,
		matchType,
	};
	return { score, evidence };
};

module.exports = {
	matchName,
	kebabToPascal,
	basenameToPascal,
	fuzzyNameHit,
	fuzzyBasenameHit,
};
