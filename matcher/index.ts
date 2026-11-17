"use strict";

import { matchName } from "./name";
import { matchStructure } from "./structure";
import { matchStyles } from "./styles";
import { matchBehavior } from "./behavior";
import { matchA11y, tokensOf } from "./a11y";

const restrictTo = (candidate, canon) => {
	const events = new Set(candidate.framework.events);
	const a11y = tokensOf(candidate, "a11y");
	const openProps = canon.framework.open ? [] : canon.framework.props || [];
	// An OPEN canonical (spread passthrough) imposes no component usages either:
	// the part's own usages are not evidence about the canonical's framework.
	const usages = canon.framework.open ? [] : canon.framework.usages || [];

	return {
		...canon,
		framework: {
			props: openProps,
			events: (canon.framework.events || []).filter((e) => events.has(e)),
			names: [],
			usages,
		},
		a11y: (canon.a11y || []).filter((t) => a11y.has(String(t).toLowerCase())),
	};
};

const matchSignals = (candidate, canon, { canonNames, frameworkMatcher }) => {
	const target = candidate.partial ? restrictTo(candidate, canon) : canon;

	return {
		name: matchName(candidate, target, { canonNames }),
		structure: matchStructure(candidate, target),
		styles: matchStyles(candidate, target),
		behavior: matchBehavior(candidate, target),
		a11y: matchA11y(candidate, target),
		framework: frameworkMatcher.matchFramework(candidate, target),
	};
};

export {  matchSignals  };
