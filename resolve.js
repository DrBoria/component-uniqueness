"use strict";

/**
 * resolve.js
 *
 * String-literal resolution machinery shared by the rule (ESTree AST) and the
 * catalog scanner (TypeScript AST).
 *
 *   - ESTree (rule): stringLiteralsOf, resolveExportedFromFile,
 *     resolveStringCandidates — resolve className/style expressions to
 *     candidate string literals, following local constants, cn()/clsx()
 *     calls, ternaries, and imported helpers (read from disk).
 *   - TS AST (scanner): tsStringLiteralsOf — the same job over a TypeScript
 *     AST node (used by the catalog generator).
 */

const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

/**
 * Collect string literals from an ESTree expression (shallow, capped).
 */
function stringLiteralsOf(expr, out, depth) {
	if (!expr || depth > 4 || out.length >= 24) return;
	switch (expr.type) {
		case "Literal":
			if (typeof expr.value === "string") out.push(expr.value);
			break;
		case "TemplateLiteral":
			for (const q of expr.quasis) {
				if (q.value && q.value.cooked) out.push(q.value.cooked);
			}
			break;
		case "ObjectExpression":
			for (const p of expr.properties) {
				if (p.type === "Property") stringLiteralsOf(p.value, out, depth + 1);
			}
			break;
		case "ArrayExpression":
			for (const el of expr.elements) {
				if (el) stringLiteralsOf(el, out, depth + 1);
			}
			break;
		case "CallExpression":
			for (const arg of expr.arguments) stringLiteralsOf(arg, out, depth + 1);
			break;
		case "ConditionalExpression":
			stringLiteralsOf(expr.consequent, out, depth + 1);
			stringLiteralsOf(expr.alternate, out, depth + 1);
			break;
		case "LogicalExpression":
			stringLiteralsOf(expr.left, out, depth + 1);
			stringLiteralsOf(expr.right, out, depth + 1);
			break;
		case "BinaryExpression":
			if (expr.operator === "+") {
				stringLiteralsOf(expr.left, out, depth + 1);
				stringLiteralsOf(expr.right, out, depth + 1);
			}
			break;
		default:
			break;
	}
}

/** Collect string literals from a TypeScript AST node (shallow, capped). */
function tsStringLiteralsOf(node, out, depth, root) {
	if (!node || depth > 4 || out.length >= 24) return;
	if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
		out.push(node.text);
		return;
	}
	if (ts.isTemplateExpression(node)) {
		for (const s of node.head && node.head.text ? [node.head.text] : []) out.push(s);
		for (const span of node.templateSpans) {
			if (span.literal && span.literal.text) out.push(span.literal.text);
			tsStringLiteralsOf(span.expression, out, depth + 1, root);
		}
		return;
	}
	if (ts.isObjectLiteralExpression(node)) {
		for (const p of node.properties) tsStringLiteralsOf(p.initializer, out, depth + 1, root);
		return;
	}
	if (ts.isArrayLiteralExpression(node)) {
		for (const el of node.elements) tsStringLiteralsOf(el, out, depth + 1, root);
		return;
	}
	if (ts.isCallExpression(node)) {
		for (const arg of node.arguments) tsStringLiteralsOf(arg, out, depth + 1, root);
		return;
	}
	if (ts.isConditionalExpression(node)) {
		tsStringLiteralsOf(node.whenTrue, out, depth + 1, root);
		tsStringLiteralsOf(node.whenFalse, out, depth + 1, root);
		return;
	}
	if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.Plus) {
		tsStringLiteralsOf(node.left, out, depth + 1, root);
		tsStringLiteralsOf(node.right, out, depth + 1, root);
		return;
	}
	if (ts.isBlock(node)) {
		ts.forEachChild(node, (n) => tsStringLiteralsOf(n, out, depth + 1, root));
		return;
	}
	if (ts.isReturnStatement(node) && node.expression) {
		tsStringLiteralsOf(node.expression, out, depth + 1, root);
		return;
	}
	if (ts.isIdentifier(node) && root) {
		// A bare identifier in the initializer (e.g. const cls = baseCls) —
		// resolve it within the same file.
		const findDecl = (n) => {
			if (out.length >= 24) return;
			if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.name.text === node.text && n.initializer) {
				tsStringLiteralsOf(n.initializer, out, depth + 1, root);
				return;
			}
			ts.forEachChild(n, findDecl);
		};
		findDecl(root);
	}
}

// Cache of imported-value lookups: absPath -> { name: result }.
const importedCache = new Map();

