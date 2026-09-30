"use strict";

/**
 * errorTypes/layout-primitive.js
 *
 * Error type 3 — HAND-ROLLED COMPONENTS BY BEHAVIOR (messageId: layoutPrimitive)
 * and Error type 3b — CATALOG MATCH (messageId: catalogDuplicate,
 * similarComponent).
 *
 * A plain div is building material and is NOT flagged on its own. But an
 * element that BEHAVES like a canonical component — a div with
 * flex/grid/col/row/justify/gap classes (a hand-rolled container), a span
 * with onClick (a hand-rolled button), role=dialog / aria-modal (a
 * hand-rolled modal), role=menu (a hand-rolled dropdown), input type=range
 * (a hand-rolled slider), role=tooltip (a hand-rolled tooltip), a box with
 * rounded corners + shadow (a hand-rolled Card / Paper), a spinner, tabs,
 * accordion, progress, alert, avatar, badge — is a duplicate of a canonical
 * component and is reported EVERYWHERE, including inside the component
 * folders. That is what makes the rule total: a container hand-rolled in
 * packages/components is still a duplicate of Container.
 *
 * The taxonomy mirrors the component categories of shadcn / MUI / antd.
 * Values are resolved dynamically: className from a local variable,
 * ternaries, cn()/clsx() calls, template literals, and identifiers imported
 * from a sibling file (the imported file is read from disk and the exported
 * constant's string literals are collected).
 *
 * Error type 3b matches the element's Signature against the component catalog
 * (reports/component-catalog.json) using the decision matrix
 * (signature.js). An error-tier verdict supersedes the other error types; a
 * warning-tier verdict is a report-only hint (never fails the gate).
 */

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

/**
 * Library style props that signal "this wrapper applies its OWN styling to a
 * library primitive" — the static equivalent of a style={} object. MUI `sx`,
 * antd `style`/`css`, styled-components `className` overrides, etc. A bare
 * <MuiButton> has none of these (plain import); <MuiPaper sx={{...}}> does
 * (a hand-rolled card). buildSignature() does not read these, so includeDynamic
 * needs an explicit check to tell the two apart.
 */
const LIBRARY_STYLE_PROPS = new Set(["sx", "css", "styleObject", "stl"]);
function hasLibraryStyleProp(opening) {
	return (opening.attributes || []).some(
		(a) => a.type === "JSXAttribute" && a.name && LIBRARY_STYLE_PROPS.has(a.name.name)
	);
}

/**
 * Error type 3: an element that behaves like a canonical component.
 * Returns a human "what" string, or null if the element is an ordinary
 * building block.
 */
