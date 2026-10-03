"use strict";

const { entries, keys } = require("remeda");

const TW = {
	flex: ["display", "flex"],
	"flex-1": ["flex", "1"],
	"flex-auto": ["flex", "auto"],
	"flex-none": ["flex", "none"],
	block: ["display", "block"],
	"inline-block": ["display", "inline-block"],
	hidden: ["display", "none"],
	grid: ["display", "grid"],
	"inline-grid": ["display", "inline-grid"],
	"flex-col": ["flex-direction", "column"],
	"flex-row": ["flex-direction", "row"],
	"flex-wrap": ["flex-wrap", "wrap"],
	"flex-nowrap": ["flex-wrap", "nowrap"],
	"flex-col-reverse": ["flex-direction", "column-reverse"],
	"flex-row-reverse": ["flex-direction", "row-reverse"],
	"justify-center": ["justify-content", "center"],
	"justify-between": ["justify-content", "space-between"],
	"justify-around": ["justify-content", "space-around"],
	"justify-start": ["justify-content", "flex-start"],
	"justify-end": ["justify-content", "flex-end"],
	"items-center": ["align-items", "center"],
	"items-start": ["align-items", "flex-start"],
	"items-end": ["align-items", "flex-end"],
	"items-baseline": ["align-items", "baseline"],
	"items-stretch": ["align-items", "stretch"],
	"self-center": ["align-self", "center"],
	"self-start": ["align-self", "flex-start"],
	"self-end": ["align-self", "flex-end"],
	"self-stretch": ["align-self", "stretch"],
	"content-center": ["align-content", "center"],
	"content-between": ["align-content", "space-between"],
	"content-start": ["align-content", "flex-start"],
	"content-end": ["align-content", "flex-end"],
	gap: ["gap", null],
	"gap-0": ["gap", "0"],
	"gap-1": ["gap", "0.25rem"],
	"gap-2": ["gap", "0.5rem"],
	"gap-3": ["gap", "0.75rem"],
	"gap-4": ["gap", "1rem"],
	"gap-5": ["gap", "1.25rem"],
	"gap-6": ["gap", "1.5rem"],
	"gap-8": ["gap", "2rem"],
	"gap-10": ["gap", "2.5rem"],
	"gap-12": ["gap", "3rem"],
	"gap-16": ["gap", "4rem"],
	"gap-20": ["gap", "5rem"],
	"gap-24": ["gap", "6rem"],
	"gap-x-4": ["column-gap", "1rem"],
	"gap-y-4": ["row-gap", "1rem"],
	"gap-x-8": ["column-gap", "2rem"],
	"gap-y-8": ["row-gap", "2rem"],
	rounded: ["border-radius", "0.25rem"],
	"rounded-sm": ["border-radius", "0.125rem"],
	"rounded-md": ["border-radius", "0.375rem"],
	"rounded-lg": ["border-radius", "0.5rem"],
	"rounded-xl": ["border-radius", "0.75rem"],
	"rounded-2xl": ["border-radius", "1rem"],
	"rounded-3xl": ["border-radius", "1.5rem"],
	"rounded-full": ["border-radius", "9999px"],
	"rounded-none": ["border-radius", "0"],
	"rounded-t-full": ["border-radius", "9999px"],
	"rounded-l-full": ["border-radius", "9999px"],
	"rounded-r-full": ["border-radius", "9999px"],
	"rounded-tl": ["border-top-left-radius", "0.25rem"],
	"rounded-tr": ["border-top-right-radius", "0.25rem"],
	"rounded-bl": ["border-bottom-left-radius", "0.25rem"],
	"rounded-br": ["border-bottom-right-radius", "0.25rem"],
	shadow: ["box-shadow", "1"],
	"shadow-sm": ["box-shadow", "1"],
	"shadow-md": ["box-shadow", "1"],
	"shadow-lg": ["box-shadow", "1"],
	"shadow-xl": ["box-shadow", "1"],
	"shadow-2xl": ["box-shadow", "1"],
	"shadow-inner": ["box-shadow", "1"],
	"shadow-none": ["box-shadow", "none"],
	border: ["border", "1"],
	"border-0": ["border-width", "0"],
	"border-2": ["border-width", "2px"],
	"border-4": ["border-width", "4px"],
	"border-t": ["border-top", "1"],
	"border-b": ["border-bottom", "1"],
	"border-l": ["border-left", "1"],
	"border-r": ["border-right", "1"],
	"border-dashed": ["border-style", "dashed"],
	"border-dotted": ["border-style", "dotted"],
	"border-solid": ["border-style", "solid"],
	"border-none": ["border", "none"],
	"border-collapse": ["border-collapse", "collapse"],
	"border-separate": ["border-separate", "separate"],
	"overflow-hidden": ["overflow", "hidden"],
	"overflow-auto": ["overflow", "auto"],
	"overflow-scroll": ["overflow", "scroll"],
	"overflow-visible": ["overflow", "visible"],
	"overflow-x-auto": ["overflow-x", "auto"],
	"overflow-y-auto": ["overflow-y", "auto"],
	truncate: ["text-overflow", "ellipsis"],
	"line-clamp-2": ["display", "-webkit-box"],
	"w-full": ["width", "100%"],
	"w-auto": ["width", "auto"],
	"w-screen": ["width", "100vw"],
	"min-w-0": ["min-width", "0"],
	"min-w-full": ["min-width", "100%"],
	"max-w-full": ["max-width", "100%"],
	"max-w-screen": ["max-width", "100vw"],
	"max-w-prose": ["max-width", "65ch"],
	"max-w-xs": ["max-width", "20rem"],
	"max-w-sm": ["max-width", "24rem"],
	"max-w-md": ["max-width", "28rem"],
	"max-w-lg": ["max-width", "32rem"],
	"max-w-xl": ["max-width", "36rem"],
	"max-w-2xl": ["max-width", "42rem"],
	"max-w-3xl": ["max-width", "48rem"],
	"max-w-4xl": ["max-width", "56rem"],
	"max-w-5xl": ["max-width", "64rem"],
	"max-w-6xl": ["max-width", "72rem"],
	"max-w-7xl": ["max-width", "80rem"],
	"h-full": ["height", "100%"],
	"h-auto": ["height", "auto"],
	"h-screen": ["height", "100vh"],
	"min-h-0": ["min-height", "0"],
	"min-h-full": ["min-height", "100%"],
	"min-h-screen": ["min-height", "100vh"],
	"p-0": ["padding", "0"],
	"p-1": ["padding", "0.25rem"],
	"p-2": ["padding", "0.5rem"],
	"p-3": ["padding", "0.75rem"],
	"p-4": ["padding", "1rem"],
	"p-5": ["padding", "1.25rem"],
	"p-6": ["padding", "1.5rem"],
	"p-8": ["padding", "2rem"],
	"p-10": ["padding", "2.5rem"],
	"p-12": ["padding", "3rem"],
	"px-0": ["padding-left", "0"],
	"px-1": ["padding-left", "0.25rem"],
	"px-2": ["padding-left", "0.5rem"],
	"px-3": ["padding-left", "0.75rem"],
	"px-4": ["padding-left", "1rem"],
	"px-5": ["padding-left", "1.25rem"],
	"px-6": ["padding-left", "1.5rem"],
	"px-8": ["padding-left", "2rem"],
	"py-0": ["padding-top", "0"],
	"py-1": ["padding-top", "0.25rem"],
	"py-2": ["padding-top", "0.5rem"],
	"py-3": ["padding-top", "0.75rem"],
	"py-4": ["padding-top", "1rem"],
	"py-5": ["padding-top", "1.25rem"],
	"py-6": ["padding-top", "1.5rem"],
	"py-8": ["padding-top", "2rem"],
	"pt-4": ["padding-top", "1rem"],
	"pb-4": ["padding-bottom", "1rem"],
	"pl-4": ["padding-left", "1rem"],
	"pr-4": ["padding-right", "1rem"],
	"pt-8": ["padding-top", "2rem"],
	"pb-8": ["padding-bottom", "2rem"],
	"pl-8": ["padding-left", "2rem"],
	"pr-8": ["padding-right", "2rem"],
	"m-0": ["margin", "0"],
	"m-1": ["margin", "0.25rem"],
	"m-2": ["margin", "0.5rem"],
	"m-3": ["margin", "0.75rem"],
	"m-4": ["margin", "1rem"],
	"m-6": ["margin", "1.5rem"],
	"m-8": ["margin", "2rem"],
	"mx-auto": ["margin-left", "auto"],
	"my-4": ["margin-top", "1rem"],
	"mt-0": ["margin-top", "0"],
	"mt-1": ["margin-top", "0.25rem"],
	"mt-2": ["margin-top", "0.5rem"],
	"mt-3": ["margin-top", "0.75rem"],
	"mt-4": ["margin-top", "1rem"],
	"mt-6": ["margin-top", "1.5rem"],
	"mt-8": ["margin-top", "2rem"],
	"mb-0": ["margin-bottom", "0"],
	"mb-1": ["margin-bottom", "0.25rem"],
	"mb-2": ["margin-bottom", "0.5rem"],
	"mb-3": ["margin-bottom", "0.75rem"],
	"mb-4": ["margin-bottom", "1rem"],
	"mb-6": ["margin-bottom", "1.5rem"],
	"mb-8": ["margin-bottom", "2rem"],
	"ml-0": ["margin-left", "0"],
	"ml-4": ["margin-left", "1rem"],
	"mr-4": ["margin-right", "1rem"],
	"ml-auto": ["margin-left", "auto"],
	"mr-auto": ["margin-right", "auto"],
	"mt-auto": ["margin-top", "auto"],
	"mb-auto": ["margin-bottom", "auto"],
	static: ["position", "static"],
	fixed: ["position", "fixed"],
	absolute: ["position", "absolute"],
	relative: ["position", "relative"],
	sticky: ["position", "sticky"],
	"inset-0": ["inset", "0"],
	"top-0": ["top", "0"],
	"top-4": ["top", "1rem"],
	"top-1/2": ["top", "50%"],
	"bottom-0": ["bottom", "0"],
	"left-0": ["left", "0"],
	"right-0": ["right", "0"],
	"z-0": ["z-index", "0"],
	"z-10": ["z-index", "10"],
	"z-20": ["z-index", "20"],
	"z-30": ["z-index", "30"],
	"z-40": ["z-index", "40"],
	"z-50": ["z-index", "50"],
	"z-auto": ["z-index", "auto"],
	"text-center": ["text-align", "center"],
	"text-left": ["text-align", "left"],
	"text-right": ["text-align", "right"],
	"text-justify": ["text-align", "justify"],
	"text-2xl": ["font-size", "1.5rem"],
	"text-xl": ["font-size", "1.25rem"],
	"text-lg": ["font-size", "1.125rem"],
	"text-base": ["font-size", "1rem"],
	"text-sm": ["font-size", "0.875rem"],
	"text-xs": ["font-size", "0.75rem"],
	"text-2xs": ["font-size", "0.625rem"],
	"font-bold": ["font-weight", "700"],
	"font-semibold": ["font-weight", "600"],
	"font-medium": ["font-weight", "500"],
	"font-normal": ["font-weight", "400"],
	"font-light": ["font-weight", "300"],
	"font-thin": ["font-weight", "100"],
	"font-extrabold": ["font-weight", "800"],
	"font-black": ["font-weight", "900"],
	"font-extralight": ["font-weight", "200"],
	italic: ["font-style", "italic"],
	"not-italic": ["font-style", "normal"],
	underline: ["text-decoration", "underline"],
	"line-through": ["text-decoration", "line-through"],
	"no-underline": ["text-decoration", "none"],
	uppercase: ["text-transform", "uppercase"],
	lowercase: ["text-transform", "lowercase"],
	capitalize: ["text-transform", "capitalize"],
	"normal-case": ["text-transform", "none"],
	"tracking-tight": ["letter-spacing", "-0.025em"],
	"tracking-wide": ["letter-spacing", "0.025em"],
	"tracking-widest": ["letter-spacing", "0.1em"],
	"leading-none": ["line-height", "1"],
	"leading-tight": ["line-height", "1.25"],
	"leading-snug": ["line-height", "1.375"],
	"leading-normal": ["line-height", "1.5"],
	"leading-relaxed": ["line-height", "1.625"],
	"leading-loose": ["line-height", "2"],
	"whitespace-nowrap": ["white-space", "nowrap"],
	"whitespace-normal": ["white-space", "normal"],
	"whitespace-pre": ["white-space", "pre"],
	"whitespace-pre-line": ["white-space", "pre-line"],
	"whitespace-pre-wrap": ["white-space", "pre-wrap"],
	"break-words": ["word-break", "break-word"],
	"break-all": ["word-break", "break-all"],
	"list-none": ["list-style", "none"],
	"list-disc": ["list-style", "disc"],
	"list-decimal": ["list-style", "decimal"],
	"appearance-none": ["appearance", "none"],
	"cursor-pointer": ["cursor", "pointer"],
	"cursor-default": ["cursor", "default"],
	"cursor-wait": ["cursor", "wait"],
	"cursor-not-allowed": ["cursor", "not-allowed"],
	"cursor-text": ["cursor", "text"],
	"pointer-events-none": ["pointer-events", "none"],
	"pointer-events-auto": ["pointer-events", "auto"],
	"select-none": ["user-select", "none"],
	"select-text": ["user-select", "text"],
	"resize-none": ["resize", "none"],
	"resize-y": ["resize", "vertical"],
	"resize-x": ["resize", "horizontal"],
	resize: ["resize", "both"],
	"object-cover": ["object-fit", "cover"],
	"object-contain": ["object-fit", "contain"],
	"object-fill": ["object-fit", "fill"],
	"object-none": ["object-fit", "none"],
	"object-scale-down": ["object-fit", "scale-down"],
	transition: ["transition", "1"],
	"transition-all": ["transition-property", "all"],
	"transition-colors": ["transition-property", "color"],
	"transition-opacity": ["transition-property", "opacity"],
	"transition-transform": ["transition-property", "transform"],
	"transition-none": ["transition", "none"],
	"duration-150": ["transition-duration", "150ms"],
	"duration-200": ["transition-duration", "200ms"],
	"duration-300": ["transition-duration", "300ms"],
	"duration-500": ["transition-duration", "500ms"],
	"duration-700": ["transition-duration", "700ms"],
	"ease-in": ["transition-timing-function", "cubic-bezier(0.4, 0, 1, 1)"],
	"ease-out": ["transition-timing-function", "cubic-bezier(0, 0, 0.2, 1)"],
	"ease-in-out": ["transition-timing-function", "cubic-bezier(0.4, 0, 0.2, 1)"],
	"ease-linear": ["transition-timing-function", "linear"],
	"animate-spin": ["animation", "spin"],
	"animate-ping": ["animation", "ping"],
	"animate-pulse": ["animation", "pulse"],
	"animate-bounce": ["animation", "bounce"],
	"animate-none": ["animation", "none"],
	transform: ["transform", "1"],
	"scale-50": ["transform", "scale(0.5)"],
	"scale-75": ["transform", "scale(0.75)"],
	"scale-90": ["transform", "scale(0.9)"],
	"scale-95": ["transform", "scale(0.95)"],
	"scale-100": ["transform", "scale(1)"],
	"scale-105": ["transform", "scale(1.05)"],
	"scale-110": ["transform", "scale(1.1)"],
	"scale-125": ["transform", "scale(1.25)"],
	"scale-150": ["transform", "scale(1.5)"],
	"rotate-0": ["transform", "rotate(0deg)"],
	"rotate-45": ["transform", "rotate(45deg)"],
	"rotate-90": ["transform", "rotate(90deg)"],
	"rotate-180": ["transform", "rotate(180deg)"],
	"backface-hidden": ["backface-visibility", "hidden"],
	"backface-visible": ["backface-visibility", "visible"],
	"will-change-transform": ["will-change", "transform"],
	"will-change-scroll": ["will-change", "scroll"],
	"will-change-auto": ["will-change", "auto"],
	"sr-only": ["position", "absolute"],
	"not-sr-only": ["position", "static"],
	"bg-cover": ["background-size", "cover"],
	"bg-center": ["background-position", "center"],
	"bg-no-repeat": ["background-repeat", "no-repeat"],
	"bg-repeat": ["background-repeat", "repeat"],
	"bg-fixed": ["background-attachment", "fixed"],
	"bg-local": ["background-attachment", "local"],
	"bg-scroll": ["background-attachment", "scroll"],
};

