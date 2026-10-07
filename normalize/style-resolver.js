"use strict";

const { styledDeclarations, available: styledAvailable } = require("../playgrounds/styled-components.js");
const { cssTextToStyles } = require("./style.js");

const declarationsCache = new WeakMap();

const declarationsOf = (sf) => {
	if (!declarationsCache.has(sf)) declarationsCache.set(sf, styledDeclarations(sf));
	return declarationsCache.get(sf);
};

const buildStyledResolver = () => {
	if (!styledAvailable()) return null;
	return (tag, sf) => {
		if (!sf || !tag) return null;
		const info = declarationsOf(sf).get(tag);
		if (!info) return null;
		const { css, unresolved } = cssTextToStyles(info.cssText);
		return { baseTag: info.baseTag, componentRef: info.componentRef, styleObj: css, unresolved: [...unresolved, ...info.unresolved] };
	};
};

module.exports = { buildStyledResolver };
