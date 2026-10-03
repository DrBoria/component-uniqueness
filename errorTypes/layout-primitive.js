"use strict";

const { entries, keys } = require("remeda");

const sig = require("../signature");
const {
	SPINNER_CLASS_RE,
	MODAL_CLASS_RE,
	CARD_CLASS_RE,
	CARD_SECOND_RE,
	CONTAINER_CLASS_RE,
	ROLE_WHAT,
} = require("../config");
const { attrOf, attrValueOf, classNameCandidates, stylePropsOf, buildSignature } = require("../dom");
const { forBehavior } = require("../suggestions");

const LIBRARY_STYLE_PROPS = new Set(["sx", "css", "styleObject", "stl"]);
const hasLibraryStyleProp = (opening) => {
	return (opening.attributes || []).some(
		(a) => a.type === "JSXAttribute" && a.name && LIBRARY_STYLE_PROPS.has(a.name.name)
	);
}

const behaviorOf = (tag, opening, scope, fileDir) => {
	const role = attrValueOf(opening, "role");
	if (typeof role === "string" && ROLE_WHAT[role]) return ROLE_WHAT[role];
	if (attrValueOf(opening, "aria-modal") === "true") return "modal / dialog";
	const hasPopup = attrValueOf(opening, "aria-haspopup");
	if (typeof hasPopup === "string" && hasPopup !== "false") return "dropdown / menu trigger";
	if (attrValueOf(opening, "contentEditable") != null) return "contentEditable element (a hand-rolled control)";
	if (attrValueOf(opening, "onClick") != null) return "clickable element (a hand-rolled button)";
	if (attrOf(opening, "aria-expanded")) return "accordion / collapsible";

	const cls = classNameCandidates(opening, scope, fileDir).join(" ");
	
	
	
	
	const style = {};
	for (const c of classNameCandidates(opening, scope, fileDir)) {
		Object.assign(style, sig.twToStyles(c));
	}
	for (const [prop, values] of entries(stylePropsOf(opening, scope, fileDir))) {
		const key = sig.camelToKebab(prop);
		style[key] = (style[key] || []).concat(values);
	}
	const styleHas = (prop) => Object.prototype.hasOwnProperty.call(style, prop);
	const styleAny = (prop, re) => (style[prop] || []).some((v) => re.test(String(v)));

	if (SPINNER_CLASS_RE.test(cls) || styleAny("animation", /spin|rotate/i)) return "spinner / skeleton";
	if (MODAL_CLASS_RE.test(cls)) return "modal / dialog";
	if (
		styleHas("position") &&
		(style.position || []).some((v) => /fixed/.test(String(v))) &&
		(style["z-index"] || []).some((v) => Number(String(v).replace(/[^0-9-]/g, "")) >= 1000)
	) {
		return "modal / dialog";
	}
	if (CARD_CLASS_RE.test(cls) && (CARD_SECOND_RE.test(cls) || cls.split(/\s+/).filter(Boolean).length >= 3)) {
		return "card / paper";
	}
	
	if (styleHas("border-radius") && (styleHas("box-shadow") || styleHas("border"))) return "card / paper";
	
	
	
	
	
	
	return null;
}

const createHandler = (env) => {
	const { context, behaviorTags, catalogComponents, relPath, fileDir, registry, inComponentsFolder, componentsFolder } = env;

	

	const matchCatalog = (tag, opening, scope, dynEntry) => {
		if (!catalogComponents.length) return null;
		const candidate = buildSignature(tag, opening, scope, fileDir);
		if (dynEntry) {
			if (dynEntry.tag) candidate.tag = dynEntry.tag;
			
			
			
			
			
			
			
			
			const hasOwnSignal =
				keys(candidate.styles).length > 0 ||
				candidate.actions.length > 0 ||
				candidate.a11y.length > 0 ||
				hasLibraryStyleProp(opening);
			if (hasOwnSignal && dynEntry.styles && keys(dynEntry.styles).length && keys(candidate.styles).length < sig.MIN_SHARED_STYLE_KEYS) {
				candidate.styles = sig.mergeStyles(candidate.styles, dynEntry.styles);
			}
			
			
			
			
			
			
		}
		
		
		
		
		
		
		
		
		
		
		
		
		const pool = catalogComponents.filter((c) => c.path !== relPath && !(inComponentsFolder && c.__dyn));
		const res = sig.matchSignature(candidate, { components: pool });
		return res;
	}

	

	const handleElement = (tag, opening, scope) => {
		if (!behaviorTags.has(tag)) return false;
		
		
		
		const what = behaviorOf(tag, opening, scope, fileDir);
		if (what) {
				const sug = forBehavior(what, registry, catalogComponents, componentsFolder);
			context.report({
				node: opening,
				messageId: "layoutPrimitive",
				data: { tag, what, component: sug.component, path: sug.path },
			});
			return true;
		}
		return false;
	}

	return { matchCatalog, handleElement };
}

module.exports = { createHandler, behaviorOf };