const TW_PREFIX_RE = /^(sm|md|lg|xl|2xl|hover|focus|active|disabled|group-hover|peer-hover|motion-safe|motion-reduce|dark|light|first|last|odd|even|checked|indeterminate|selected|placeholder|file|before|after|in|out|open|read-only|read-write|required|valid|invalid|target|visited|link|any|not|has|is|empty|only|aria|focus-within|focus-visible|has-focus|group-focus|peer-focus|group-active|peer-active|group-disabled|peer-disabled|group-checked|peer-checked|group-selected|peer-selected|group-focus-within|peer-focus-within|group-focus-visible|peer-focus-visible|group-open|peer-open|group-read-only|peer-read-only|group-read-write|peer-read-write|group-required|peer-required|group-valid|peer-valid|group-invalid|peer-invalid|group-target|peer-target|group-visited|peer-visited|group-link|peer-link):/;

const TW_ARBITRARY_PREFIX = {
	z: "z-index",
	top: "top",
	left: "left",
	right: "right",
	bottom: "bottom",
	inset: "inset",
	w: "width",
	h: "height",
	"min-w": "min-width",
	"max-w": "max-width",
	"min-h": "min-height",
	"max-h": "max-height",
	p: "padding",
	px: "padding-inline",
	py: "padding-block",
	pt: "padding-top",
	pr: "padding-right",
	pb: "padding-bottom",
	pl: "padding-left",
	m: "margin",
	mx: "margin-inline",
	my: "margin-block",
	mt: "margin-top",
	mr: "margin-right",
	mb: "margin-bottom",
	ml: "margin-left",
	rounded: "border-radius",
	border: "border-width",
	text: "font-size", 
	bg: "background-color", 
};
const TW_LENGTH_RE = /^[0-9.]+(px|rem|em|vh|vw|vmin|vmax|ch|ex|%|pt|pc|in|cm|mm)$/;
const TW_COLOR_RE = /^(#|rgb|hsl|hwb|lab|lch|oklab|oklch|color\(|[a-z]+$)/;

const twArbitrary = (token) => {
	const m = token.match(/^([a-z]+(?:-[a-z0-9]+)*)-\[(.+)\]$/);
	if (!m) return null;
	const prop = TW_ARBITRARY_PREFIX[m[1]];
	if (!prop) return null;
	const value = m[2];
	if (m[1] === "text" && !TW_LENGTH_RE.test(value)) return null; 
	if (m[1] === "bg" && !TW_COLOR_RE.test(value)) return null; 
	return [prop, value];
}

const twToStyles = (cls) => {
	const styles = {};
	if (typeof cls !== "string") return styles;
	for (const rawToken of cls.split(/\s+/)) {
		if (!rawToken) continue;
		let token = rawToken;
		
		let guard = 0;
		while (TW_PREFIX_RE.test(token) && guard < 4) {
			token = token.replace(TW_PREFIX_RE, "");
			guard += 1;
		}
		
		let negative = false;
		if (token.startsWith("-")) {
			negative = true;
			token = token.slice(1);
		}
		
		const arb = twArbitrary(token);
		const hit = arb || TW[token];
		if (!hit) continue;
		const [prop, value] = hit;
		const v = value == null ? (negative ? "0" : "1") : negative ? `-${value}` : value;
		if (!Object.prototype.hasOwnProperty.call(styles, prop)) styles[prop] = [];
		if (!styles[prop].includes(v)) styles[prop].push(v);
	}
	return styles;
}

const camelToKebab = (name) => {
	return String(name).replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
}

const cssTextToStyles = (text) => {
	const styles = {};
	if (typeof text !== "string") return styles;
	
	const clean = text.replace(/\/\*[\s\S]*?\*\//g, "");
	for (const decl of clean.split(";")) {
		const idx = decl.indexOf(":");
		if (idx < 0) continue;
		const prop = decl.slice(0, idx).trim();
		const value = decl.slice(idx + 1).trim();
		if (!prop || !value) continue;
		if (prop.startsWith("@") || prop.startsWith("$") || value.includes("{")) continue;
		if (!/^[a-zA-Z-]+$/.test(prop)) continue;
		const p = prop.toLowerCase();
		if (!Object.prototype.hasOwnProperty.call(styles, p)) styles[p] = [];
		if (!styles[p].includes(value)) styles[p].push(value);
	}
	return styles;
}

const mergeStyles = (a, b) => {
	const out = {};
	for (const [prop, values] of entries(a)) {
		out[prop] = [...values];
	}
	for (const [prop, values] of entries(b)) {
		if (!Object.prototype.hasOwnProperty.call(out, prop)) {
			out[prop] = [...values];
			continue;
		}
		for (const v of values) {
			if (v === "1" && out[prop].length > 0) continue; 
			if (v === "1" && out[prop].every((x) => x === "1")) continue;
			if (!out[prop].includes(v)) out[prop].push(v);
		}
	}
	return out;
}

const stylesSimilarity = (a, b) => {
	const A = new Set(keys(a));
	const B = new Set(keys(b));
	if (A.size === 0 && B.size === 0) return 0;
	let inter = 0;
	for (const p of A) if (B.has(p)) inter += 1;
	const union = A.size + B.size - inter;
	return union === 0 ? 0 : inter / union;
}

const MIN_SHARED_STYLE_KEYS = 3;

const meaningfulA11yToken = (token) => {
	return !!token && !token.endsWith(":true");
}

const UBQUITOUS_A11Y_TOKENS = new Set([
	"type:button",
	"type:text",
	"type:submit",
	"type:reset",
	"type:email",
	"type:password",
	"type:search",
	"type:tel",
	"type:url",
	"type:number",
	"type:date",
	"type:time",
	"role:group",
	"role:presentation",
	"role:none",
	"role:list",
	"role:listitem",
	"role:status",
	"role:alert",
	"role:img",
]);

const specificA11yToken = (token) => {
	return meaningfulA11yToken(token) && !UBQUITOUS_A11Y_TOKENS.has(token);
}

const decide = (candidate, entry) => {
	const entryA11y = new Set(entry.a11y);
	const a11yOverlap = candidate.a11y.filter((a) => meaningfulA11yToken(a) && entryA11y.has(a));
	const actionOverlap = candidate.actions.filter((a) => entry.actions.includes(a));
	const sameTag = candidate.tag === entry.tag;
	const sim = stylesSimilarity(candidate.styles, entry.styles);
	
	const A = keys(candidate.styles);
	const B = new Set(keys(entry.styles));
	const shared = A.filter((p) => B.has(p)).length;

	
	
	if (a11yOverlap.length > 0) return { level: "error", reason: a11yOverlap[0] };

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	const entryIsButton = (entry.a11y || []).includes("type:button");
	const entryStyleCount = keys(entry.styles || {}).length;
	if (actionOverlap.length > 0 && entryIsButton && entryStyleCount >= MIN_SHARED_STYLE_KEYS) {
		return { level: "error", reason: actionOverlap[0] };
	}

	
	if (shared < MIN_SHARED_STYLE_KEYS) return null;
	if (sim >= 0.9) return { level: "error", reason: `styles ${sim.toFixed(2)}` };
	if (sameTag && sim >= 0.7) return { level: "error", reason: `styles ${sim.toFixed(2)}` };
	if (!sameTag && sim >= 0.5) return { level: "warning", reason: `styles ${sim.toFixed(2)}` };
	if (sameTag && sim >= 0.4) return { level: "warning", reason: `styles ${sim.toFixed(2)}` };
	return null;
}

const matchSignature = (candidate, catalog) => {
	const comps = (catalog && catalog.components) || [];
	let best = null;
	for (const entry of comps) {
		const d = decide(candidate, entry);
		if (!d) continue;
		const score = d.level === "error" ? 2 : 1;
		const sim = stylesSimilarity(candidate.styles, entry.styles);
		
		
		
		
		
		
		if (!best || score > best.score || (score === best.score && sim > best.sim)) {
			best = { name: entry.name, path: entry.path, level: d.level, reason: d.reason, sim, score };
		}
	}
	return best;
}

module.exports = { TW, twToStyles, camelToKebab, cssTextToStyles, mergeStyles, stylesSimilarity, decide, matchSignature, meaningfulA11yToken, specificA11yToken, MIN_SHARED_STYLE_KEYS };
