"use strict";

/**
 * errorTypes/raw-html.js
 *
 * Error type 2 — RAW HTML (messageId: rawHtml).
 *
 * Raw interactive / form elements (button, label, select, textarea, input,
 * form, table, dialog) are only legal inside the canonical packages
 * (@md/components / @md/sections) — that is where the canonical components
 * are built from them. Outside those packages every raw element is a
 * report: use the canonical component instead.
 *
 * Error type 3 also applies to raw elements: a raw input type=range / select /
 * dialog is a hand-rolled slider / select / modal, and that behavior check
 * runs EVERYWHERE — including inside the component folders. The rawHtml
 * report (error type 2) stays silent there, because the raw element is the
 * building material the canonical component is made of.
 */

const { ROLE_WHAT, RAW_BEHAVIOR_TAGS } = require("../config");
const { attrValueOf } = require("../dom");
const { forBehavior, forRaw } = require("../suggestions");

/**
 * Behavior of a raw element (input type=range, select, dialog,
 * button with onClick, role=...). Returns a "what" string or null.
 */
function behaviorForRaw(tag, opening) {
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

/**
 * Create the error type-2 handler.
 *
 * @param {object} env { context, rawElements, inComponentsFolder }
 * @returns {function} handleRaw(tag, opening) -> boolean (was a finding reported?)
 */
function createHandler(env) {
	const { context, rawElements, inComponentsFolder, registry, catalogComponents, componentsFolder } = env;

	/**
	 * Handle a raw element (button, input, select, ...).
	 * Returns true when a finding was reported.
	 *
	 * @param {string} tag
	 * @param {object} opening the JSXOpeningElement node
	 * @returns {boolean}
	 */
	function handleRaw(tag, opening) {
		if (!rawElements.has(tag)) return false;
		let reported = false;
		// Error type 2: raw HTML is only legal inside the component folders
		// (it is the building material the canonical components are made of).
		if (!inComponentsFolder) {
			const sug = forRaw(tag, attrValueOf(opening, "type"), registry, catalogComponents, componentsFolder);
			context.report({
				node: opening,
				messageId: "rawHtml",
				data: { tag, component: sug.component, path: sug.path },
			});
			reported = true;
		}
		// Error type 3 also applies to raw elements: a raw input type=range /
		// select / dialog is a hand-rolled slider / select / modal. Runs
		// EVERYWHERE — a hand-rolled slider in packages/components is still a
		// duplicate of Slider.
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
