"use strict";

const test = (match) => {
	if ((match.app.usesCanonical || []).includes(match.canon.name)) {
		return `renders canonical ${match.canon.name} (usage, not a duplicate)`;
	}
	return null;
};

module.exports = { name: "drop-usages", test };
