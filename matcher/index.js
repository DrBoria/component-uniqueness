"use strict";

const { matchName } = require("./name");
const { matchStructure } = require("./structure");
const { matchBehavior } = require("./behavior");
const { matchA11y, tokensOf } = require("./a11y");

const restrictTo = (candidate, canon) => {
	const events = new Set(candidate.framework.events);
	const a11y = tokensOf(candidate, "a11y");
	const openProps = canon.framework.open ? [] : canon.framework.props || [];

	return {
		...canon,
		framework: {
			props: openProps,
			events: (canon.framework.events || []).filter((e) => events.has(e)),
			names: [],
		},
		a11y: (canon.a11y || []).filter((t) => a11y.has(String(t).toLowerCase())),
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
