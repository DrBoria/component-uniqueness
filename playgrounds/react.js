"use strict";

const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const { entries } = require("remeda");
const style = require("../normalize/style.js");
const { styleObjectToCssText, isPascalCase, isHtmlTag, INTERACTIVE_TAGS } = require("../normalize/dom.js");

const MAX_UNFOLD_DEPTH = 3;
const MAX_TREE_NODES = 400;

let skipNodes = null;

const stringLiterals = (node, out, depth = 0) => {
	if (!node || depth > 4 || out.length >= 24) return;
	if (skipNodes && skipNodes.has(node)) return;
	if (ts.isJsxExpression(node)) {
		stringLiterals(node.expression, out, depth);
		return;
	}
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
};

const resolveLocalIdentifier = (name, fileSf, kind) => {
	const found = { str: [], obj: null };
	const walk = (n) => {
		if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.name.text === name && n.initializer) {
			if (kind === "str") {
				if (variantConfigOf(n.initializer)) return;
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
};

const styleObjectStyles = (expr, sf) => {
	if (expr && ts.isJsxExpression(expr)) expr = expr.expression;
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
				const prop = style.camelToKebab(key);
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

const dottedName = (name) => {
	if (ts.isIdentifier(name)) return name.text;
	if (name && name.kind === ts.SyntaxKind.QualifiedName) return `${dottedName(name.left)}.${name.right.text}`;
	if (name && name.kind === ts.SyntaxKind.PropertyAccessExpression) return `${dottedName(name.expression)}.${name.name.text}`;
	return null;
};

const tagOf = (name) => dottedName(name);
const stringBranchOf = (expr, sf) => {
	if (!expr) return null;
	if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) return expr.text;
	if (ts.isIdentifier(expr)) {
		const decl = rawDeclarations(sf).find((item) => item.name === expr.text);
		if (decl) return stringBranchOf(decl.initializer, sf);
	}
	if (ts.isConditionalExpression(expr)) return stringBranchOf(expr.whenTrue, sf) || stringBranchOf(expr.whenFalse, sf);
	if (ts.isParenthesizedExpression(expr)) return stringBranchOf(expr.expression, sf);
	return null;
};

const openingOf = (node) => (ts.isJsxElement(node) ? node.openingElement : node);

const isJsxNode = (n) => ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n);

const propName = (name) => (name && (ts.isIdentifier(name) || ts.isStringLiteral(name)) ? name.text : null);

const variantConfigOf = (call) => {
	if (!call || !ts.isCallExpression(call)) return null;
	const last = call.arguments[call.arguments.length - 1];
	if (!last || !ts.isObjectLiteralExpression(last)) return null;
	const member = (name) => last.properties.find((p) => ts.isPropertyAssignment(p) && propName(p.name) === name);
	const variantsProp = member("variants");
	if (!variantsProp || !ts.isObjectLiteralExpression(variantsProp.initializer)) return null;
	const variants = {};
	for (const group of variantsProp.initializer.properties) {
		if (!ts.isPropertyAssignment(group) || !ts.isObjectLiteralExpression(group.initializer)) continue;
		const options = {};
		for (const option of group.initializer.properties) {
			if (!ts.isPropertyAssignment(option)) continue;
			const strs = [];
			stringLiterals(option.initializer, strs);
			options[propName(option.name)] = strs;
		}
		variants[propName(group.name)] = options;
	}
	const defaults = {};
	const defaultsProp = member("defaultVariants");
	if (defaultsProp && ts.isObjectLiteralExpression(defaultsProp.initializer)) {
		for (const d of defaultsProp.initializer.properties) {
			if (ts.isPropertyAssignment(d) && ts.isStringLiteral(d.initializer)) defaults[propName(d.name)] = d.initializer.text;
		}
	}
	const base = [];
	for (const arg of call.arguments.slice(0, -1)) stringLiterals(arg, base);
	return { base, variants, defaults };
};

const selectedVariantStrings = (call, sf, props) => {
	if (!ts.isIdentifier(call.expression)) return null;
	const decl = rawDeclarations(sf).find((item) => item.name === call.expression.text);
	const config = decl ? variantConfigOf(decl.initializer) : null;
	if (!config) return null;
	const given = {};
	const arg = call.arguments[0];
	if (arg && ts.isObjectLiteralExpression(arg)) {
		for (const p of arg.properties) {
			if (ts.isShorthandPropertyAssignment(p)) given[p.name.text] = props ? props[p.name.text] : undefined;
			else if (ts.isPropertyAssignment(p) && ts.isStringLiteral(p.initializer)) given[propName(p.name)] = p.initializer.text;
			else if (ts.isPropertyAssignment(p) && ts.isIdentifier(p.initializer)) given[propName(p.name)] = props ? props[p.initializer.text] : undefined;
		}
	}
	const out = [...config.base];
	for (const [group, options] of Object.entries(config.variants)) {
		const picked = typeof given[group] === "string" ? given[group] : config.defaults[group];
		out.push(...(options[picked] || []));
	}
	return out;
};

const collectTokens = (expr, sf, out, props) => {
	if (!expr) return;
	if (ts.isJsxExpression(expr)) expr = expr.expression;
	const strs = [];
	const skip = new Set();
	const findVariantCalls = (n) => {
		if (ts.isCallExpression(n)) {
			const picked = selectedVariantStrings(n, sf, props);
			if (picked) {
				strs.push(...picked);
				skip.add(n);
				return;
			}
		}
		ts.forEachChild(n, findVariantCalls);
	};
	findVariantCalls(expr);
	const previousSkip = skipNodes;
	skipNodes = skip;
	try {
		stringLiterals(expr, strs);
	} finally {
		skipNodes = previousSkip;
	}
	const idents = new Set();
	const visitIds = (n) => {
		if (skip.has(n)) return;
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
};

const moduleBindings = (sf) => {
	const map = new Map();
	for (const stmt of sf.statements) {
		if (!ts.isImportDeclaration(stmt) || !stmt.importClause || !ts.isStringLiteral(stmt.moduleSpecifier)) continue;
		const spec = stmt.moduleSpecifier.text;
		const clause = stmt.importClause;
		if (clause.name) map.set(clause.name.text, { spec, exported: "default" });
		const named = clause.namedBindings;
		if (named && ts.isNamedImports(named)) {
			for (const el of named.elements) map.set(el.name.text, { spec, exported: (el.propertyName || el.name).text });
		}
	}
	return map;
};

const isSourceFile = (file) => !!file && !/\.d\.ts$/.test(file) && !/[\\/]node_modules[\\/]/.test(file) && !/\.(stories|test|spec)\.[a-z]+$/.test(file);

const optionsCache = new Map();
let fallbackConfigPath = null;

const configPathOf = (target) => {
	if (!target) return null;
	const abs = path.resolve(target);
	if (abs.endsWith(".json")) return abs;
	return ts.findConfigFile(path.dirname(abs), ts.sys.fileExists) || null;
};

const readCompilerOptions = (configPath) => {
	if (optionsCache.has(configPath)) return optionsCache.get(configPath);
	let options = { allowJs: true };
	try {
		const parsed = ts.getParsedCommandLineOfConfigFile(configPath, {}, { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} });
		if (parsed) options = { ...parsed.options, allowJs: true };
	} catch {
		options = { allowJs: true };
	}
	optionsCache.set(configPath, options);
	return options;
};

const resolveModuleFile = (fromFile, spec) => {
	const nearest = ts.findConfigFile(path.dirname(fromFile), ts.sys.fileExists) || null;
	const configs = [nearest, fallbackConfigPath].filter((item, index, all) => item && all.indexOf(item) === index);
	const candidates = configs.length > 0 ? configs.map(readCompilerOptions) : [{ allowJs: true }];
	for (const options of candidates) {
		const hit = ts.resolveModuleName(spec, fromFile, options, ts.sys).resolvedModule;
		if (hit && isSourceFile(hit.resolvedFileName)) return hit.resolvedFileName;
	}
	return null;
};

const sourceFiles = new Map();

const sourceFileOf = (fileAbs) => {
	if (sourceFiles.has(fileAbs)) return sourceFiles.get(fileAbs);
	const source = fs.readFileSync(fileAbs, "utf8");
	const kind = fileAbs.endsWith(".tsx") || fileAbs.endsWith(".jsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
	const sf = ts.createSourceFile(fileAbs, source, ts.ScriptTarget.ES2020, true, kind);
	sourceFiles.set(fileAbs, sf);
	return sf;
};

const resolvedTags = new Map();

const exportSpecs = (sf) => {
	const specs = [];
	for (const stmt of sf.statements) {
		if (!ts.isExportDeclaration(stmt) || !stmt.moduleSpecifier || !ts.isStringLiteral(stmt.moduleSpecifier)) continue;
		const spec = stmt.moduleSpecifier.text;
		if (!stmt.exportClause) {
			specs.push({ spec, all: true });
			continue;
		}
		if (!ts.isNamedExports(stmt.exportClause)) continue;
		for (const el of stmt.exportClause.elements) specs.push({ spec, exported: el.name.text, local: (el.propertyName || el.name).text });
	}
	return specs;
};

const localExportNames = (sf) => {
	const names = new Set();
	for (const stmt of sf.statements) {
		if (ts.isExportAssignment(stmt) && ts.isIdentifier(stmt.expression)) names.add(stmt.expression.text);
		if (!ts.isExportDeclaration(stmt) || stmt.moduleSpecifier || !stmt.exportClause || !ts.isNamedExports(stmt.exportClause)) continue;
		for (const el of stmt.exportClause.elements) names.add((el.propertyName || el.name).text);
	}
	return names;
};

const findExportFile = (fileAbs, name, seen) => {
	if (seen.has(fileAbs)) return null;
	seen.add(fileAbs);
	const sf = sourceFileOf(fileAbs);
	const listed = localExportNames(sf);
	if (iterateDeclarations(sf).some((item) => item.name === name && (isExported(item.node, sf) || listed.has(name)))) return { file: fileAbs, name };
	const specs = exportSpecs(sf);
	const named = specs.find((exp) => !exp.all && exp.exported === name);
	if (named) {
		const target = resolveModuleFile(fileAbs, named.spec);
		return target ? findExportFile(target, named.local, seen) : null;
	}
	for (const exp of specs.filter((item) => item.all)) {
		const target = resolveModuleFile(fileAbs, exp.spec);
		if (!target) continue;
		const found = findExportFile(target, name, seen);
		if (found) return found;
	}
	return null;
};

const memberTarget = (sf, head, prop) => {
	let found = null;
	const fromObject = (obj) => {
		for (const p of obj.properties) {
			if (ts.isShorthandPropertyAssignment(p) && p.name.text === prop) return prop;
			if (ts.isPropertyAssignment(p) && propName(p.name) === prop && ts.isIdentifier(p.initializer)) return p.initializer.text;
		}

		return null;
	};
	const visit = (n) => {
		if (found) return;
		if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.name.text === head && n.initializer && ts.isCallExpression(n.initializer)) {
			for (const arg of n.initializer.arguments) if (!found && ts.isObjectLiteralExpression(arg)) found = fromObject(arg);
		}
		if (ts.isBinaryExpression(n) && n.operatorToken.kind === ts.SyntaxKind.EqualsToken && ts.isPropertyAccessExpression(n.left) && ts.isIdentifier(n.left.expression) && n.left.expression.text === head && n.left.name.text === prop && ts.isIdentifier(n.right)) found = n.right.text;
		ts.forEachChild(n, visit);
	};
	visit(sf);

	return found;
};

const resolveTag = (name, fileAbs, depth, props, styledResolver) => {
	const staticProps = Object.entries(props || {}).filter(([, v]) => typeof v === "string").sort();
	const key = `${fileAbs}::${name}::${JSON.stringify(staticProps)}`;
	if (resolvedTags.has(key)) return resolvedTags.get(key);
	if (depth > MAX_UNFOLD_DEPTH) return null;
	const sf = sourceFileOf(fileAbs);
	const dot = name.indexOf(".");
	const head = dot > 0 ? name.slice(0, dot) : name;
	const member = dot > 0 ? name.slice(dot + 1) : null;
	const binding = moduleBindings(sf).get(head);
	if (!binding) return null;
	const imported = resolveModuleFile(fileAbs, binding.spec);
	if (!imported) return null;
	const located = findExportFile(imported, binding.exported, new Set());
	if (!located) return null;
	const targetSf = sourceFileOf(located.file);
	const declName = member ? memberTarget(targetSf, located.name, member) : located.name;
	if (!declName) return null;
	const decl = iterateDeclarations(targetSf).find((item) => item.name === declName);
	if (!decl) return null;
	const inner = firstComponentNodeIn(decl.body);
	if (!inner) return null;
	resolvedTags.set(key, null);
	const built = buildTree(inner, targetSf, { bodies: localComponentBodies(targetSf), depth: depth + 1, nodes: 0, props: Object.fromEntries(staticProps), styledResolver, resolveTag: (tag, nested) => resolveTag(tag, located.file, depth + 1, nested, styledResolver) });
	const tree = built && { ...built, via: [declName, ...(built.via || [])] };
	resolvedTags.set(key, tree);
	return tree;
};

const localComponentBodies = (sf) => {
	const map = new Map();
	for (const item of rawDeclarations(sf)) {
		if (!isPascalCase(item.name)) continue;
		const body = componentBody(item.initializer, sf);
		if (body) map.set(item.name, body);
	}
	return map;
};

const jsxNodesIn = (expr) => {
	if (!expr) return [];
	if (isJsxNode(expr) || ts.isJsxFragment(expr)) return [expr];
	if (ts.isJsxExpression(expr) || ts.isParenthesizedExpression(expr) || ts.isAsExpression(expr) || ts.isTypeAssertionExpression(expr) || ts.isSatisfiesExpression(expr) || ts.isNonNullExpression(expr)) return jsxNodesIn(expr.expression);
	if (ts.isConditionalExpression(expr)) return [...jsxNodesIn(expr.whenTrue), ...jsxNodesIn(expr.whenFalse)];
	if (ts.isBinaryExpression(expr)) {
		const op = expr.operatorToken.kind;
		if (op === ts.SyntaxKind.AmpersandAmpersandToken) return jsxNodesIn(expr.right);
		if (op === ts.SyntaxKind.BarBarToken || op === ts.SyntaxKind.QuestionQuestionToken) return [...jsxNodesIn(expr.left), ...jsxNodesIn(expr.right)];

		return [];
	}
	if (ts.isArrayLiteralExpression(expr)) return expr.elements.flatMap((el) => jsxNodesIn(el));
	if (ts.isCallExpression(expr)) return expr.arguments.flatMap((arg) => jsxNodesIn(arg));
	if (ts.isArrowFunction(expr) || ts.isFunctionExpression(expr) || ts.isFunctionDeclaration(expr)) return jsxNodesIn(expr.body);
	if (ts.isBlock(expr)) return expr.statements.filter((stmt) => ts.isReturnStatement(stmt)).flatMap((stmt) => jsxNodesIn(stmt.expression));

	return [];
};

const firstComponentNodeIn = (body) => jsxNodesIn(body)[0] || null;

const buildTree = (node, sf, ctx) => {
	if (ts.isJsxFragment(node)) return fragmentTree(node, sf, ctx);
	if (ctx.nodes >= MAX_TREE_NODES) return null;
	ctx.nodes += 1;
	const opening = openingOf(node);
	const rawTag = tagOf(opening.tagName);
	const tag = rawTag && !isHtmlTag(rawTag) ? stringBranchOf(ts.isIdentifier(opening.tagName) ? opening.tagName : null, sf) || rawTag : rawTag;
	if (!tag) return null;
	const attrs = {};
	let className = null;
	const styleObj = {};
	let dynamic = false;
	const dynamicRefs = [];
	for (const attr of opening.attributes.properties) {
		if (!ts.isJsxAttribute(attr) || !attr.name) continue;
		const aname = attr.name.getText(sf);
		const value = attr.initializer;
		const strs = [];
		if (value) stringLiterals(value, strs);
		if (aname === "className" || aname === "class") {
			const tokens = new Set();
			collectTokens(value, sf, tokens, ctx.props);
			if (tokens.size > 0) className = [...tokens].sort().join(" ");
			else if (value) dynamic = true;
		} else if (aname === "style") {
			const so = styleObjectStyles(value, sf);
			for (const [k, v] of Object.entries(so)) styleObj[k] = v;
		} else {
			attrs[aname] = strs.length > 0 ? strs[0] : value ? null : true;
		}
	}
	const children = childTrees(node, sf, ctx);
	const spread = opening.attributes.properties.some((attr) => ts.isJsxSpreadAttribute(attr));
	if (spread) {
		children.push({ tag: "children", attrs: {}, className: null, style: null, cssText: "", children: [] });
	}
	const tree = {
		tag,
		spread,
		attrs,
		className,
		style: Object.keys(styleObj).length > 0 ? styleObj : null,
		cssText: styleObjectToCssText(styleObj),
		children,
	};
	if (!isHtmlTag(tag) && !ctx.noUnfold) {
		const body = ctx.bodies.get(tag);
		if (body && ctx.depth < MAX_UNFOLD_DEPTH) {
			const inner = firstComponentNodeIn(body);
			if (inner) {
				const unfolded = buildTree(inner, sf, { ...ctx, depth: ctx.depth + 1, props: attrs });
				if (unfolded) return graftChildren({ ...unfolded, via: [tag, ...(unfolded.via || [])] }, children, tree);
			}
		}
		const resolved = ctx.resolveTag ? ctx.resolveTag(tag, attrs) : null;
		if (resolved) return graftChildren(resolved, children, tree);
		const styledInfo = ctx.styledResolver ? ctx.styledResolver(tag, sf) : null;
		if (styledInfo) return styledNode(tag, styledInfo, tree, children, sf, ctx);
		dynamic = true;
		dynamicRefs.push(tag);
	}
	if (dynamic) {
		tree.dynamic = true;
		if (dynamicRefs.length > 0) tree.dynamicRefs = dynamicRefs;
	}
	return tree;
};

const fragmentTree = (node, sf, ctx) => ({
	tag: "fragment",
	attrs: {},
	className: null,
	style: null,
	cssText: "",
	children: childTrees(node, sf, ctx),
});

const childTrees = (node, sf, ctx) => {
	const children = [];
	for (const child of node.children || []) {
		if (isJsxNode(child) || ts.isJsxFragment(child)) {
			const t = buildTree(child, sf, ctx);
			if (t) children.push(t);
		} else if (ts.isJsxExpression(child)) {
			const found = jsxNodesIn(child.expression);
			for (const inner of found) {
				const t = buildTree(inner, sf, ctx);
				if (t) children.push(t);
			}
			if (found.length === 0 && child.expression && ts.isIdentifier(child.expression) && child.expression.text === "children") {
				children.push({ tag: "children", attrs: {}, className: null, style: null, cssText: "", children: [] });
			}
		} else if (ts.isJsxText(child)) {
			const text = child.text.replace(/\s+/g, " ").trim();
			if (text) children.push({ tag: "text", text, attrs: {}, className: null, style: null, cssText: "", children: [] });
		}
	}
	return children;
};

const mergeClass = (a, b) => [...new Set([...(a ? a.split(/\s+/) : []), ...(b ? b.split(/\s+/) : [])])].sort().join(" ") || null;

const fillSlot = (node, children) => {
	const kids = node.children || [];
	const index = kids.findIndex((child) => child.tag === "children");
	if (index >= 0) return { node: { ...node, children: [...kids.slice(0, index), ...children, ...kids.slice(index + 1)] }, done: true };
	for (let i = 0; i < kids.length; i += 1) {
		const filled = fillSlot(kids[i], children);
		if (filled.done) return { node: { ...node, children: [...kids.slice(0, i), filled.node, ...kids.slice(i + 1)] }, done: true };
	}

	return { node, done: false };
};

const graftChildren = (resolved, children, usage) => {
	if (resolved.tag === "fragment") return children.length > 0 ? fillSlot(resolved, children).node : resolved;
	const clone = { ...resolved, spread: usage.spread === true, attrs: { ...(resolved.attrs || {}), ...(usage.attrs || {}) }, className: mergeClass(resolved.className, usage.className) };

	return fillSlot(clone, children).node;
};

const styledNode = (tag, info, usage, children, sf, ctx) => {
	let base = null;
	if (info.componentRef) {
		const body = ctx.bodies.get(info.componentRef);
		if (body && ctx.depth < MAX_UNFOLD_DEPTH) {
			const inner = firstComponentNodeIn(body);
			if (inner) base = buildTree(inner, sf, { ...ctx, depth: ctx.depth + 1, props: {} });
		}
		if (!base) base = ctx.resolveTag ? ctx.resolveTag(info.componentRef, {}) : null;
	}
	if (base) {
		const merged = { ...(base.style || {}) };
		for (const [k, v] of Object.entries(info.styleObj || {})) merged[k] = v;
		const clone = { ...base, style: Object.keys(merged).length > 0 ? merged : null, cssText: styleObjectToCssText(merged), via: [tag, ...(base.via || [])] };
		return graftChildren(clone, children, usage);
	}
	return {
		tag: info.baseTag || tag,
		spread: usage.spread,
		attrs: usage.attrs,
		className: usage.className,
		style: Object.keys(info.styleObj || {}).length > 0 ? info.styleObj : null,
		cssText: styleObjectToCssText(info.styleObj || {}),
		children,
		via: [tag],
	};
};

const a11yOfOpening = (opening, sf, out) => {
	for (const attr of opening.attributes.properties) {
		if (!ts.isJsxAttribute(attr) || !attr.name) continue;
		const aname = attr.name.getText(sf);
		if (aname === "role" || aname.startsWith("aria-")) {
			const strs = [];
			if (attr.initializer) stringLiterals(attr.initializer, strs);
			out.add(`${aname}:${strs[0] ?? "true"}`);
		}
	}
};

const gatherA11y = (node, sf, out) => {
	const visit = (n) => {
		if (isJsxNode(n)) a11yOfOpening(openingOf(n), sf, out);
		ts.forEachChild(n, visit);
	};
	visit(node);
};

const rootTagsOf = (node, sf) => {
	const out = new Set();
	const visit = (n, parent) => {
		if (n !== node && isJsxNode(n)) {
			const isRoot = !parent || !(isJsxNode(parent) || ts.isJsxFragment(parent));
			if (isRoot) {
				const tag = tagOf(openingOf(n).tagName);
				if (tag) out.add(tag);
			}
		}
		ts.forEachChild(n, (c) => visit(c, n));
	};
	visit(node, null);
	return out;
};

const viaNames = (tree, names, out = new Set()) => {
	if (!tree) return out;
	for (const name of tree.via || []) if (names.has(name)) out.add(name);
	for (const child of tree.children || []) viaNames(child, names, out);

	return out;
};

const canonicalTagsUsed = (node, names) => {
	const found = new Set();
	const visit = (n) => {
		if (isJsxNode(n)) {
			const opening = openingOf(n);
			if (ts.isIdentifier(opening.tagName) && names.has(opening.tagName.text)) found.add(opening.tagName.text);
		}
		ts.forEachChild(n, visit);
	};
	visit(node);
	return found;
};

const hasComponentMarkup = (node) => {
	let found = false;
	const visit = (n) => {
		if (found) return;
		if (isJsxNode(n)) {
			found = true;
			return;
		}
		ts.forEachChild(n, visit);
	};
	visit(node);
	return found;
};

const isExported = (node, sf) => {
	const mods = ts.getModifiers(node) || [];
	if (mods.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) return true;
	const parent = node.parent;
	if (parent && (ts.isExportDeclaration(parent) || ts.isExportAssignment(parent))) return true;
	return false;
};

const unwrap = (expr) => {
	let current = expr;
	while (current && (ts.isParenthesizedExpression(current) || ts.isAsExpression(current) || ts.isTypeAssertionExpression(current) || ts.isSatisfiesExpression(current))) current = current.expression;
	return current;
};

const componentBody = (expr, sf) => {
	if (!expr) return null;
	if (ts.isArrowFunction(expr) || ts.isFunctionExpression(expr)) return unwrap(expr.body);
	if (ts.isCallExpression(expr)) {
		for (const arg of expr.arguments) {
			const body = componentBody(arg, sf);
			if (body) return body;
		}
	}
	if (ts.isParenthesizedExpression(expr)) return componentBody(expr.expression, sf);
	if (ts.isObjectLiteralExpression(expr)) {
		const rendering = expr.properties.find((prop) => ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name) && prop.name.text === "body");
		if (rendering) return componentBody(rendering.initializer, sf);
		if (expr.properties.some((prop) => ts.isMethodDeclaration(prop) && ts.isIdentifier(prop.name) && prop.name.text === "body")) {
			const method = expr.properties.find((prop) => ts.isMethodDeclaration(prop) && prop.name.text === "body");

			return unwrap(method.body);
		}
	}
	if (ts.isIdentifier(expr) && sf) {
		const decl = rawDeclarations(sf).find((item) => item.name === expr.text);
		if (decl) return componentBody(decl.initializer, null);
	}
	return null;
};

