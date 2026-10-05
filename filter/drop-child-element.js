"use strict";

const test = (match) => {
	if (match.tier === "name" || match.tier === "name-fuzzy" || match.tier === "jsx-block") return null;
	const appEls = (match.app.elementProps || []).length;
	const canonEls = (match.canon.elementProps || []).length;
	if (canonEls > 0 && appEls > 3 * canonEls) {
		return `app has ${appEls} elements vs canonical's ${canonEls} — match is on a child element, not the component itself`;
	}
	return null;
};

module.exports = { name: "drop-child-element", test };
