"use strict";

/**
 * @md-code/react-component-uniqueness
 *
 * One component = one canonical location. Four error types:
 *
 * 1. DUPLICATE DECLARATION (messageId: duplicateComponent)
 *    The component registry maps every canonical component name to the list
 *    of directories where that name is allowed to be declared. Declaring a
 *    registry name outside its canonical directories is a duplicate.
 *    (errorTypes/duplicate-component.js)
 *
 * 2. RAW HTML (messageId: rawHtml)
 *    Raw interactive / form elements are only legal inside the canonical
 *    packages — that is where the canonical components are built from them.
 *    (errorTypes/raw-html.js)
 *
 * 3. HAND-ROLLED COMPONENTS BY BEHAVIOR (messageId: layoutPrimitive) +
 *    CATALOG MATCH (messageId: catalogDuplicate / similarComponent)
 *    An element that behaves like a canonical component (container, card,
 *    modal, dropdown, tabs, slider, tooltip, ...) is a duplicate and is
 *    reported everywhere. The element's Signature is also matched against
 *    the component catalog (decision matrix).
 *    (errorTypes/layout-primitive.js)
 *
 * 4. STYLED IN APP (messageId: styledInApp)
 *    styled.<htmlTag> created outside the canonical packages is UI built in
 *    the app. (errorTypes/styled-in-app.js)
 *
 * The rule is TOTAL. Legacy findings go to the debt ledger (shrink-only).
 *
 * Options:
 *   - registry: object — { names: { Name: [dir, ...] }, known: {...} }.
 *     Inlined registry (takes precedence over registryPath).
 *   - registryPath: string — repo-relative (or absolute) path to the
 *     registry JSON. Default: "reports/component-registry.json".
 *   - catalog: object — { components: [...] }. Inlined catalog.
 *   - catalogPath: string — path to the catalog JSON.
 *     Default: "reports/component-catalog.json".
 *   - includeDynamic: boolean — when true, also match against the dynamic
 *     catalog (signatures captured from a real rendered DOM, covering styles
 *     invisible statically: MUI emotion/sx, antd cssinjs). Default: false.
 *   - dynamicCatalog: object — inlined dynamic catalog.
 *   - dynamicCatalogPath: string — path to the dynamic catalog JSON.
 *     Default: "reports/component-catalog-dynamic.json".
 *   - rawElements: string[] — tags flagged by the raw-html error type.
 *   - behaviorTags: string[] — tags eligible for behavior analysis.
 *   - componentsFolder: string[] — the canonical home of every reusable
 *     component. Raw HTML / styled.* are legal only inside these folders
 *     (error types 2 and 4 stay silent there); the catalog is generated from
 *     them and the duplicate report clusters them. Trailing slashes are
 *     optional. NO DEFAULT: the canonical layout is the consumer's knowledge
 *     (pass it in the ESLint rule options). Empty list = every file is
 *     treated as outside the component folders.
 *   - include: (string|RegExp)[] — files to lint (minimatch globs or
 *     regexes). Empty (default) = every file not excluded.
 *   - exclude: (string|RegExp)[] — files to skip (minimatch globs or
 *     regexes). Default: node_modules / dist / build / .git.
 *   - debt: object — debt ledger ("relpath::ruleId" -> count). Findings
 *     recorded in the ledger are not reported (shrink-only).
 */

const path = require("node:path");

const { normalizeOptions, inComponentsFolder: inComponentsFolderOf, isIgnored } = require("./config");
const { applyDebt, findRepoRoot } = require("./debt");
const { loadRegistry, loadCatalog, loadDynamicCatalog } = require("./loaders");
const duplicateComponentErrorType = require("./errorTypes/duplicate-component");
const rawHtmlErrorType = require("./errorTypes/raw-html");
const layoutPrimitiveErrorType = require("./errorTypes/layout-primitive");
const styledInAppErrorType = require("./errorTypes/styled-in-app");