const rawDeclarations = (sf) => {
	const out = [];
	const visit = (node) => {
		if (ts.isVariableStatement(node)) {
			for (const d of node.declarationList.declarations) {
				if (ts.isIdentifier(d.name)) out.push({ name: d.name.text, initializer: d.initializer });
			}
		}
		if (ts.isFunctionDeclaration(node) && node.name) out.push({ name: node.name.text, initializer: node });
		ts.forEachChild(node, visit);
	};
	visit(sf);
	return out;
};

const iterateDeclarations = (sf) => {
	const found = [];
	const visit = (n) => {
		if (ts.isFunctionDeclaration(n) && n.name && isPascalCase(n.name.text) && n.body) {
			found.push({ name: n.name.text, body: n.body, node: n });
		}
		if (ts.isVariableStatement(n)) {
			for (const d of n.declarationList.declarations) {
				if (!ts.isIdentifier(d.name) || !isPascalCase(d.name.text)) continue;
				const body = componentBody(d.initializer, sf);
				if (body) found.push({ name: d.name.text, body, node: n });
			}
		}
		ts.forEachChild(n, visit);
	};
	visit(sf);
	return found;
};

const useConfig = (opts) => {
	fallbackConfigPath = configPathOf(opts && opts.tsconfig && path.resolve(opts.root || process.cwd(), opts.tsconfig));
};

