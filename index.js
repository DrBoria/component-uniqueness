"use strict";

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
				},
				additionalProperties: false,
			},
		],
	},
	create(rawContext) {
		
		const rawOptions = rawContext.options ?? [];
		const opts = (Array.isArray(rawOptions) ? rawOptions[0] : rawOptions) || {};
		const config = normalizeOptions(opts);
		const context = applyDebt(rawContext, config.debt, "md/react-component-uniqueness");

		const registry = loadRegistry(config);
		const names = (registry && registry.names) || {};
		const catalog = loadCatalog(config);
		let catalogComponents = (catalog && catalog.components) || [];

		
		
		
		
		
		let dynTagMap = null;
		if (config.includeDynamic) {
			const dyn = loadDynamicCatalog(config);
			const dynComponents = (dyn && dyn.components) || [];
			if (dynComponents.length) {
				
				
				
				
				
				
				
				const seen = new Set(catalogComponents.map((c) => c.path));
				
				
				
				
				const dynAdded = dynComponents.filter((c) => !seen.has(c.path)).map((c) => ({ ...c, __dyn: true }));
				catalogComponents = [...catalogComponents, ...dynAdded];
				
				
				
				
				dynTagMap = new Map(dynComponents.map((c) => [c.comp || c.origTag, c]));
			}
		}

		const filePath = (rawContext.getFilename ? rawContext.getFilename() : rawContext.filename) || "";
		const abs = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);
		const root = findRepoRoot(path.dirname(abs)) || config.root;
		const relPath = root ? path.relative(root, abs).split(path.sep).join("/") : "";
		const fileDir = path.dirname(abs);

		
		if (relPath && isIgnored(relPath, config.include, config.exclude)) return {};

		
		
		
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
				
				
				
				
				
				
				const isComponentTag = /^[A-Z]/.test(sourceTag);
				const dynEntry = dynTagMap && isComponentTag && dynTagMap.has(sourceTag) ? dynTagMap.get(sourceTag) : null;
				const tag = dynEntry && dynEntry.tag ? dynEntry.tag : sourceTag;
				
				
				
				
				
				
				const isRawSource = !dynEntry;
				
				
				
				
				
				
				
				
				
				
				const isCanonicalRef = isComponentTag && Object.prototype.hasOwnProperty.call(names, sourceTag);
				
				
				
				const scope = rawContext.sourceCode.getScope(node);
				const hit = isCanonicalRef ? null : layoutHandler.matchCatalog(tag, node, scope, dynEntry);
				if (hit && hit.level === "error") {
					context.report({
						node,
						messageId: "catalogDuplicate",
						data: { tag, what: hit.name, path: hit.path, reason: hit.reason },
					});
					return; 
				}
				const similarHit = hit; 
				
				
				
				
				
				
				
				
				
				const reported = isRawSource && rawHandler.handleRaw(tag, node);
				
				
				
				
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
