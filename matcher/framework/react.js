"use strict";

const { frameworkSimilarity } = require("../../normalize/framework.js");

const matchFramework = (candidate, canon) => {
	const cand = candidate.framework || { props: [], events: [], names: [] };
	const canonFw = canon.framework || { props: [], events: [], names: [] };
	const sim = frameworkSimilarity(cand, canonFw, `${candidate.name} vs ${canon.name}`);
	return {
		score: sim.score,
		evidence: {
			propsSimilarity: sim.props,
			eventsSimilarity: sim.events,
			namesSimilarity: sim.names,
			candidateProps: cand.props,
			canonicalProps: canonFw.props,
			candidateEvents: cand.events,
			canonicalEvents: canonFw.events,
			candidateNames: cand.names,
			canonicalNames: canonFw.names,
		},
	};
};

module.exports = { matchFramework };