const parseElements = (fileAbs, canonicalNames, opts) => {
	useConfig(opts);
	const sf = sourceFileOf(fileAbs);
	const bodies = localComponentBodies(sf);
	const out = [];
	const visit = (n) => {
		if (isJsxNode(n)) {
			const opening = openingOf(n);
			const tag = tagOf(opening.tagName);
			if (tag && isHtmlTag(tag)) {
				const tree = buildTree(n, sf, { bodies, depth: 0, nodes: 0, props: {}, styledResolver: opts.styledResolver, resolveTag: (name, props) => resolveTag(name, fileAbs, 0, props, opts.styledResolver) });
				if (tree) {
					const a11y = new Set();
					a11yOfOpening(opening, sf, a11y);
					const pos = sf.getLineAndCharacterOfPosition(opening.getStart(sf));
					out.push({ name: tag, line: pos.line + 1, column: pos.character, tree: { ...tree, children: [] }, rootTags: [tag], a11y: [...a11y].sort() });
				}
			}
		}
		ts.forEachChild(n, visit);
	};
	visit(sf);
	return out;
};

const MIN_PART_NODES = 3;
const MAX_PART_NODES = 60;

const jsxCount = (node) => {
	let count = 0;
	const visit = (n) => {
		if (isJsxNode(n)) count += 1;
		ts.forEachChild(n, visit);
	};
	visit(node);

	return count;
};

