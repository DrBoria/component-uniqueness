"use strict";

const { keys } = require("remeda");

const sig = require("../signature");

const createHandler = (env) => {
	const { context, inComponentsFolder, catalogComponents, componentsFolder } = env;

	
	const defaultPath = componentsFolder && componentsFolder.length ? componentsFolder[0] : "the canonical component packages";

	

	const cssTextOf = (tpl) => {
		if (!tpl) return "";
		if (tpl.type === "NoSubstitutionTemplate") return tpl.value.cooked || tpl.value.raw || "";
		if (tpl.type === "TemplateLiteral") {
			return (tpl.quasis || []).map((q) => q.value.cooked || q.value.raw || "").join("");
		}
		return "";
	}

	

	const checkStyledInApp = (node) => {
		if (inComponentsFolder) return;
		const init = node.init;
		if (!init || init.type !== "TaggedTemplateExpression") return;
		const tagExpr = init.tag;
		
		
		
		
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
		if (keys(styles).length && catalogComponents.length) {
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
