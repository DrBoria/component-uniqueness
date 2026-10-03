"use strict";

const { inCanonicalDir } = require("../config");

const isComponentBinding = (node) => {
	if (!node || node.type !== "Identifier") return false;
	if (!/^[A-Z]/.test(node.name)) return false;
	
	
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

const isExportedDeclarator = (node) => {
	let p = node.parent;
	while (p && p.type === "VariableDeclaration") p = p.parent;
	return p != null && p.type === "ExportNamedDeclaration";
}

const createHandler = (env) => {
	const { context, names, relPath } = env;

	
	const checkName = (name, node) => {
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
			
			
			if (decl.type === "FunctionDeclaration" || decl.type === "ClassDeclaration") {
				if (isComponentBinding(decl.id)) checkName(decl.id.name, decl.id);
			}
		},
		ExportDefaultDeclaration(node) {
			const decl = node.declaration;
			if (!decl) return;
			
			if ((decl.type === "FunctionDeclaration" || decl.type === "ClassDeclaration") && decl.id) {
				if (isComponentBinding(decl.id)) checkName(decl.id.name, decl.id);
			} else if (decl.type === "Identifier") {
				
				
				
				return;
			}
		},
	};
}

module.exports = { createHandler, isComponentBinding, isExportedDeclarator };