const treeSize = (tree) => (tree ? (tree.tag === "fragment" || tree.tag === "children" ? 0 : 1) + (tree.children || []).reduce((sum, child) => sum + treeSize(child), 0) : 0);

const parseParts = (fileAbs, canonicalNames, opts) => {
	useConfig(opts);
	const sf = sourceFileOf(fileAbs);
	const bodies = localComponentBodies(sf);
	const names = canonicalNames || new Set();
	const out = [];
	for (const decl of iterateDeclarations(sf)) {
		if (!hasComponentMarkup(decl.body)) continue;
		const root = firstComponentNodeIn(decl.body);
		const visit = (n) => {
			if (n !== root && isJsxNode(n)) {
				const size = jsxCount(n);
				if (size >= MIN_PART_NODES && size <= MAX_PART_NODES) {
					const tree = buildTree(n, sf, { bodies, depth: 0, nodes: 0, props: {}, styledResolver: opts.styledResolver, resolveTag: (name, props) => resolveTag(name, fileAbs, 0, props, opts.styledResolver) });
					if (tree && treeSize(tree) >= MIN_PART_NODES) {
						const rootTag = tagOf(openingOf(n).tagName);
						const a11y = new Set();
						gatherA11y(n, sf, a11y);
						const start = sf.getLineAndCharacterOfPosition(n.getStart(sf));
						const end = sf.getLineAndCharacterOfPosition(n.getEnd());
						out.push({
							name: `part@${start.line + 1}`,
							owner: decl.name,
							rootTag,
							line: start.line + 1,
							column: start.character,
							endLine: end.line + 1,
							tree,
							rootTags: [rootTag],
							a11y: [...a11y].sort(),						partial: true,							usesCanonical: names.size > 0 ? [...new Set([...canonicalTagsUsed(n, names), ...viaNames(tree, names)])].sort() : [],
						});
					}
				}
			}
			ts.forEachChild(n, visit);
		};
		visit(decl.body);
	}

	return out;
};

