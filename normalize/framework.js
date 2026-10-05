"use strict";

const { INTERACTIVE_TAGS } = require("./dom.js");

const EVENT_PREFIX = /^(on|ng|v-on:|@)/;

const isEventName = (name) => EVENT_PREFIX.test(String(name || ""));

const eventNameOf = (name) => {
	const raw = String(name || "");
	if (raw.startsWith("on")) return raw.slice(2).toLowerCase();
	if (raw.startsWith("ng")) return raw.slice(2).toLowerCase();
	if (raw.startsWith("v-on:")) return raw.slice(5).toLowerCase();
	if (raw.startsWith("@")) return raw.slice(1).toLowerCase();
	return raw.toLowerCase();
};

const walk = (tree, visit) => {
	if (!tree) return;
	visit(tree);
	for (const child of tree.children || []) walk(child, visit);
};

const propsOf = (tree) => {
	const out = new Set();
	walk(tree, (node) => {
		for (const name of Object.keys(node.attrs || {})) {
			if (isEventName(name)) continue;
			out.add(name);
		}
	});
	return [...out].sort();
};

const eventsOf = (tree) => {
	const out = new Set();
	walk(tree, (node) => {
		if (INTERACTIVE_TAGS.has(node.tag)) out.add("click");
		for (const name of Object.keys(node.attrs || {})) {
			if (isEventName(name)) out.add(eventNameOf(name));
		}
	});
	return [...out].sort();
};

const namesOf = (tree) => {
	const out = [];
	walk(tree, (node) => {
		if (node.tag) out.push(node.tag);
	});
	return out;
};

const normalizeFramework = (tree, label) => {
	const profile = {
		props: propsOf(tree),
		events: eventsOf(tree),
		names: namesOf(tree),
		open: !!(tree && tree.spread),
	};
	return profile;
};

const jaccard = (a, b) => {
	const A = new Set(a || []);
	const B = new Set(b || []);
	if (A.size === 0 || B.size === 0) return 0;
	let inter = 0;
	for (const item of A) if (B.has(item)) inter += 1;
	const union = A.size + B.size - inter;
	return union === 0 ? 0 : inter / union;
};

const shared = (a, b) => {
	const B = new Set(b || []);
	return [...new Set(a || [])].filter((item) => B.has(item)).sort();
};

const frameworkSimilarity = (a, b, label) => {
	const props = jaccard(a && a.props, b && b.props);
	const events = jaccard(a && a.events, b && b.events);
	const names = jaccard(a && a.names, b && b.names);
	const parts = [];
	if ((a && a.props.length) || (b && b.props.length)) parts.push({ w: 0.5, v: props });
	if ((a && a.events.length) || (b && b.events.length)) parts.push({ w: 0.2, v: events });
	if ((a && a.names.length) || (b && b.names.length)) parts.push({ w: 0.3, v: names });
	const totalW = parts.reduce((sum, part) => sum + part.w, 0);
	const score = totalW === 0 ? 0 : parts.reduce((sum, part) => sum + part.w * part.v, 0) / totalW;
	return { score, props, events, names };
};

module.exports = {
	normalizeFramework,
	frameworkSimilarity,
	propsOf,
	eventsOf,
	namesOf,
	isEventName,
	eventNameOf,
};