function behaviorOf(tag, opening, scope, fileDir) {
	const role = attrValueOf(opening, "role");
	if (typeof role === "string" && ROLE_WHAT[role]) return ROLE_WHAT[role];
	if (attrValueOf(opening, "aria-modal") === "true") return "modal / dialog";
	const hasPopup = attrValueOf(opening, "aria-haspopup");
	if (typeof hasPopup === "string" && hasPopup !== "false") return "dropdown / menu trigger";
	if (attrValueOf(opening, "contentEditable") != null) return "contentEditable element (a hand-rolled control)";
	if (attrValueOf(opening, "onClick") != null) return "clickable element (a hand-rolled button)";
	if (attrOf(opening, "aria-expanded")) return "accordion / collapsible";

	const cls = classNameCandidates(opening, scope, fileDir).join(" ");
	// Merged styles: tailwind className (incl. arbitrary values like z-[1000])
	// + inline style={}. The modal check below runs on this merged map, so a
	// "fixed inset-0 z-[1000]" Tailwind overlay is a modal, not only an inline
	// style={{position:"fixed",zIndex:9999}} one.
	const style = {};
	for (const c of classNameCandidates(opening, scope, fileDir)) {
		Object.assign(style, sig.twToStyles(c));
	}
	for (const [prop, values] of Object.entries(stylePropsOf(opening, scope, fileDir))) {
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
	// Kebab-case keys: the merged map normalizes inline camelCase to kebab.
	if (styleHas("border-radius") && (styleHas("box-shadow") || styleHas("border"))) return "card / paper";
	// NOTE: there is deliberately NO "layout container" branch. A div with
	// display:flex/grid is the normal way to build a layout — it is not a
	// duplicate of any canonical component, and the canonical Container is a
	// CSS-GRID component, so suggesting it for a flexbox div is actively
	// wrong. Only strong behavior signals (button/modal/card/spinner/...) are
	// reported here.
	return null;
}

/**
 * Create the error type-3 handler.
 *
 * @param {object} env { context, behaviorTags, catalogComponents, relPath, fileDir }
 * @returns {object} { matchCatalog, handleElement }
 */
function createHandler(env) {
	const { context, behaviorTags, catalogComponents, relPath, fileDir, registry, inComponentsFolder, componentsFolder } = env;

	/**
	 * Error type 3b: match the element signature against the component catalog
	 * (decision matrix). Returns {name, path, level, reason, sim} or null.
	 * Skips the entry whose own file is the current file.
	 *
	 * @param {string} tag the (possibly resolved) element tag
	 * @param {object} opening the JSXOpeningElement node
	 * @param {object} scope the eslint-scope scope
	 * @param {object|null} dynEntry optional rendered-DOM signature (includeDynamic):
	 *   when present, the candidate is re-tagged to the rendered DOM tag and
	 *   enriched with the styles/actions/a11y that the library applies at
	 *   runtime (MUI emotion/sx, antd cssinjs) — invisible to static analysis.
	 */
	function matchCatalog(tag, opening, scope, dynEntry) {
		if (!catalogComponents.length) return null;
		const candidate = buildSignature(tag, opening, scope, fileDir);
		if (dynEntry) {
			if (dynEntry.tag) candidate.tag = dynEntry.tag;
			// A plain library use (<MuiButton> with no style/onClick/a11y of its
			// own) is an IMPORT, not a duplicate: the rendered DOM is the
			// library's, so we must not merge its rendered styles into the
			// candidate — that would let a bare <MuiButton> "look like" a
			// hand-rolled Card/Container and produce a false similarComponent.
			// Only a WRAPPER that carries its own static signal (its own styles
			// or an onClick / a11y marker) is a candidate for a duplicate, and
			// for it we merge the rendered styles the library applies.
			const hasOwnSignal =
				Object.keys(candidate.styles).length > 0 ||
				candidate.actions.length > 0 ||
				candidate.a11y.length > 0 ||
				hasLibraryStyleProp(opening);
			if (hasOwnSignal && dynEntry.styles && Object.keys(dynEntry.styles).length && Object.keys(candidate.styles).length < sig.MIN_SHARED_STYLE_KEYS) {
				candidate.styles = sig.mergeStyles(candidate.styles, dynEntry.styles);
			}
			// NOTE: actions/a11y are deliberately NOT merged from the dynamic
			// entry. Behavior (onClick, type, role) is a per-USE static signal:
			// a plain <MuiButton> without onClick must stay a plain import, not
			// become a "duplicate" just because MUI renders <button type=button>.
			// The dynamic catalog contributes only what static analysis cannot
			// see: the real DOM tag + runtime styles.
		}
		// Exclude the current file's OWN catalog entries from the pool BEFORE
		// best-selection. includeDynamic adds the file's own rendered wrappers
		// (e.g. <MuiButton> in _keystone.tsx) to the catalog; a candidate that
		// merges its own rendered styles would match its own entry at sim 1.0,
		// and a post-hoc "own file" drop would then discard the real match
		// against the canonical component. Filtering first lets the canonical
		// entry win the best-selection.
		// When the CURRENT file is a canonical component (inside the component
		// folders), also drop the dynamic app-wrapper entries: a canonical
		// component is the source of truth and must not be reported as a
		// "duplicate" of a hand-rolled app wrapper (e.g. forms Button must not
		// match an app's <MuiButton> plain import).
		const pool = catalogComponents.filter((c) => c.path !== relPath && !(inComponentsFolder && c.__dyn));
		const res = sig.matchSignature(candidate, { components: pool });
		return res;
	}

	/**
	 * Handle a non-raw element (div, span, ul, a, ...).
	 * Returns true when a finding was reported.
	 *
	 * @param {string} tag
	 * @param {object} opening the JSXOpeningElement node
	 * @param {object} scope the eslint-scope scope of the element
	 * @returns {boolean}
	 */
	function handleElement(tag, opening, scope) {
		if (!behaviorTags.has(tag)) return false;
		// Error type 3: behavior — reported EVERYWHERE, including inside the
		// component folders. A container hand-rolled in packages/components is
		// still a duplicate of Container: that is what makes the rule total.
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
