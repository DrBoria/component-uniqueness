"use strict";

const { matchName } = require("./name");
const { matchStructure } = require("./structure");
const { matchBehavior } = require("./behavior");
const { matchA11y, tokensOf } = require("./a11y");

const restrictTo = (candidate, canon) => {
	const events = new Set(candidate.framework.events);
	const props = new Set(candidate.framework.props);
	const a11y = tokensOf(candidate, "a11y");

	return {
		...canon,
		framework: {
			props: canon.framework.open ? [...props] : (canon.framework.props || []).filter((p) => props.has(p)),
			events: (canon.framework.events || []).filter((e) => events.has(e)),
			names: [],
		},
		a11y: canon.framework.open ? candidate.a11y || [] : (canon.a11y || []).filter((t) => a11y.has(String(t).toLowerCase())),
	};
};

const matchSignals = (candidate, canon, { canonNames, frameworkMatcher }) => {
	const target = candidate.partial ? restrictTo(candidate, canon) : canon;

	return {
		name: matchName(candidate, target, { canonNames }),
		structure: matchStructure(candidate, target),
		behavior: matchBehavior(candidate, target),
		a11y: matchA11y(candidate, target),
		framework: frameworkMatcher.matchFramework(candidate, target),
	};
};

module.exports = { matchSignals };