module.exports = {
	meta: {
		type: "problem",
		docs: {
			description:
				"component names are unique and components are not hand-rolled: a canonical component may only be declared in its registry directory, raw interactive HTML is only legal inside the canonical packages, and an element that behaves like a canonical component (container, card, modal, dropdown, tabs, slider, tooltip, ...) is a duplicate everywhere",
		},
		messages: {
			duplicateComponent:
				"Duplicate declaration of canonical component '{{name}}'. Canonical location: {{dirs}}. Use the canonical component instead of re-declaring it.",
			rawHtml: "Raw <{{tag}}> outside the canonical packages → replace with `{{component}}` from {{path}}.",
			layoutPrimitive: "Hand-rolled {{what}} built from <{{tag}}> → replace with `{{component}}` from {{path}}.",
			styledInApp: "styled.{{tag}} created outside the canonical packages → move it as `{{component}}` into {{path}}.",
			catalogDuplicate: "Element <{{tag}}> duplicates {{what}} ({{path}}): {{reason}}. Use the canonical component instead.",
			similarComponent: "Element <{{tag}}> is similar to {{what}} ({{path}}): {{reason}}. Consider using the canonical component.",
		},
		schema: [
			{
				type: "object",
				properties: {
					registry: { type: "object" },
					registryPath: { type: "string" },
					catalog: { type: "object" },
					catalogPath: { type: "string" },
					includeDynamic: { type: "boolean" },
					dynamicCatalog: { type: "object" },
					dynamicCatalogPath: { type: "string" },
					rawElements: { type: "array", items: { type: "string" } },
					behaviorTags: { type: "array", items: { type: "string" } },
					componentsFolder: {
						type: "array",
						items: {
							anyOf: [
								{ type: "string" },
								{
									type: "object",
									properties: {
										path: { type: "string" },
										rank: { type: "number" },
									},
									required: ["path"],
								},
							],
						},
					},
				include: { type: "array", items: { type: "string" } },
				exclude: { type: "array", items: { type: "string" } },
					debt: { type: "object" },
					thresholds: { type: "object" },
				},
				additionalProperties: false,
			},
		],
	},
	create(rawContext) {
		// ESLint 9: rule options live on the context, not as a second create arg.
		const rawOptions = rawContext.options ?? [];
		const opts = (Array.isArray(rawOptions) ? rawOptions[0] : rawOptions) || {};
		const config = normalizeOptions(opts);
		const context = applyDebt(rawContext, config.debt, "md-code/react-component-uniqueness");

		const registry = loadRegistry(config);
		const names = (registry && registry.names) || {};
		const catalog = loadCatalog(config);
		let catalogComponents = (catalog && catalog.components) || [];

		// includeDynamic: merge the rendered-DOM catalog (MUI sx / antd
		// cssinjs styles, invisible statically) into the static catalog, and
		// build the tagMap: a component tag (e.g. "MuiBtn") -> the rendered
		// DOM tag ("button"), so a wrapper built on a library component is
		// matched against the catalog with its REAL tag + runtime styles.
		let dynTagMap = null;
		if (config.includeDynamic) {
			const dyn = loadDynamicCatalog(config);
			const dynComponents = (dyn && dyn.components) || [];
			if (dynComponents.length) {
				// Entry shape: { name, path, comp (JSX tag / import alias used in the
				// source, e.g. "Bn"), tag (rendered DOM tag, e.g. "button"), styles,
				// actions, a11y, data }.
				// Dedupe by PATH: a file already in the static catalog keeps its
				// static entry (the static catalog is the source of truth for
				// canonical files); dynamic entries only ADD files the static pass
				// could not fully see (library wrappers in app folders).
				const seen = new Set(catalogComponents.map((c) => c.path));
				// Mark the added app-wrapper entries so matchCatalog can drop
				// them when linting a canonical file (a canonical component is
				// the source of truth and must not be a "duplicate" of an app
				// wrapper).
				const dynAdded = dynComponents.filter((c) => !seen.has(c.path)).map((c) => ({ ...c, __dyn: true }));
				catalogComponents = [...catalogComponents, ...dynAdded];
				// JSX tag -> rendered-DOM entry. Several wrappers may share one
				// library tag (MuiButton x3); they render the same DOM + styles, so
				// a last-wins collision is harmless (actions are NOT merged — see
				// layout-primitive.js).
				dynTagMap = new Map(dynComponents.map((c) => [c.comp || c.origTag, c]));
			}
		}

		const filePath = (rawContext.getFilename ? rawContext.getFilename() : rawContext.filename) || "";
		const abs = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);
		const root = findRepoRoot(path.dirname(abs)) || config.root;
		const relPath = root ? path.relative(root, abs).split(path.sep).join("/") : "";
		const fileDir = path.dirname(abs);

		// include/exclude file filters (minimatch globs or regexes).
		if (relPath && isIgnored(relPath, config.include, config.exclude)) return {};

		// Inside the component folders = inside the canonical home of
		// components. Raw HTML / styled.* are legal there (error types 2 and 4
		// stay silent); behavior and catalog checks run everywhere.
		const inComponentsFolder = inComponentsFolderOf(relPath, config.componentsFolder);

		const env = {
			context,
			names,
			relPath,
			fileDir,
			inComponentsFolder,
			rawElements: config.rawElements,
			behaviorTags: config.behaviorTags,
			catalogComponents,
			registry,
			componentsFolder: config.componentsFolder,
		};

		const dupHandler = duplicateComponentErrorType.createHandler(env);
		const rawHandler = rawHtmlErrorType.createHandler(env);
		const layoutHandler = layoutPrimitiveErrorType.createHandler(env);
		const styledHandler = styledInAppErrorType.createHandler(env);

		return {
			VariableDeclarator(node) {
				dupHandler.VariableDeclarator(node);
				styledHandler.VariableDeclarator(node);
			},
			ExportNamedDeclaration(node) {
				dupHandler.ExportNamedDeclaration(node);
			},
			ExportDefaultDeclaration(node) {
				dupHandler.ExportDefaultDeclaration(node);
			},
			JSXOpeningElement(node) {
				if (node.name.type !== "JSXIdentifier") return;
				const sourceTag = node.name.name;
				// includeDynamic: a CAPITALIZED tag that the playground
				// rendered (e.g. a MUI/antd wrapper) is resolved to its real
				// DOM tag, and the signature is enriched with the runtime
				// styles the library applies (emotion/sx, cssinjs). Raw HTML
				// tags (div, button, ...) are already DOM tags — they are never
				// resolved, so their rawHtml / behavior analysis still runs.
				const isComponentTag = /^[A-Z]/.test(sourceTag);
				const dynEntry = dynTagMap && isComponentTag && dynTagMap.has(sourceTag) ? dynTagMap.get(sourceTag) : null;
				const tag = dynEntry && dynEntry.tag ? dynEntry.tag : sourceTag;
				// rawHtml and the behavior (layout-primitive) checks are
				// SOURCE-level: a capitalized component resolved to a DOM tag
				// via includeDynamic is not a raw element in the source, so it
				// must not be reported as "Raw <button>" or a hand-rolled
				// primitive. Static mode is unaffected (dynTagMap empty →
				// isRawSource always true).
				const isRawSource = !dynEntry;
				// A JSX tag that is a REGISTRY CANONICAL NAME (e.g. <Button>,
				// <Select>, <Input>) is a REFERENCE to the canonical component,
				// not a hand-rolled re-implementation. Its declaration-site
				// duplicate (a second `export const Button = ...`) is caught by
				// the separate duplicateComponent error type. So a catalog
				// match against such a tag is a false positive — the element is
				// legitimately USING the canonical component. Skip the
				// error-tier catalog verdict for registry names. Fixture tags
				// (MuiButton, AntButton, Bn, ...) are NOT registry names, so
				// they are still matched and flagged.
				const isCanonicalRef = isComponentTag && Object.prototype.hasOwnProperty.call(names, sourceTag);
				// Error type 3b: catalog match (decision matrix) — applies to
				// every element, reported everywhere, including inside the
				// canonical packages.
				const scope = rawContext.sourceCode.getScope(node);
				const hit = isCanonicalRef ? null : layoutHandler.matchCatalog(tag, node, scope, dynEntry);
				if (hit && hit.level === "error") {
					context.report({
						node,
						messageId: "catalogDuplicate",
						data: { tag, what: hit.name, path: hit.path, reason: hit.reason },
					});
					return; // an error-tier catalog verdict supersedes the other error types
				}
				const similarHit = hit; // warning tier — reported below, non-authoritative
				// NOTE: the old single-signal "behavior" check (layoutHandler.
				// handleElement: div+onClick = "button", flex = "container",
				// fixed+z-1000 = "modal") is DISABLED. It guessed a role from
				// ONE sign without comparing anything, and produced noise
				// (every flex-div = "container"). The agreed design is the
				// 4-category comparison (tag, a11y, actions, styles) against
				// the catalog — matchCatalog above — which catches real
				// hand-rolled components when they actually look like a
				// canonical one.
				const reported = isRawSource && rawHandler.handleRaw(tag, node);
				// Warning tier: report-only hint, never fails the gate
				// (gen-lint-debt.mjs excludes similarComponent findings).
				// Reported everywhere — a similar-looking element inside the
				// component folders is still a hint worth surfacing.
				if (!reported && similarHit) {
					context.report({
						node,
						messageId: "similarComponent",
						data: { tag, what: similarHit.name, path: similarHit.path, reason: similarHit.reason },
					});
				}
			},
		};
	},
};
