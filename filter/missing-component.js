"use strict";

const { pascalWords, GENERIC_WORDS } = require("../normalize/words.js");
const { matchStructure } = require("../matcher/structure.js");

const DEFAULT_MIN_CLUSTER = 3;
const MIN_PAIRWISE_STRUCTURE = 0.4;
const MIN_PAIR_FLOOR = 0.3;
const CANON_CONF_FLOOR = 0.25;

const pascalCase = (words) => words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join("");

const suggestName = (appNames, canonName = null) => {
	if (canonName) {
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
		const common = order.filter((k) => counts.get(k) >= Math.ceil(appNames.length * 0.6));
		const meaningful = common.filter((k) => !GENERIC_WORDS.has(k));
		if (meaningful.length > 0) {
			return pascalCase([meaningful[0], ...pascalWords(canonName).slice(0, 2)]);
		}
	}
	if (canonName) return `Shared${canonName}`;
	return "SharedComponent";
};

const pairwiseAverage = (apps) => {
	let total = 0;
	let pairs = 0;
	for (let i = 0; i < apps.length; i += 1) {
		for (let j = i + 1; j < apps.length; j += 1) {
			const s = matchStructure(apps[i], apps[j]);
			total += s.score;
			pairs += 1;
		}
	}

	return pairs === 0 ? 0 : total / pairs;
};

const pairwiseAllAbove = (apps, floor) => {
	for (let i = 0; i < apps.length; i += 1)
		for (let j = i + 1; j < apps.length; j += 1) if (matchStructure(apps[i], apps[j]).score < floor) return false;

	return true;
};

const resolveClusterMembers = (group) => {
	const strong = group.filter((m) => m.decision.confidence >= CANON_CONF_FLOOR);
	const apps = [...new Map(strong.map((m) => [m.app.name, m.app])).values()];
	if (apps.length >= 2 && pairwiseAllAbove(apps, MIN_PAIR_FLOOR)) return strong;
	const dups = strong.filter((m) => m.decision.tier === "duplicate");
	const dupApps = [...new Map(dups.map((m) => [m.app.name, m.app])).values()];

	return dups.length >= 2 && pairwiseAllAbove(dupApps, MIN_PAIR_FLOOR) ? dups : null;
};

const findMissingComponents = (matches, { minCluster = DEFAULT_MIN_CLUSTER } = {}) => {
	const byCanon = new Map();
	for (const match of matches) {
		const key = match.canon.name;
		if (!byCanon.has(key)) byCanon.set(key, []);
		byCanon.get(key).push(match);
	}
	const clusters = [];
	for (const [canonName, group] of byCanon) {
		const members = resolveClusterMembers(group);
		if (!members) continue;
		if (new Set(members.map((m) => m.app.name)).size < minCluster) continue;
		clusters.push({
			name: suggestName(members.map((m) => m.app.name), canonName),
			canon: group[0].canon,
			matches: [...members].sort((a, b) => b.decision.confidence - a.decision.confidence),
		});
	}
	clusters.sort((a, b) => b.matches.length - a.matches.length || a.name.localeCompare(b.name));
	const clusteredKeys = new Set();
	for (const c of clusters) {
		for (const m of c.matches) clusteredKeys.add(m.app.name + "::" + m.canon.name);
	}
	const remaining = matches.filter((m) => !clusteredKeys.has(m.app.name + "::" + m.canon.name));
	return { clusters, remaining };
};

module.exports = {
	findMissingComponents,
	suggestName,
	DEFAULT_MIN_CLUSTER,
	MIN_PAIRWISE_STRUCTURE,
};
