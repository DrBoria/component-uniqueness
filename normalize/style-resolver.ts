"use strict";

import { styledDeclarations, available as styledAvailable } from "../playgrounds/styled-components.js";
import { cssTextToStyles } from "./style.js";
import { externalTagOf } from "./external-html.js";

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
		// `styled(Image)` where Image is next/image: the base is the HTML it renders.
		const externalBase = info.componentRef ? externalTagOf(info.externalSpec, info.componentRef) : null;
		return { baseTag: info.baseTag || externalBase, componentRef: externalBase ? null : info.componentRef, styleObj: css, unresolved: [...unresolved, ...info.unresolved] };
	};
};

export {  buildStyledResolver  };
