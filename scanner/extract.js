"use strict";

/**
 * scanner/extract.js
 *
 * Signature extraction from one source file (TypeScript AST). For every
 * JSX element and every styled.* template, a normalized Signature is
 * recorded:
 *
 *   { tag, styles, actions, a11y, data }
 *
 * Only elements with at least one style / action / a11y marker are kept —
 * a bare <div> is building material, not a component signature.
 */

const fs = require("node:fs");
const ts = require("typescript");
const sig = require("../signature");
const { ACTION_ATTR_NAMES } = require("../config");

/** Collect string literals from a TS expression (shallow, capped). */
function stringLiterals(node, out, depth = 0) {
	if (!node || depth > 4 || out.length >= 24) return;
	if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
		out.push(node.text);
		return;
	}
	if (ts.isTemplateExpression(node)) {
		if (node.head.text) out.push(node.head.text);
		for (const span of node.templateSpans) {
			if (span.literal.text) out.push(span.literal.text);
			stringLiterals(span.expression, out, depth + 1);
		}
		return;
	}
	if (ts.isObjectLiteralExpression(node)) {
		for (const p of node.properties) stringLiterals(p.initializer, out, depth + 1);
		return;
	}
	if (ts.isArrayLiteralExpression(node)) {
		for (const el of node.elements) stringLiterals(el, out, depth + 1);
		return;
	}
	if (ts.isCallExpression(node)) {
		for (const arg of node.arguments) stringLiterals(arg, out, depth + 1);
		return;
	}
	if (ts.isConditionalExpression(node)) {
		stringLiterals(node.whenTrue, out, depth + 1);
		stringLiterals(node.whenFalse, out, depth + 1);
		return;
	}
	if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.Plus) {
		stringLiterals(node.left, out, depth + 1);
		stringLiterals(node.right, out, depth + 1);
		return;
	}
}

/**
 * Resolve an identifier to a string-literal initializer or object literal
 * declared somewhere in the same file (const cls = "..."; const st = {...}).
 */
function resolveLocalIdentifier(name, fileSf, kind) {
	const found = { str: [], obj: null };
	const walk = (n) => {
		if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.name.text === name && n.initializer) {
			if (kind === "str") {
				const strs = [];
				stringLiterals(n.initializer, strs);
				found.str.push(...strs);
			} else if (kind === "obj" && ts.isObjectLiteralExpression(n.initializer)) {
				found.obj = n.initializer;
			}
			return;
		}
		ts.forEachChild(n, walk);
	};
	walk(fileSf);
	return found;
}

/**
 * Extract component signatures from one source file.
 *
 * @param {string} fileAbs absolute path to a .ts/.tsx/.jsx file
 * @returns {Array<{tag: string, styles: object, actions: string[], a11y: string[], data: string[]}>}
 */
