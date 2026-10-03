"use strict";

const { ROLE_WHAT, RAW_BEHAVIOR_TAGS } = require("../config");
const { attrValueOf } = require("../dom");
const { forBehavior, forRaw } = require("../suggestions");

const behaviorForRaw = (tag, opening) => {
	const role = attrValueOf(opening, "role");
	if (typeof role === "string" && ROLE_WHAT[role]) return ROLE_WHAT[role];
	if (tag === "input") {
		const type = attrValueOf(opening, "type");
		if (type === "range") return "slider";
		if (type === "checkbox") return "checkbox (a hand-rolled control)";
		if (type === "radio") return "radio (a hand-rolled control)";
	}
	if (tag === "dialog") return "modal / dialog";
	if (tag === "select") return "select (a hand-rolled control)";
	if (tag === "button" && attrValueOf(opening, "onClick") != null) return "clickable element (a hand-rolled button)";
	return null;
}

const createHandler = (env) => {
	const { context, rawElements, inComponentsFolder, registry, catalogComponents, componentsFolder } = env;

	

	const handleRaw = (tag, opening) => {
		if (!rawElements.has(tag)) return false;
		let reported = false;
		
		
		if (!inComponentsFolder) {
			const sug = forRaw(tag, attrValueOf(opening, "type"), registry, catalogComponents, componentsFolder);
			context.report({
				node: opening,
				messageId: "rawHtml",
				data: { tag, component: sug.component, path: sug.path },
			});
			reported = true;
		}
		
		
		
		
		if (RAW_BEHAVIOR_TAGS.has(tag)) {
			const what = behaviorForRaw(tag, opening);
			if (what) {
				const sug = forBehavior(what, registry, catalogComponents, componentsFolder);
				context.report({
					node: opening,
					messageId: "layoutPrimitive",
					data: { tag, what, component: sug.component, path: sug.path },
				});
				reported = true;
			}
		}
		return reported;
	}

	return { handleRaw };
}

module.exports = { createHandler, behaviorForRaw };
