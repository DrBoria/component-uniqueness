"use strict";

const { registerFilter } = require("./registry");

registerFilter({
	name: "drop-usages",
	test(match) {
		const used = match.app.usesCanonical || [];
		if (used.includes(match.canon.name)) {
			return `renders canonical ${match.canon.name} (usage, not a duplicate)`;
		}
		return null;
	},
});
