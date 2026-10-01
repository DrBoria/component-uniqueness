"use strict";

const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const { stringLiterals, resolveLocalIdentifier } = require("./extract");

const HTML_TAGS = new Set([
	"html",
	"head",
	"body",
	"div",
	"span",
	"a",
	"p",
	"main",
	"section",
	"header",
	"footer",
	"nav",
	"aside",
	"article",
	"ul",
	"ol",
	"li",
	"table",
	"thead",
	"tbody",
	"tr",
	"td",
	"th",
	"form",
	"label",
	"input",
	"button",
	"select",
	"textarea",
	"img",
	"figure",
	"figcaption",
	"svg",
	"path",
	"circle",
	"rect",
	"g",
	"pre",
	"code",
	"strong",
	"em",
	"small",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"hr",
	"br",
	"i",
	"b",
	"u",
	"s",
	"sub",
	"sup",
	"blockquote",
	"details",
	"summary",
	"dialog",
	"canvas",
	"video",
	"audio",
	"source",
	"track",
	"map",
	"area",
	"dl",
	"dt",
	"dd",
	"fieldset",
	"legend",
	"data",
	"output",
	"progress",
	"meter",
	"time",
	"mark",
	"abbr",
	"ruby",
	"rt",
	"rp",
	"wbr",
	"bdi",
	"bdo",
	"template",
	"slot",
	"picture",
]);

const isPascalCase = (name) => /^[A-Z][A-Za-z0-9]*$/.test(name);

const dottedName = (name) => {
	if (ts.isIdentifier(name)) return name.text;
	if (name && name.kind === ts.SyntaxKind.QualifiedName) return `${dottedName(name.left)}.${name.right.text}`;
	if (name && name.kind === ts.SyntaxKind.PropertyAccessExpression) return `${dottedName(name.expression)}.${name.name.text}`;
	return null;
};

const tagOf = (name) => dottedName(name);

function hasJsx(node) {
	let found = false;
	const visit = (n) => {
		if (found) return;
		if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n)) {
			found = true;
			return;
		}
		ts.forEachChild(n, visit);
	};
	visit(node);
	return found;
}

function isExported(node, sf) {
	const mods = ts.getModifiers(node) || [];
	if (mods.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) return true;
	const parent = node.parent;
	if (parent && (ts.isExportDeclaration(parent) || ts.isExportAssignment(parent))) return true;
	return false;
}

function collectTokens(expr, sf, out) {
	if (!expr) return;
	if (ts.isJsxExpression(expr)) expr = expr.expression;
	const strs = [];
	stringLiterals(expr, strs);
	const idents = new Set();
	const visitIds = (n) => {
		if (ts.isIdentifier(n) && n.text.length > 0) idents.add(n.text);
		ts.forEachChild(n, visitIds);
	};
	visitIds(expr);
	for (const id of idents) {
		const r = resolveLocalIdentifier(id, sf, "str");
		for (const s of r.str) strs.push(s);
	}
	for (const s of strs) {
		for (const tok of s.split(/\s+/)) {
			if (tok && !out.has(tok)) out.add(tok);
		}
	}
}

function openingOf(node) {
	return ts.isJsxElement(node) ? node.openingElement : node;
}

function classNameTokens(opening, sf, out) {
	for (const attr of opening.attributes.properties) {
		if (ts.isJsxAttribute(attr) && attr.name) {
			const aname = attr.name.getText(sf);
			if (aname === "className" || aname === "class") collectTokens(attr.initializer, sf, out);
		}
	}
}

function gatherElements(node, sf, out) {
	const visit = (n) => {
		if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n)) {
			const opening = openingOf(n);
			const tag = tagOf(opening.tagName);
			const tokens = new Set();
			classNameTokens(opening, sf, tokens);
			out.push({ tag, tokens });
		}
		ts.forEachChild(n, visit);
	};
	visit(node);
}

function gatherSubtrees(node, sf) {
	const out = [];
	const visit = (n) => {
		if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n)) {
			out.push(n);
		}
		ts.forEachChild(n, visit);
	};
	visit(node);
	return out;
}

const MAX_SUBTREE_TAGS = 80;

function subtreeInfo(node, sf) {
	const seq = [];
	const tokens = new Set();
	const visit = (n) => {
		if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n)) {
			const opening = openingOf(n);
			const tag = tagOf(opening.tagName);
			if (tag) seq.push(tag);
			classNameTokens(opening, sf, tokens);
		}
		ts.forEachChild(n, visit);
	};
	visit(node);
	return { seq, tokens };
}

function subtreesOf(node, sf) {
	const out = [];
	for (const el of gatherSubtrees(node, sf, [])) {
		const info = subtreeInfo(el, sf);
		if (info.seq.length > 0 && info.seq.length <= MAX_SUBTREE_TAGS) {
			out.push({ tag: info.seq[0], seq: info.seq, tokens: [...info.tokens].sort() });
		}
	}
	return out;
}