/**
 * Read a sibling file from disk and resolve one of its exported constants to
 * string literals. Handles: const X = "...", template literals, cn()/clsx()
 * calls, object literals, ternaries, and re-exports (export { Y as X }).
 * Cached per file. Returns null when the file cannot be read or the export is
 * not a static string.
 */
function resolveExportedFromFile(fileAbs, exportName) {
	let byFile = importedCache.get(fileAbs);
	if (!byFile) {
		byFile = {};
		importedCache.set(fileAbs, byFile);
	}
	if (Object.prototype.hasOwnProperty.call(byFile, exportName)) return byFile[exportName];
	let result = null;
	try {
		const source = fs.readFileSync(fileAbs, "utf8");
		const sf = ts.createSourceFile(fileAbs, source, ts.ScriptTarget.ES2020, true, fileAbs.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
		const visit = (node) => {
			if (result) return;
			// export function NAME(...) { ... }
			if (ts.isFunctionDeclaration(node) && node.name && node.name.text === exportName && ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) {
				const out = [];
				if (node.body) tsStringLiteralsOf(node.body, out, 0, sf);
				result = out.length > 0 ? out : null;
				return;
			}
			// export const NAME = ... / export let / export var
			if (ts.isVariableStatement(node) && ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) {
				for (const d of node.declarationList.declarations) {
					if (ts.isIdentifier(d.name) && d.name.text === exportName && d.initializer) {
						const out = [];
						tsStringLiteralsOf(d.initializer, out, 0, sf);
						// Arrow/function initializer: also collect the body
						// (const rowCls = (w) => w ? "a" : "b").
						if (out.length === 0 && (ts.isArrowFunction(d.initializer) || ts.isFunctionExpression(d.initializer))) {
							if (d.initializer.body) tsStringLiteralsOf(d.initializer.body, out, 0, sf);
						}
						result = out.length > 0 ? out : null;
						return;
					}
				}
			}
			// export { Y as NAME } / export { Y as NAME } from "./other"
			if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause)) {
				for (const el of node.exportClause.elements) {
					const exported = el.name && el.name.text;
					if (exported === exportName) {
						if (node.moduleSpecifier) {
							// Re-export from another file — resolve there.
							const localName = el.propertyName ? el.propertyName.text : exportName;
							const target = path.resolve(path.dirname(fileAbs), node.moduleSpecifier.text);
							const exts = ["", ".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.tsx", "/index.js"];
							for (const ext of exts) {
								const candidate = target + ext;
								try {
									if (fs.statSync(candidate).isFile()) {
										result = resolveExportedFromFile(candidate, localName);
										return;
									}
								} catch {
									// try next extension
								}
							}
						} else {
							// Local re-export: find the local declaration.
							const localName = el.propertyName ? el.propertyName.text : exportName;
							const findLocal = (n) => {
								if (result) return;
								if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.name.text === localName && n.initializer) {
									const out = [];
									tsStringLiteralsOf(n.initializer, out, 0, sf);
									result = out.length > 0 ? out : null;
								}
								ts.forEachChild(n, findLocal);
							};
							findLocal(sf);
							return;
						}
					}
				}
			}
			ts.forEachChild(node, visit);
		};
		visit(sf);
	} catch {
		result = null;
	}
	byFile[exportName] = result;
	return result;
}

/**
 * Resolve an expression to candidate string values (dynamic values: local
 * variables, ternaries, cn()/clsx() calls, template literals, imported
 * constants). Returns null when the expression is not a statically known
 * string.
 */
