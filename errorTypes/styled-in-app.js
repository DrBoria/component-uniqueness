"use strict";

/**
 * errorTypes/styled-in-app.js
 *
 * Error type 4 — STYLED IN APP (messageId: styledInApp).
 *
 * styled.div / styled.button / ... created outside the component folders is
 * UI built in the app — reported, whatever the tag. Inside the component
 * folders styled.* is the building material the canonical components are
 * made of and is legal.
 */

/**
 * Create the error type-4 visitors.
 *
 * @param {object} env { context, inComponentsFolder }
 * @returns {object} visitors: VariableDeclarator
 */
const sig = require("../signature");

function createHandler(env) {
	const { context, inComponentsFolder, catalogComponents, componentsFolder } = env;

	/** Fallback path: the first canonical folder, or the generic phrase. */
	const defaultPath = componentsFolder && componentsFolder.length ? componentsFolder[0] : "the canonical component packages";

	/**
	 * Collect the CSS text of a styled template (no-substitution literal, or a
	 * template expression with interpolations — only the literal parts).
	 */
	function cssTextOf(tpl) {
		if (!tpl) return "";
		if (tpl.type === "NoSubstitutionTemplate") return tpl.value.cooked || tpl.value.raw || "";
		if (tpl.type === "TemplateLiteral") {
			return (tpl.quasis || []).map((q) => q.value.cooked || q.value.raw || "").join("");
		}
		return "";
	}

	/**
	 * Error type 4: styled.<htmlTag> created outside the component folders is
	 * UI built in the app — reported, whatever the tag. The suggestion is the
	 * catalog component whose signature matches the styled template, if any.
	 */
	function checkStyledInApp(node) {
		if (inComponentsFolder) return;
		const init = node.init;
		if (!init || init.type !== "TaggedTemplateExpression") return;
		const tagExpr = init.tag;
		// styled.div`...` (MemberExpression) and styled(MuiButton)`...`
		// (CallExpression with an identifier argument — a wrapper built on a
		// LIBRARY component, e.g. MUI/antd). Both are app-built UI outside the
		// component folders.
		let tag = null;
		if (tagExpr.type === "MemberExpression" && tagExpr.property && tagExpr.property.name) {
			tag = tagExpr.property.name;
		} else if (tagExpr.type === "CallExpression" && tagExpr.arguments.length) {
			const arg0 = tagExpr.arguments[0];
			if (arg0.type === "Identifier") tag = arg0.name;
			else if (arg0.type === "Literal" && typeof arg0.value === "string") tag = arg0.value;
		}
		if (!tag) return;

		let component = "CanonicalComponent";
		let path = defaultPath;
		const cssText = cssTextOf(init.template);
		const styles = sig.cssTextToStyles(cssText);
		if (Object.keys(styles).length && catalogComponents.length) {
			const hit = sig.matchSignature(
				{ tag, styles, actions: [], a11y: [], data: [] },
				{ components: catalogComponents },
			);
			if (hit) {
				component = hit.name;
				path = hit.path;
			}
		}
		context.report({
			node: node.id,
			messageId: "styledInApp",
			data: { tag, component, path },
		});
	}

	return {
		VariableDeclarator(node) {
			checkStyledInApp(node);
		},
	};
}

module.exports = { createHandler };
