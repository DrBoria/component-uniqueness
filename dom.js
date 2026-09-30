"use strict";

/**
 * dom.js
 *
 * JSX element inspection: attribute lookup, className / style resolution,
 * and Signature construction for a JSX element (tag, normalized CSS styles,
 * actions, a11y markers, data-* attributes).
 *
 * Everything here works over an ESTree `JSXOpeningElement` node plus the
 * eslint-scope scope of the element (dynamic values are resolved via
 * resolve.js).
 */

const sig = require("./signature");
const { ACTION_ATTR_NAMES } = require("./config");
const { resolveStringCandidates } = require("./resolve");

/** Find a JSX attribute; returns the attribute node or null. */
function attrOf(opening, name) {
	return (opening.attributes || []).find((a) => a.type === "JSXAttribute" && a.name && a.name.name === name) || null;
}

/**
 * Static attribute value as a string (role, contentEditable, ...).
 * Returns null when the attribute is absent, `true` for a bare attribute,
 * the literal string for a Literal value, and "<expr>" for a dynamic one.
 */
function attrValueOf(opening, name) {
	const attr = attrOf(opening, name);
	if (!attr) return null;
	if (attr.value == null) return true; // bare attribute, e.g. contentEditable
	if (attr.value.type === "Literal") return String(attr.value.value ?? "");
	return "<expr>";
}

/**
 * Resolve a className attribute to candidate class strings (literal,
 * variable, ternary, cn(), imported constant).
 */
function classNameCandidates(opening, scope, fileDir) {
	const attr = attrOf(opening, "className");
	if (!attr || !attr.value) return [];
	if (attr.value.type === "Literal") return [String(attr.value.value ?? "")];
	if (attr.value.type === "JSXExpressionContainer") {
		const c = resolveStringCandidates(attr.value.expression, scope, 0, fileDir);
		return c || [];
	}
	return [];
}

/**
 * Resolve a style attribute to a map of property name -> candidate string
 * values (inline style object, variable, ternary, import).
 */
function stylePropsOf(opening, scope, fileDir) {
	const attr = attrOf(opening, "style");
	if (!attr || !attr.value || attr.value.type !== "JSXExpressionContainer") return {};
	const expr = attr.value.expression;
	const out = {};
	const collect = (e, depth) => {
		if (!e || depth > 3) return;
		if (e.type === "ObjectExpression") {
			for (const p of e.properties) {
				if (p.type !== "Property" || !p.key || !p.key.name) continue;
				const c = resolveStringCandidates(p.value, scope, depth + 1, fileDir);
				if (c) out[p.key.name] = (out[p.key.name] || []).concat(c);
			}
			return;
		}
		if (e.type === "Identifier") {
			for (let s = scope; s; s = s.upper) {
				const v = s.variables.find((x) => x.name === e.name);
				if (!v) continue;
				for (const def of v.defs || []) {
					if (def && def.node && def.node.type === "VariableDeclarator" && def.node.init) collect(def.node.init, depth + 1);
				}
			}
			return;
		}
		if (e.type === "ConditionalExpression") {
			collect(e.consequent, depth + 1);
			collect(e.alternate, depth + 1);
		}
	};
	collect(expr, 0);
	return out;
}

/**
 * Build the flat Signature of a JSX element: tag, normalized CSS styles
 * (tailwind className + inline style), actions (event handlers), a11y
 * markers, data-* attributes.
 */
function buildSignature(tag, opening, scope, fileDir) {
	const styles = {};
	for (const cls of classNameCandidates(opening, scope, fileDir)) {
		Object.assign(styles, sig.twToStyles(cls));
	}
	for (const [prop, values] of Object.entries(stylePropsOf(opening, scope, fileDir))) {
		const key = sig.camelToKebab(prop);
		styles[key] = (styles[key] || []).concat(values);
	}
	const actions = [];
	const a11y = [];
	const data = [];
	for (const attr of opening.attributes) {
		if (attr.type !== "JSXAttribute" || !attr.name) continue;
		const name = attr.name.name;
		// Normalize the event handler to its action name the SAME way the
		// catalog scanner does (scanner/extract.js: `aname.slice(2).toLowerCase()`),
		// so `onClick` -> "click" on BOTH sides. Without the slice the runtime
		// candidate carries "onclick" while the catalog stores "click", and the
		// decision matrix's action-overlap check never matches.
		if (ACTION_ATTR_NAMES.has(name)) actions.push(name.slice(2).toLowerCase());
		else if (name === "role") a11y.push("role:" + String(attrValueOf(opening, "role")));
		else if (name.startsWith("aria-")) a11y.push(name + ":" + String(attrValueOf(opening, name)));
		else if (name === "type" && (tag === "input" || tag === "button")) a11y.push("type:" + String(attrValueOf(opening, "type")));
		else if (name === "contentEditable") a11y.push("contentEditable");
		else if (name.startsWith("data-")) data.push(name + ":" + String(attrValueOf(opening, name)));
	}
	return { tag, styles, actions, a11y, data };
}

/**
 * Name of the nearest enclosing component declaration (the JSX element's
 * owning component: `const Foo = () => <...>` / `function Foo() { return <...> }`
 * / `export const Foo = ...`). Returns null for the file's top-level JSX.
 * Used by includeDynamic to map an element to the rendered-DOM signature of
 * the component it belongs to.
 *
 * @param {object} node any AST node inside the component
 * @param {object} sourceCode the ESLint SourceCode (provides ancestors)
 * @returns {string|null} the component name
 */
function enclosingComponentName(node, sourceCode) {
	const ancestors = sourceCode.getAncestors ? sourceCode.getAncestors(node) : [];
	for (let i = ancestors.length - 1; i >= 0; i -= 1) {
		const a = ancestors[i];
		if (!a || !a.type) continue;
		if (a.type === "VariableDeclarator" && a.id && a.id.name) {
			const init = a.init;
			if (init && (init.type === "ArrowFunctionExpression" || init.type === "FunctionExpression")) return a.id.name;
		}
		if (a.type === "FunctionDeclaration" && a.id && a.id.name) return a.id.name;
		if (a.type === "ClassDeclaration" && a.id && a.id.name) return a.id.name;
	}
	return null;
}

module.exports = {
	attrOf,
	attrValueOf,
	classNameCandidates,
	stylePropsOf,
	buildSignature,
	enclosingComponentName,
};