const declaredPropsOf = (node, sf) => {
	let fn = null;
	if (ts.isFunctionDeclaration(node)) fn = node;
	else if (ts.isVariableStatement(node)) {
		for (const d of node.declarationList.declarations) {
			const init = d.initializer;
			if (init && (ts.isArrowFunction(init) || ts.isFunctionExpression(init))) fn = init;
			break;
		}
	}
	if (!fn || !fn.parameters || fn.parameters.length === 0) return [];
	const param = fn.parameters[0];
	const out = [];
	const visit = (n) => {
		if (!n) return;
		if (ts.isObjectBindingPattern(n)) {
			for (const el of n.elements) {
				if (ts.isIdentifier(el.name)) out.push(el.name.text);
				else visit(el.name);
			}
		}
	};
	if (ts.isObjectBindingPattern(param.name)) visit(param.name);
	return [...new Set(out)].sort();
};

const parseComponents = (fileAbs, canonicalNames, opts) => {
	useConfig(opts);
	const source = fs.readFileSync(fileAbs, "utf8");
	const kind = fileAbs.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
	const sf = ts.createSourceFile(fileAbs, source, ts.ScriptTarget.ES2020, true, kind);
	const canonNameSet = canonicalNames || new Set();
	const bodies = localComponentBodies(sf);
	const out = [];
	let decls = iterateDeclarations(sf);
	if (decls.length === 0 && hasComponentMarkup(sf)) {
		const base = path.basename(fileAbs, path.extname(fileAbs));
		const name = base
			.split(/[-_ ]+/)
			.filter(Boolean)
			.map((w) => w[0].toUpperCase() + w.slice(1))
			.join("");
		decls = [{ name, body: sf, node: sf }];
	}
	for (const d of decls) {
		if (!hasComponentMarkup(d.body)) continue;
		const root = firstComponentNodeIn(d.body);
		const tree = root ? buildTree(root, sf, { bodies, depth: 0, nodes: 0, styledResolver: opts.styledResolver, resolveTag: (tag, props) => resolveTag(tag, fileAbs, 0, props, opts.styledResolver) }) : null;
		const rawTree = root ? buildTree(root, sf, { bodies, depth: 0, nodes: 0, noUnfold: true }) : null;
		const a11y = new Set();
		gatherA11y(d.body, sf, a11y);
		out.push({
			name: d.name,
			line: sf.getLineAndCharacterOfPosition(d.node.getStart(sf)).line + 1,
			isExported: isExported(d.node, sf) || localExportNames(sf).has(d.name),
			declProps: declaredPropsOf(d.node, sf),
			tree,
			rawTree,
			rootTags: [...rootTagsOf(d.body, sf)].sort(),
			actions: [],
			a11y: [...a11y].sort(),
			usesCanonical: canonNameSet.size > 0 ? [...new Set([...canonicalTagsUsed(d.body, canonNameSet), ...viaNames(tree, canonNameSet)])].sort() : [],
		});
	}
	return out;
};

