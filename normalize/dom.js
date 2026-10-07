"use strict";

const { render } = require("../playgrounds/framework-entrypoint.js");
const { isLayoutProp } = require("./style.js");

const HTML_TAGS = new Set([
	"html",
	"head",
	"body",
	"div",
	"span",
	"a",
	"p",
	"main",
	"section",
	"header",
	"footer",
	"nav",
	"aside",
	"article",
	"ul",
	"ol",
	"li",
	"table",
	"thead",
	"tbody",
	"tr",
	"td",
	"th",
	"form",
	"label",
	"input",
	"button",
	"select",
	"textarea",
	"img",
	"figure",
	"figcaption",
	"svg",
	"path",
	"circle",
	"rect",
	"g",
	"pre",
	"code",
	"strong",
	"em",
	"small",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"hr",
	"br",
	"i",
	"b",
	"u",
	"s",
	"sub",
	"sup",
	"blockquote",
	"details",
	"summary",
	"dialog",
	"canvas",
	"video",
	"audio",
	"source",
	"track",
	"map",
	"area",
	"dl",
	"dt",
	"dd",
	"fieldset",
	"legend",
	"data",
	"output",
	"progress",
	"meter",
	"time",
	"mark",
	"abbr",
	"ruby",
	"rt",
	"rp",
	"wbr",
	"bdi",
	"bdo",
	"template",
	"slot",
	"picture",
	"base",
	"link",
	"meta",
	"style",
	"title",
	"script",
	"noscript",
	"address",
	"hgroup",
	"search",
	"menu",
	"kbd",
	"samp",
	"var",
	"dfn",
	"cite",
	"q",
	"del",
	"ins",
	"caption",
	"col",
	"colgroup",
	"tfoot",
	"optgroup",
	"option",
	"datalist",
	"iframe",
	"embed",
	"object",
	"math",
]);

const INTERACTIVE_TAGS = new Set(["a", "area", "audio", "button", "details", "embed", "iframe", "input", "label", "optgroup", "option", "select", "summary", "textarea", "video"]);
const NON_SEMANTIC_TAGS = new Set(["div", "span"]);

const isPascalCase = (name) => /^[A-Z][A-Za-z0-9]*$/.test(name);

const isHtmlTag = (tag) => HTML_TAGS.has(String(tag || ""));

const styleObjectToCssText = (obj) => {
	const parts = [];
	for (const [k, v] of Object.entries(obj || {})) {
		if (Array.isArray(v)) parts.push(`${k}: ${v.join("; ")}`);
		else parts.push(`${k}: ${v}`);
	}
	return parts.join("; ");
};


const layoutOnly = (node) => ({
	tag: node.tag,
	text: node.text || undefined,
	interactive: !!node.interactive,
	css: Object.fromEntries(Object.entries(node.css || {}).filter(([prop]) => isLayoutProp(prop))),
	children: (node.children || []).map(layoutOnly),
});

const normalizeDom = (tree, opts, label) => {
	const rendered = render(tree, opts);
	const domTree = rendered.available && rendered.tree ? layoutOnly(rendered.tree) : null;

	return { tree: domTree, available: rendered.available };
};

module.exports = {
	HTML_TAGS,
	INTERACTIVE_TAGS,
	NON_SEMANTIC_TAGS,
	isPascalCase,
	isHtmlTag,
	styleObjectToCssText,
	normalizeDom,
};
