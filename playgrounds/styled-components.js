"use strict";

const ts = require("typescript");

const MAX_LITERAL_DEPTH = 4;
const MAX_LITERAL_COUNT = 12;

const stringLiterals = (node, out, depth = 0) => {
	if (!node || depth > MAX_LITERAL_DEPTH || out.length >= MAX_LITERAL_COUNT) return;
	if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
		out.push(node.text);
		return;
	}
	if (ts.isNumericLiteral(node)) {
		out.push(node.text);
		return;
	}
	if (ts.isParenthesizedExpression(node)) {
		stringLiterals(node.expression, out, depth + 1);
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
};

const localDeclarations = (sf) => {
	const map = new Map();
	const visit = (node) => {
		if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer && !map.has(node.name.text)) {
			map.set(node.name.text, node.initializer);
		}
		ts.forEachChild(node, visit);
	};
	visit(sf);
	return map;
};

const literalOf = (expr, decls, depth = 0) => {
	if (!expr || depth > 3) return null;
	if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) return expr.text;
	if (ts.isNumericLiteral(expr)) return expr.text;
	if (ts.isParenthesizedExpression(expr)) return literalOf(expr.expression, decls, depth + 1);
	if (ts.isArrowFunction(expr) || ts.isFunctionExpression(expr)) {
		let body = expr.body;
		if (ts.isBlock(body)) {
			const ret = body.statements.find((s) => ts.isReturnStatement(s) && s.expression);
			if (!ret) return null;
			body = ret.expression;
		}
		return literalOf(body, decls, depth + 1);
	}
	if (ts.isIdentifier(expr)) {
		const decl = decls.get(expr.text);
		if (!decl) return null;
		return literalOf(decl, decls, depth + 1);
	}
	if (ts.isCallExpression(expr) && ts.isIdentifier(expr.expression)) {
		const decl = decls.get(expr.expression.text);
		if (!decl) return null;
		return literalOf(decl, decls, depth + 1);
	}
	return null;
};

const templateToCss = (template, decls, sf) => {
	const unresolved = [];
	if (ts.isNoSubstitutionTemplateLiteral(template)) return { cssText: template.text, unresolved };
	if (!ts.isTemplateExpression(template)) return { cssText: "", unresolved };
	let text = template.head.text;
	for (const span of template.templateSpans) {
		const value = literalOf(span.expression, decls);
		if (value !== null) {
			text += value;
		} else {
			const strs = [];
			stringLiterals(span.expression, strs);
			if (strs.length > 0) text += strs.join(" ");
			else unresolved.push(span.expression.getText(sf));
		}
		text += span.literal.text;
	}
	return { cssText: text, unresolved };
};

const styledTagInfo = (tag) => {
	if (ts.isPropertyAccessExpression(tag) && ts.isIdentifier(tag.expression) && tag.expression.text === "styled" && ts.isIdentifier(tag.name)) {
		return { baseTag: tag.name.text, componentRef: null };
	}
	if (ts.isCallExpression(tag) && ts.isIdentifier(tag.expression) && tag.expression.text === "styled" && tag.arguments.length === 1 && ts.isIdentifier(tag.arguments[0])) {
		return { baseTag: null, componentRef: tag.arguments[0].text };
	}
	return null;
};

const styledDeclarations = (sf) => {
	const out = new Map();
	const decls = localDeclarations(sf);
	const visit = (node) => {
		if (ts.isVariableStatement(node)) {
			for (const d of node.declarationList.declarations) {
				if (!ts.isIdentifier(d.name) || !d.initializer || !ts.isTaggedTemplateExpression(d.initializer)) continue;
				const info = styledTagInfo(d.initializer.tag);
				if (!info) continue;
				const { cssText, unresolved } = templateToCss(d.initializer.template, decls, sf);
				out.set(d.name.text, { baseTag: info.baseTag, componentRef: info.componentRef, cssText, unresolved });
			}
		}
		ts.forEachChild(node, visit);
	};
	visit(sf);
	return out;
};

const resolveClasses = (classes) => {
	return { css: {}, unresolved: [...(classes || [])] };
};

module.exports = { styledDeclarations, resolveClasses, available: () => true };