let JSDOM = null;

const loadJSDOM = () => {
	if (JSDOM) return JSDOM;
	try {
		JSDOM = require("jsdom").JSDOM;
	} catch {
		JSDOM = null;
	}
	return JSDOM;
};

const buildDom = (tree, doc) => {
	if (!tree) return null;
	if (tree.tag === "fragment" || tree.tag === "children") {
		const holder = doc.createElement("cu-root");
		for (const child of tree.children || []) {
			const node = buildDom(child, doc);
			if (node) holder.appendChild(node);
		}
		return holder;
	}
	const tag = String(tree.tag || "").toLowerCase();
	const el = isHtmlTag(tag) ? doc.createElement(tag) : doc.createElement("cu-root");
	if (!isHtmlTag(tag)) el.__cuTag = String(tree.tag);
	for (const [key, value] of entries(tree.attrs || {})) {
		if (value === true) el.setAttribute(key, "");
		else if (value !== null && value !== undefined) el.setAttribute(key, String(value));
	}
	if (tree.className) el.className = tree.className;
	if (tree.style) {
		for (const [prop, values] of entries(tree.style)) el.style.setProperty(prop, Array.isArray(values) ? values.join(" ") : String(values));
	}
	for (const child of tree.children || []) {
		if (child.tag === "text") {
			el.appendChild(doc.createTextNode(child.text || ""));
			continue;
		}
		const node = buildDom(child, doc);
		if (node) el.appendChild(node);
	}
	return el;
};;