function signaturesFromFile(fileAbs) {
	const source = fs.readFileSync(fileAbs, "utf8");
	const sf = ts.createSourceFile(fileAbs, source, ts.ScriptTarget.ES2020, true, fileAbs.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
	const out = [];

	/** Resolve a className-ish expression to a styles map. */
	const classNameStyles = (expr) => {
		const merged = {};
		const addStyles = (s) => {
			const tw = sig.twToStyles(s);
			for (const [p, v] of Object.entries(tw)) {
				if (!merged[p]) merged[p] = [];
				for (const x of v) if (!merged[p].includes(x)) merged[p].push(x);
			}
		};
		if (!expr) return merged;
		if (ts.isIdentifier(expr)) {
			const r = resolveLocalIdentifier(expr.text, sf, "str");
			for (const s of r.str) addStyles(s);
			return merged;
		}
		const strs = [];
		stringLiterals(expr, strs);
		for (const s of strs) addStyles(s);
		return merged;
	};

	/** Resolve a style={{...}} expression to { prop: [values] }. */
	const styleObjectStyles = (expr) => {
		// The attr initializer is a JSXExpressionContainer wrapping the real expression.
		if (expr && expr.kind === ts.SyntaxKind.JsxExpression) expr = expr.expression;
		const styles = {};
		const add = (prop, value) => {
			if (!Object.prototype.hasOwnProperty.call(styles, prop)) styles[prop] = [];
			if (!styles[prop].includes(value)) styles[prop].push(value);
		};
		const visitObj = (n) => {
			if (!n) return;
			if (ts.isObjectLiteralExpression(n)) {
				for (const p of n.properties) {
					if (!ts.isPropertyAssignment(p) || !p.name) continue;
					const key = ts.isIdentifier(p.name) ? p.name.text : ts.isStringLiteral(p.name) ? p.name.text : null;
					if (!key) continue;
					const prop = sig.camelToKebab(key);
					if (ts.isStringLiteral(p.initializer)) {
						add(prop, p.initializer.text);
					} else if (ts.isNumericLiteral(p.initializer)) {
						add(prop, p.initializer.text);
					} else if (ts.isPrefixUnaryExpression(p.initializer) && ts.isNumericLiteral(p.initializer.operand)) {
						add(prop, `${p.operator === ts.SyntaxKind.MinusToken ? "-" : ""}${p.initializer.operand.text}`);
					} else {
						const strs = [];
						stringLiterals(p.initializer, strs);
						for (const s of strs) add(prop, s);
					}
				}
				return;
			}
			if (ts.isConditionalExpression(n)) {
				visitObj(n.whenTrue);
				visitObj(n.whenFalse);
				return;
			}
			if (ts.isIdentifier(n)) {
				const r = resolveLocalIdentifier(n.text, sf, "obj");
				if (r.obj) visitObj(r.obj);
			}
		};
		visitObj(expr);
		return styles;
	};

	const tagOf = (name) => (ts.isIdentifier(name) ? name.text : ts.isNamespacedName(name) ? `${name.name.text}:${name.namespace.text}` : null);

	const visit = (node) => {
		// JSX elements: <div className="..." role="dialog" onClick={...} data-testid="x" />
		if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
			// JsxElement carries the tag in node.openingElement; a JsxSelfClosingElement
			// IS the opening tag (it has tagName + attributes directly, no openingElement).
			const opening = ts.isJsxElement(node) ? node.openingElement : node;
			const tag = tagOf(opening.tagName);
			if (!tag) return;
			const sigObj = { tag, styles: {}, actions: [], a11y: [], data: [] };
			for (const attr of opening.attributes.properties) {
				if (!ts.isJsxAttribute(attr) || !attr.name) continue;
				const aname = attr.name.getText(sf);
				const value = attr.initializer;
				if (aname === "className" || aname === "class") {
					sigObj.styles = sig.mergeStyles(sigObj.styles, classNameStyles(value));
				} else if (aname === "style") {
					sigObj.styles = sig.mergeStyles(sigObj.styles, styleObjectStyles(value));
				} else if (ACTION_ATTR_NAMES.has(aname)) {
					const action = aname.slice(2).toLowerCase();
					if (!sigObj.actions.includes(action)) sigObj.actions.push(action);
				} else if (aname === "role" || aname.startsWith("aria-")) {
					const strs = [];
					if (value) stringLiterals(value, strs);
					const v = strs[0] ?? "true";
					const key = `${aname}:${v}`;
					if (!sigObj.a11y.includes(key)) sigObj.a11y.push(key);
				} else if (aname.startsWith("data-")) {
					const strs = [];
					if (value) stringLiterals(value, strs);
					const v = strs[0] ?? "";
					const key = `${aname}:${v}`;
					if (!sigObj.data.includes(key)) sigObj.data.push(key);
				} else if (aname === "type" && (tag === "input" || tag === "button")) {
					const strs = [];
					if (value) stringLiterals(value, strs);
					const v = strs[0];
					if (v) {
						const key = `type:${v}`;
						if (!sigObj.a11y.includes(key)) sigObj.a11y.push(key);
					}
				} else if (aname === "contentEditable") {
					if (!sigObj.a11y.includes("contenteditable")) sigObj.a11y.push("contenteditable");
				}
			}
			if (Object.keys(sigObj.styles).length > 0 || sigObj.actions.length > 0 || sigObj.a11y.length > 0) {
				out.push(sigObj);
			}
			if (ts.isJsxElement(node)) ts.forEachChild(node, visit);
			return;
		}

		// styled.div`css` / styled("div")`css`
		if (ts.isVariableDeclaration(node) && node.initializer && ts.isTaggedTemplateExpression(node.initializer)) {
			// styled.div`...` → tag is the PropertyAccessExpression itself (styled.div).
			// styled("div")`...` → tag is a CallExpression. styled.div<Props>`...` → wrapped in a TypeAssertion.
			const tagExpr = node.initializer.tag;
			const tpl = node.initializer.template;
			// No interpolation → NoSubstitutionTemplateLiteral (.text). With ${} → TemplateExpression (.head + .templateSpans).
			const cssText = ts.isTemplateExpression(tpl)
				? tpl.head.text + tpl.templateSpans.map((s) => s.literal.text).join("")
				: ts.isNoSubstitutionTemplateLiteral(tpl)
					? tpl.text
					: "";
			let tag = null;
			// styled.div<Props>`...` wraps the member access in a TypeAssertion.
			let real = tagExpr;
			while (real && (ts.isTypeAssertionExpression(real) || ts.isAsExpression(real))) real = real.expression;
			if (real && ts.isPropertyAccessExpression(real)) {
				const base = real.expression;
				if (ts.isIdentifier(base) && base.text === "styled") tag = real.name.text;
			} else if (tagExpr && ts.isCallExpression(tagExpr)) {
				const arg0 = tagExpr.arguments[0];
				// styled("div")`...` — string literal.
				if (arg0 && ts.isStringLiteral(arg0)) tag = arg0.text;
				// styled(MuiButton)`...` — identifier: a wrapper built on a
				// LIBRARY component. The tag is the component name (the rendered
				// DOM tag is unknown statically — that is what the dynamic
				// snapshot catalog is for), so the signature is matched by the
				// CSS the wrapper adds on top of the library styles.
				else if (arg0 && ts.isIdentifier(arg0)) tag = arg0.text;
			}
			if (tag) {
				const sigObj = { tag, styles: sig.cssTextToStyles(cssText), actions: [], a11y: [], data: [] };
				if (Object.keys(sigObj.styles).length > 0) out.push(sigObj);
			}
		}

		ts.forEachChild(node, visit);
	};
	visit(sf);
	return out;
}

module.exports = { signaturesFromFile, stringLiterals, resolveLocalIdentifier };
