"use strict";

const { registerFilter } = require("./registry");

registerFilter({
	name: "drop-child-element-matches",
	test(match) {
		if (match.tier === "name" || match.tier === "name-fuzzy" || match.tier === "jsx-block") return null;
		const appEls = (match.app.elementProps || []).length;
		const canonEls = (match.canon.elementProps || []).length;
		if (canonEls > 0 && appEls > 3 * canonEls) {
			return `app has ${appEls} elements vs canonical's ${canonEls} — match is on a child element, not the component itself`;
		}
		return null;
	},
});
