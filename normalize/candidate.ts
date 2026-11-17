"use strict";

import { normalizeDom } from "./dom.js";
import { normalizeFramework } from "./framework.js";
import { rawClassTokens } from "../playgrounds/framework-entrypoint.js";

const buildCandidate = (comp, config) => ({
	...comp,
	dom: normalizeDom(comp.tree, config, comp.name),
	framework: normalizeFramework(comp.rawTree || comp.tree, comp.name),
	rawClasses: [...rawClassTokens(comp.rawTree || comp.tree)],
});

const buildElementCandidate = (element, config) => {
	const framework = normalizeFramework(element.tree, element.name);
	if (framework.events.length === 0 && element.a11y.length === 0) return null;
	const dom = normalizeDom(element.tree, config, element.name);

	return { ...element, partial: true, dom, framework: { ...framework, names: [] }, rawClasses: [...rawClassTokens(element.tree)] };
};

export {  buildCandidate, buildElementCandidate  };
