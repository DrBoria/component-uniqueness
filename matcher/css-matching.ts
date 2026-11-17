"use strict";

// ── CSS MATCHING · which styles matter for which element ───────────────────
//
// Two buttons are both buttons — but is one blue and the other red? Does one
// have `cursor: pointer` and the other not? Styles are compared per ELEMENT
// ROLE: what matters for a text element is not what matters for a container.
//
//   text      (button, span, b, strong, i, em, label, a, headings, icon…)
//             → typography (font, size, weight, style), color, cursor,
//               text-decoration, text-transform, letter-spacing
//   container (div, span-as-box, main, section, header, footer, nav, aside,
//              fieldset, form, ul, li…)
//             → layout: display, flex/grid, gap, width/height, margin, padding,
//               overflow, box-sizing
//   positioned (ANY element with position: relative / absolute / fixed / sticky)
//             → the container set PLUS the offsets: top, right, bottom, left,
//               z-index, inset
//   surface   (anything carrying a background / border / shadow / texture)
//             → background, border, radius, shadow, opacity, outline
//
// A property is compared only when it is RELEVANT to the element's role; an
// irrelevant difference (a container's font-size) is not evidence either way.
// Values are normalized before comparison (case, whitespace, `0px` ≡ `0`).

const TEXT_TAGS = new Set([
	"button", "a", "span", "b", "strong", "i", "em", "u", "s", "small", "sub", "sup",
	"label", "h1", "h2", "h3", "h4", "h5", "h6", "p", "code", "pre", "kbd", "samp",
	"var", "cite", "q", "abbr", "mark", "time", "legend", "summary", "figcaption",
	"input", "textarea", "select", "option",
]);

const CONTAINER_TAGS = new Set([
	"div", "main", "section", "header", "footer", "nav", "aside", "article",
	"fieldset", "form", "ul", "ol", "li", "dl", "dt", "dd", "table", "thead",
	"tbody", "tfoot", "tr", "td", "th", "figure", "dialog", "details", "menu",
	"address", "hgroup", "search", "picture", "span",
]);

// Typography: how the text LOOKS.
const TYPOGRAPHY = [
	"font", "font-family", "font-size", "font-weight", "font-style", "font-variant",
	"line-height", "letter-spacing", "word-spacing", "text-align", "text-decoration",
	"text-decoration-line", "text-decoration-color", "text-decoration-style",
	"text-transform", "text-indent", "text-shadow", "white-space", "writing-mode",
];

// Color & texture: how the surface LOOKS.
const COLOR = ["color", "caret-color", "accent-color"];
const SURFACE = [
	"background", "background-color", "background-image", "background-size",
	"background-position", "background-repeat", "background-blend-mode",
	"border", "border-width", "border-style", "border-color",
	"border-top", "border-right", "border-bottom", "border-left",
	"border-top-width", "border-top-style", "border-top-color",
	"border-right-width", "border-right-style", "border-right-color",
	"border-bottom-width", "border-bottom-style", "border-bottom-color",
	"border-left-width", "border-left-style", "border-left-color",
	"border-radius", "border-top-left-radius", "border-top-right-radius",
	"border-bottom-left-radius", "border-bottom-right-radius",
	"box-shadow", "outline", "outline-width", "outline-style", "outline-color",
	"opacity", "filter", "backdrop-filter", "mix-blend-mode",
];

