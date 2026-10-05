"use strict";

const path = require("node:path");

const {
	normalizeOptions,
	inComponentsFolder,
	canSeeCanon,
	isIgnored,
	loadRegistry,
	loadCatalog,
	RULE_NAME,
	RULE_SHORT,
} = require("./config");
const { parseComponents, parseElements } = require("./playgrounds/framework-entrypoint.js");
const { buildCandidate, buildElementCandidate } = require("./normalize/candidate.js");
const { matchSignals } = require("./matcher");
const { getFrameworkMatcher } = require("./matcher/framework");
const { decide, bestOf } = require("./decision-maker");
const { matchPairs, applyFilters, findParts } = require("./main");

const frameworkMatcher = getFrameworkMatcher("react");

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
};

const createRule = () => {
	return {
		meta: {
			type: "problem",
			docs: {
				description: "Flag components that duplicate a canonical component, and raw HTML elements that should use the canonical packages.",
			},
			messages: {
				duplicateComponent: "Component \"{{name}}\" duplicates the canonical \"{{canonName}}\" ({{reason}}).",
				rawHtml: "Raw <{{tag}}> outside the canonical packages → replace with `{{component}}` from {{path}} ({{reason}}).",
				partOfComponent: "This <{{tag}}> block in {{owner}} duplicates `{{component}}` from {{path}} ({{reason}}).",
			},
			schema: [
				{
					type: "object",
					properties: {
						registry: { type: "string" },
						registryPath: { type: "string" },
						catalog: { type: "array" },
						catalogPath: { type: "string" },
						includeDynamic: { type: "boolean" },
						dynamicCatalog: { type: "array" },
						dynamicCatalogPath: { type: "string" },
						rawHtml: { type: "boolean" },
						parts: { type: "boolean" },
						tsconfig: { type: "string" },
						weights: { type: "object" },
						thresholds: { type: "object" },
						componentsFolder: { type: "array" },
						include: { type: "array" },
						exclude: { type: "array" },
						exts: { type: "array" },
						ignoreDirs: { type: "array" },
						rootMarkers: { type: "array" },
					},
					additionalProperties: false,
				},
			],
		},
		create(context) {
			const options = context.options && context.options[0] ? context.options[0] : {};
			const config = normalizeOptions(options);
			const filename = context.filename || (context.getFilename ? context.getFilename() : "");
			const relPath = path.relative(context.cwd || process.cwd(), filename).split(path.sep).join("/");

			const isInComponentsFolder = inComponentsFolder(relPath, config.componentsFolder);
			if (isIgnored(relPath, isInComponentsFolder ? [] : config.include, config.exclude)) return {};

			const registry = loadRegistry(config);
			const catalogComponents = ((loadCatalog(config) || {}).components) || [];
			const canonNames = [...new Set(catalogComponents.map((c) => c.name))];

			const checkDuplicates = () => {
				let parsed;
				try {
					parsed = parseComponents(filename, canonNames, config);
				} catch {
					return;
				}
				const normalizeComp = (comp) => buildCandidate(comp, config);

				const normCanons = new Map();
				for (const comp of parsed) {
					if (!comp.isExported) continue;
					const candidate = normalizeComp({ ...comp, path: relPath });
					const pairs = [];
					for (const canon of catalogComponents) {
						if (canon.name === candidate.name) continue;
						if (!canSeeCanon(relPath, canon.path, config.componentsFolder)) continue;
						let normCanon = normCanons.get(canon.name);
						if (!normCanon) {
							normCanon = normalizeComp(canon);
							normCanons.set(canon.name, normCanon);
						}
						const signals = matchSignals(candidate, normCanon, { canonNames, frameworkMatcher });
						const decision = decide(candidate, normCanon, { signals, weights: config.weights, thresholds: config.thresholds });
						pairs.push({ canon: normCanon, signals, decision });
					}
					pairs.sort((a, b) => b.decision.confidence - a.decision.confidence);
					for (const p of pairs) {
						if (!p.decision.isDuplicate) continue;
						const { kept } = applyFilters([{ app: candidate, canon: p.canon, decision: p.decision, tier: p.decision.tier, reason: p.decision.reason }]);
						if (kept.length === 0) continue;
						const line = comp.line || 1;
						context.report({
							loc: { start: { line, column: 0 }, end: { line, column: 0 } },
							messageId: "duplicateComponent",
							data: { name: candidate.name, canonName: p.canon.name, reason: p.decision.reason },
						});
					}
				}
				if (config.rawHtml && !isInComponentsFolder) {
					const canons = catalogComponents.map((canon) => {
						if (!normCanons.has(canon.name)) normCanons.set(canon.name, normalizeComp(canon));

						return normCanons.get(canon.name);
					});
					let elements = [];
					try {
						elements = parseElements(filename, canonNames, config);
					} catch {
						elements = [];
					}
					for (const element of elements) {
						const candidate = buildElementCandidate(element, config);
						if (!candidate) continue;
						const best = bestOf(matchPairs([{ ...candidate, path: relPath }], canons, config));
						if (!best) continue;
						context.report({
							loc: { start: { line: element.line, column: element.column }, end: { line: element.line, column: element.column } },
							messageId: "rawHtml",
							data: { tag: element.name, component: best.canon.name, path: best.canon.path, reason: best.decision.reason },
						});
					}
				}
				if (config.parts) {
					const canons = catalogComponents.map((canon) => {
						if (!normCanons.has(canon.name)) normCanons.set(canon.name, normalizeComp(canon));

						return normCanons.get(canon.name);
					});
					for (const { part, best } of findParts(filename, relPath, canons, config, new Set(canonNames))) {
						context.report({
							loc: { start: { line: part.line, column: part.column }, end: { line: part.endLine, column: 0 } },
							messageId: "partOfComponent",
							data: { owner: part.owner, tag: part.rootTag, component: best.canon.name, path: best.canon.path, reason: best.decision.reason },
						});
					}
				}
			};

			return {
				"Program:exit": checkDuplicates,
			};
		},
	};
};

module.exports = createRule();
module.exports.RULE_NAME = RULE_NAME;
module.exports.RULE_SHORT = RULE_SHORT;
