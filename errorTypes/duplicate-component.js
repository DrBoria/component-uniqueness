"use strict";

/**
 * errorTypes/duplicate-component.js
 *
 * Error type 1 — DUPLICATE DECLARATION (messageId: duplicateComponent).
 *
 * The component registry (reports/component-registry.json) maps every
 * canonical component name to the list of directories where that name is
 * allowed to be declared. Declaring a registry name outside its canonical
 * directories — const Button = ..., function Form() {...}, class Card,
 * export default function Badge — is a duplicate.
 *
 * Only EXPORTED component bindings count: a private styled sub-part
 * (const Title = styled.h3 inside Card) that happens to share a name with a
 * canonical component is an internal detail, not a duplicate — private
 * bindings cannot be imported elsewhere.
 */

const { inCanonicalDir } = require("../config");

/** Is this identifier a component binding (not a type)? */
function isComponentBinding(node) {
	if (!node || node.type !== "Identifier") return false;
	if (!/^[A-Z]/.test(node.name)) return false;
	// Skip type-only declarations: export type Foo / interface Foo are
	// not components.
	let parent = node.parent;
	while (parent) {
		if (parent.type === "TSInterfaceDeclaration") return false;
		if (parent.type === "TSTypeAliasDeclaration") return false;
		if (parent.type === "TSModuleDeclaration") return false;
		if (parent.type === "ExportNamedDeclaration" || parent.type === "ExportDefaultDeclaration") break;
		parent = parent.parent;
	}
	return true;
}

/**
 * Is this VariableDeclarator part of an exported declaration?
 *
 * Only exported components are "the component" — a private styled sub-part
 * (const Title = styled.h3 inside Card, const Overlay inside HamburgerMenu)
 * that happens to share a name with a canonical component is an internal
 * detail, not a duplicate. Private bindings cannot be imported elsewhere,
 * so they are never the thing the user is trying to prevent.
 */
function isExportedDeclarator(node) {
	let p = node.parent;
	while (p && p.type === "VariableDeclaration") p = p.parent;
	return p != null && p.type === "ExportNamedDeclaration";
}

/**
 * Create the error type-1 visitors.
 *
 * @param {object} env { context, names, relPath }
 * @returns {object} visitors: VariableDeclarator, ExportNamedDeclaration,
 *   ExportDefaultDeclaration
 */
function createHandler(env) {
	const { context, names, relPath } = env;

	/** Report a duplicate declaration of a registry name. */
	function checkName(name, node) {
		const dirs = names[name];
		if (!dirs || dirs.length === 0) return;
		if (inCanonicalDir(relPath, dirs)) return;
		context.report({
			node,
			messageId: "duplicateComponent",
			data: { name, dirs: dirs.join(" or ") },
		});
	}

	return {
		VariableDeclarator(node) {
			if (isComponentBinding(node.id) && isExportedDeclarator(node)) checkName(node.id.name, node.id);
		},
		ExportNamedDeclaration(node) {
			const decl = node.declaration;
			if (!decl) return;
			// VariableDeclaration is handled by the VariableDeclarator
			// visitor (avoids double-reporting).
			if (decl.type === "FunctionDeclaration" || decl.type === "ClassDeclaration") {
				if (isComponentBinding(decl.id)) checkName(decl.id.name, decl.id);
			}
		},
		ExportDefaultDeclaration(node) {
			const decl = node.declaration;
			if (!decl) return;
			// export default function Foo / class Foo
			if ((decl.type === "FunctionDeclaration" || decl.type === "ClassDeclaration") && decl.id) {
				if (isComponentBinding(decl.id)) checkName(decl.id.name, decl.id);
			} else if (decl.type === "Identifier") {
				// export default SomeBinding — the binding must be declared
				// in this file; its name is the folder name only, so we
				// cannot attribute a registry name to it reliably. Skip.
				return;
			}
		},
	};
}

module.exports = { createHandler, isComponentBinding, isExportedDeclarator };