// Layout: where the box SITSS and how big it is.
const LAYOUT = [
	"display", "flex", "flex-direction", "flex-wrap", "flex-grow", "flex-shrink",
	"flex-basis", "flex-flow", "align-items", "align-self", "align-content",
	"justify-content", "justify-items", "justify-self", "gap", "row-gap", "column-gap",
	"grid", "grid-template", "grid-template-columns", "grid-template-rows",
	"grid-template-areas", "grid-auto-columns", "grid-auto-rows", "grid-auto-flow",
	"grid-column", "grid-row", "grid-area", "grid-gap",
	"width", "min-width", "max-width", "height", "min-height", "max-height",
	"aspect-ratio", "box-sizing", "overflow", "overflow-x", "overflow-y",
	"margin", "margin-top", "margin-right", "margin-bottom", "margin-left",
	"margin-inline", "margin-block", "padding", "padding-top", "padding-right",
	"padding-bottom", "padding-left", "padding-inline", "padding-block",
	"float", "clear", "order", "visibility", "object-fit", "object-position",
	"transform", "translate", "scale", "rotate",
];

// Offsets: only meaningful once the element is POSITIONED.
const OFFSETS = [
	"position", "top", "right", "bottom", "left", "z-index",
	"inset", "inset-block", "inset-inline",
];

// Interaction affordances: a button without cursor:pointer is a different button.
const INTERACTION = ["cursor", "pointer-events", "user-select", "touch-action"];

const POSITIONED_VALUES = new Set(["relative", "absolute", "fixed", "sticky"]);

// The role of an element decides which property groups are compared.
const roleOf = (tag, css) => {
	const t = String(tag || "").toLowerCase();
	const position = String((css || {}).position || "").toLowerCase();
	const positioned = POSITIONED_VALUES.has(position);
	const isText = TEXT_TAGS.has(t);
	const isContainer = CONTAINER_TAGS.has(t) && !isText;
	const hasSurface = SURFACE.some((prop) => (css || {})[prop] !== undefined);

	return { isText, isContainer, positioned, hasSurface };
};

// The properties that MATTER for one element: the union of the groups its role
// activates. `position` itself is always relevant (it changes the role).
const relevantProps = (tag, css) => {
	const role = roleOf(tag, css);
	const props = new Set(["position"]);
	if (role.isText) {
		for (const p of TYPOGRAPHY) props.add(p);
		for (const p of COLOR) props.add(p);
		for (const p of INTERACTION) props.add(p);
	}
	if (role.isContainer || role.positioned) {
		for (const p of LAYOUT) props.add(p);
	}
	if (role.positioned) {
		for (const p of OFFSETS) props.add(p);
	}
	if (role.hasSurface || role.isText) {
		for (const p of SURFACE) props.add(p);
	}
	// A positioned text element still sits somewhere: give it the layout set too.
	if (role.positioned && role.isText) {
		for (const p of LAYOUT) props.add(p);
	}

	return props;
};

// Normalize a value so `0px` ≡ `0`, `RED` ≡ `red`, `1px  solid` ≡ `1px solid`.
const normalizeValue = (value) =>
	String(value ?? "")
		.toLowerCase()
		.replace(/\s+/g, " ")
		.replace(/\b0(px|em|rem|%|vh|vw)\b/g, "0")
		.trim();

// Compare the styles of two matched nodes. Only RELEVANT properties count; a
// property present on one side only is a difference (one button has a shadow,
// the other does not). Returns the per-property verdicts and an agreement score.
const compareCss = (tagA, cssA, tagB, cssB) => {
	const a = cssA || {};
	const b = cssB || {};
	const relevant = new Set([...relevantProps(tagA, a), ...relevantProps(tagB, b)]);
	const props = [...relevant].filter((p) => a[p] !== undefined || b[p] !== undefined).sort();
	const rows = [];
	let same = 0;
	for (const prop of props) {
		const va = a[prop] === undefined ? null : normalizeValue(a[prop]);
		const vb = b[prop] === undefined ? null : normalizeValue(b[prop]);
		const equal = va !== null && vb !== null && va === vb;
		if (equal) same += 1;
		rows.push({ prop, left: va, right: vb, same: equal });
	}

	return { rows, same, total: props.length, score: props.length === 0 ? 1 : same / props.length };
};

export { roleOf, relevantProps, compareCss, normalizeValue, TEXT_TAGS, CONTAINER_TAGS, POSITIONED_VALUES };