const nodesOf = (el, win, baselineOf) => {
	const kids = [...el.children].flatMap((child) => nodesOf(child, win, baselineOf));
	const compTag = el.tagName === "CU-ROOT" ? el.__cuTag || null : null;
	if (el.tagName === "CU-ROOT" && !compTag) return kids;
	const computed = win.getComputedStyle(el);
	const base = baselineOf(el);
	const css = {};
	for (const prop of style.LAYOUT_PROPS) {
		const value = computed.getPropertyValue(prop).trim();
		if (value && value !== base.getPropertyValue(prop).trim()) css[prop] = value;
	}
	const tag = compTag || el.tagName.toLowerCase();
	const interactive = INTERACTIVE_TAGS.has(tag) || el.getAttribute("role") === "button" || el.getAttribute("role") === "link" || [...el.attributes].some((attr) => /^(on|@)/.test(attr.name));
	const text = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.nodeValue).join("").replace(/\s+/g, " ").trim();

	return [{ tag, css, interactive, text: text || undefined, children: kids }];
};

let sharedDom = null;

const sharedDocument = (Cls) => {
	if (!sharedDom) {
		const dom = new Cls("<!DOCTYPE html><html><head><style></style></head><body></body></html>");
		sharedDom = { window: dom.window, doc: dom.window.document, style: dom.window.document.querySelector("style") };
	}

	return sharedDom;
};

