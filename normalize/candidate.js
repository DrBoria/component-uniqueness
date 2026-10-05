"use strict";

const { normalizeDom } = require("./dom.js");
const { normalizeFramework } = require("./framework.js");

const buildCandidate = (comp, config) => ({
	...comp,
	dom: normalizeDom(comp.tree, config, comp.name),
	framework: normalizeFramework(comp.tree, comp.name),
});

const buildElementCandidate = (element, config) => {
	const framework = normalizeFramework(element.tree, element.name);
	if (framework.events.length === 0 && element.a11y.length === 0) return null;
	const dom = normalizeDom(element.tree, config, element.name);

	return { ...element, partial: true, dom, framework: { ...framework, names: [] } };
};

module.exports = { buildCandidate, buildElementCandidate };
