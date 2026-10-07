"use strict";

const test = (match) => {
	if ((match.app.usesCanonical || []).includes(match.canon.name)) {
		return `${match.app.name} renders ${match.canon.name} (composition, not a duplicate)`;
	}
	if ((match.canon.usesCanonical || []).includes(match.app.name)) {
		return `${match.canon.name} renders ${match.app.name} (composition, not a duplicate)`;
	}
	return null;
};

module.exports = { name: "drop-usages", test };