function resolveStringCandidates(expr, scope, depth, fileDir) {
	if (!expr || depth > 3) return null;
	switch (expr.type) {
		case "Literal":
			// Strings and numbers: inline style values are often numeric
			// (padding: 16, borderRadius: 8). The catalog scanner
			// (scanner/extract.js) records numeric literals the same way, so
			// the runtime candidate must too — otherwise a numeric-styled
			// element loses those style keys and falls below the shared-key
			// threshold.
			return typeof expr.value === "string" || typeof expr.value === "number" ? [String(expr.value)] : null;
		case "TemplateLiteral": {
			if (expr.expressions.length === 0) {
				const cooked = expr.quasis.map((q) => q.value.cooked).join("");
				return [cooked];
			}
			const out = [];
			for (const q of expr.quasis) {
				if (q.value.cooked) out.push(q.value.cooked);
			}
			for (const e of expr.expressions) {
				const c = resolveStringCandidates(e, scope, depth + 1, fileDir);
				if (c) out.push(...c);
			}
			return out.length ? out : null;
		}
		case "ConditionalExpression": {
			const a = resolveStringCandidates(expr.consequent, scope, depth + 1, fileDir);
			const b = resolveStringCandidates(expr.alternate, scope, depth + 1, fileDir);
			const out = [];
			if (a) out.push(...a);
			if (b) out.push(...b);
			return out.length ? out : null;
		}
		case "LogicalExpression": {
			const a = resolveStringCandidates(expr.left, scope, depth + 1, fileDir);
			const b = resolveStringCandidates(expr.right, scope, depth + 1, fileDir);
			const out = [];
			if (a) out.push(...a);
			if (b) out.push(...b);
			return out.length ? out : null;
		}
		case "BinaryExpression": {
			if (expr.operator !== "+") return null;
			const a = resolveStringCandidates(expr.left, scope, depth + 1, fileDir);
			const b = resolveStringCandidates(expr.right, scope, depth + 1, fileDir);
			if (a && b) return [...a, ...b];
			return a || b;
		}
		case "CallExpression": {
			const callee = expr.callee;
			const isJoiner =
				(callee.type === "Identifier" && /^(cn|clsx|cx|classNames|classnames|joinClasses|mergeClasses)$/.test(callee.name)) ||
				(callee.type === "MemberExpression" && callee.object && callee.object.name === "classNames");
			if (isJoiner) {
				const out = [];
				for (const arg of expr.arguments) {
					const c = resolveStringCandidates(arg, scope, depth + 1, fileDir);
					if (c) out.push(...c);
				}
				return out.length ? out : null;
			}
			// Call of an imported function (e.g. rowCls(wide)) — resolve the
			// exported function body in the sibling file.
			if (callee.type === "Identifier" && fileDir) {
				let imp = null;
				for (let s = scope; s; s = s.upper) {
					imp = (s.variables || []).find((v) => v.name === callee.name && v.defs && v.defs.some((d) => d.type === "ImportBinding"));
					if (imp) break;
				}
				if (imp) {
					const binding = (imp.defs.find((d) => d.type === "ImportBinding") || imp.defs[0] || {}).node;
					const source = binding.parent && binding.parent.source && binding.parent.source.value;
					if (source && source.startsWith(".")) {
						const target = path.resolve(fileDir, source);
						const exts = ["", ".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.tsx", "/index.js"];
						for (const ext of exts) {
							const candidate = target + ext;
							try {
								if (fs.statSync(candidate).isFile()) {
									const c = resolveExportedFromFile(candidate, imp.name);
									if (c) return c;
									break;
								}
							} catch {
								// try next extension
							}
						}
					}
				}
			}
			return null;
		}
		case "Identifier": {
			// Local declaration in an enclosing scope (const cls = ...).
			for (let s = scope; s; s = s.upper) {
				const v = s.variables.find((x) => x.name === expr.name);
				if (!v) continue;
				for (const def of v.defs || []) {
					const node = def && def.node;
					if (node && node.type === "VariableDeclarator" && node.init) {
						const c = resolveStringCandidates(node.init, scope, depth + 1, fileDir);
						if (c) return c;
					}
				}
			}
			// Imported from a sibling file — read the file, find the exported
			// constant, collect its string literals. The import binding lives
			// in the module scope, so walk up.
			let imp = null;
			for (let s = scope; s; s = s.upper) {
				imp = (s.variables || []).find((v) => v.name === expr.name && v.defs && v.defs.some((d) => d.type === "ImportBinding"));
				if (imp) break;
			}
			if (imp && fileDir) {
				const binding = (imp.defs.find((d) => d.type === "ImportBinding") || imp.defs[0] || {}).node;
				const source = binding.parent && binding.parent.source && binding.parent.source.value;
				if (source && source.startsWith(".")) {
					const target = path.resolve(fileDir, source);
					const exts = ["", ".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.tsx", "/index.js"];
					for (const ext of exts) {
						const candidate = target + ext;
						try {
							if (fs.statSync(candidate).isFile()) {
								const c = resolveExportedFromFile(candidate, imp.name);
								if (c) return c;
								break;
							}
						} catch {
							// try next extension
						}
					}
				}
			}
			return null;
		}
		default:
			return null;
	}
}

module.exports = {
	stringLiteralsOf,
	tsStringLiteralsOf,
	resolveExportedFromFile,
	resolveStringCandidates,
};
