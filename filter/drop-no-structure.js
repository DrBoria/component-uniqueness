"use strict";

const test = (match) => {
	if (!match.app.partial) return null;
	const structure = match.decision.signals && match.decision.signals.structure;
	if (!structure) return null;
	if (structure.score <= 0) {
		return "partial shares no structure with the canonical — match is driven only by framework/a11y/behavior";
	}
	return null;
};

module.exports = { name: "drop-no-structure", test };
