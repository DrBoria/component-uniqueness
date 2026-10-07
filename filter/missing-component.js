"use strict";

const { pascalWords, GENERIC_WORDS } = require("../normalize/words.js");

const DEFAULT_MIN_CLUSTER = 3;

const pascalCase = (words) => words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join("");

const suggestName = (appNames, canonName = null) => {
	const counts = new Map();
	const order = [];
	for (const name of appNames) {
		for (const w of pascalWords(name)) {
			const k = w.toLowerCase();
			if (!counts.has(k)) {
				counts.set(k, 0);
				order.push(k);
			}
			counts.set(k, counts.get(k) + 1);
		}
	}
	const common = order.filter((k) => counts.get(k) >= 2);
	const meaningful = common.filter((k) => !GENERIC_WORDS.has(k));
	const base = (meaningful.length > 0 ? meaningful : common).slice(0, 3).map((k) => k[0].toUpperCase() + k.slice(1));
	if (base.length > 0) {
		const name = pascalCase(base);
		if (meaningful.length > 0) return name;
		return canonName ? `${name}${canonName}` : name;
	}
	if (canonName) {
		const canonWords = pascalWords(canonName).filter((w) => !GENERIC_WORDS.has(w.toLowerCase()));
		if (canonWords.length > 0) {
			return pascalCase(["shared", ...canonWords.slice(0, 2)]);
		}
		return `Shared${canonName}`;
	}
	return "SharedComponent";
};

const findMissingComponents = (matches, { minCluster = DEFAULT_MIN_CLUSTER } = {}) => {
	const byCanon = new Map();
	for (const match of matches) {
		const key = match.canon.name;
		if (!byCanon.has(key)) byCanon.set(key, []);
		byCanon.get(key).push(match);
	}
	const clusters = [];
	const clusteredKeys = new Set();
	for (const [canonName, group] of byCanon) {
		const distinctApps = new Set(group.map((m) => m.app.name));
		if (distinctApps.size < minCluster) continue;
		clusteredKeys.add(canonName);
		clusters.push({
			name: suggestName(group.map((m) => m.app.name), canonName),
			canon: group[0].canon,
			matches: [...group].sort((a, b) => b.decision.confidence - a.decision.confidence),
		});
	}
	clusters.sort((a, b) => b.matches.length - a.matches.length || a.name.localeCompare(b.name));
	const remaining = matches.filter((m) => !clusteredKeys.has(m.canon.name));
	return { clusters, remaining };
};

module.exports = {
	findMissingComponents,
	suggestName,
	DEFAULT_MIN_CLUSTER,
};