const render = (tree, extra) => {
	const Cls = loadJSDOM();
	if (!Cls || !tree) return { tree: null, available: false };
	const stylesheet = (extra && extra.stylesheet) || "";
	const { window, doc, style: styleEl } = sharedDocument(Cls);
	styleEl.textContent = stylesheet;
	doc.body.replaceChildren();
	const built = buildDom(tree, doc);
	if (!built) return { tree: null, available: false };
	doc.body.appendChild(built);
	const baselines = new Map();
	const baselineOf = (el) => {
		const tag = el.tagName.toLowerCase();
		if (!baselines.has(tag)) {
			const bare = doc.createElement(tag);
			doc.body.appendChild(bare);
			baselines.set(tag, window.getComputedStyle(bare));
		}
		return baselines.get(tag);
	};
	let nodes;
	try {
		nodes = nodesOf(built, window, baselineOf);
	} finally {
		doc.body.replaceChildren();
	}

	return { tree: nodes.length === 1 ? nodes[0] : { tag: "fragment", css: {}, children: nodes }, available: true };
};

const resolveCss = (css, unresolved, ctx) => {
	return { css, unresolved };
};

module.exports = {
	parseComponents,
	parseElements,
	parseParts,
	render,
	resolveCss,
	available: () => !!loadJSDOM(),
};