function rootTagsOf(node, sf) {
	const out = new Set();
	const visit = (n, parent) => {
		if (n !== node && (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n))) {
			const isRoot = !parent || !(ts.isJsxElement(parent) || ts.isJsxSelfClosingElement(parent) || ts.isJsxFragment(parent));
			if (isRoot) {
				const tag = tagOf(openingOf(n).tagName);
				if (tag) out.add(tag);
			}
		}
		ts.forEachChild(n, (c) => visit(c, n));
	};
	visit(node, null);
	return out;
}

function gatherA11y(node, sf, out) {
	const visit = (n) => {
		if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n)) {
			const opening = openingOf(n);
			for (const attr of opening.attributes.properties) {
				if (ts.isJsxAttribute(attr) && attr.name) {
					const aname = attr.name.getText(sf);
					if (aname === "role" || aname.startsWith("aria-")) {
						const strs = [];
						if (attr.initializer) stringLiterals(attr.initializer, strs);
						const v = strs[0] ?? "true";
						const key = `${aname}:${v}`;
						if (!out.has(key)) out.add(key);
					}
				}
			}
		}
		ts.forEachChild(n, visit);
	};
	visit(node);
}

function canonicalImportNames(sf) {
	const names = new Set();
	const visit = (n) => {
		if (ts.isImportDeclaration(n) && n.moduleSpecifier && ts.isStringLiteral(n.moduleSpecifier)) {
			if (n.importClause) {
				if (n.importClause.name) names.add(n.importClause.name.text);
				const clause = n.importClause.namedBindings;
				if (clause && ts.isNamedImports(clause)) {
					for (const el of clause.elements) {
						names.add(el.name.text);
					}
				}
			}
		}
		ts.forEachChild(n, visit);
	};
	visit(sf);
	return names;
}

function canonicalTagsUsed(node, names) {
	const found = new Set();
	const visit = (n) => {
		if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n)) {
			const opening = openingOf(n);
			if (ts.isIdentifier(opening.tagName) && names.has(opening.tagName.text)) found.add(opening.tagName.text);
		}
		ts.forEachChild(n, visit);
	};
	visit(node);
	return found;
}

function* iterateDeclarations(sf) {
	const found = [];
	const visit = (n) => {
		if (ts.isFunctionDeclaration(n) && n.name && isPascalCase(n.name.text) && n.body) {
			found.push({ name: n.name.text, body: n.body, node: n });
		}
		if (ts.isVariableStatement(n)) {
			for (const d of n.declarationList.declarations) {
				if (ts.isIdentifier(d.name) && isPascalCase(d.name.text) && d.initializer && (ts.isArrowFunction(d.initializer) || ts.isFunctionExpression(d.initializer))) {
					found.push({ name: d.name.text, body: d.initializer.body, node: n });
				}
			}
		}
		ts.forEachChild(n, visit);
	};
	visit(sf);
	for (const d of found) yield d;
}

function componentsFromFile(fileAbs, canonicalNames) {
	const source = fs.readFileSync(fileAbs, "utf8");
	const kind = fileAbs.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
	const sf = ts.createSourceFile(fileAbs, source, ts.ScriptTarget.ES2020, true, kind);
	const canonNameSet = canonicalNames || new Set();
	const out = [];
	const decls = [...iterateDeclarations(sf)];
	if (decls.length === 0 && hasJsx(sf)) {
		const base = path.basename(fileAbs, path.extname(fileAbs));
		const name = base.split(/[-_ ]+/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join("");
		decls.push({ name, body: sf, node: sf });
	}
	for (const d of decls) {
		if (!hasJsx(d.body)) continue;
		const elements = [];
		gatherElements(d.body, sf, elements);
		const elementProps = elements.map((e) => ({ tag: e.tag, tokens: [...e.tokens].sort() }));
		const rootTags = [...rootTagsOf(d.body, sf)].sort();
		const a11y = new Set();
		gatherA11y(d.body, sf, a11y);
		out.push({
			name: d.name,
			line: sf.getLineAndCharacterOfPosition(d.node.getStart(sf)).line + 1,
			isExported: isExported(d.node, sf),
			rootTags,
			elementProps,
			subtrees: subtreesOf(d.body, sf),
			a11y: [...a11y].sort(),
			usesCanonical: canonNameSet.size > 0 ? [...canonicalTagsUsed(d.body, canonNameSet)].sort() : [],
		});
	}
	return out;
}

module.exports = { componentsFromFile, gatherSubtrees, openingOf, tagOf, classNameTokens, HTML_TAGS, isPascalCase, isHtmlTag: (t) => HTML_TAGS.has(t) };
