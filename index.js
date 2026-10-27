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
const { refreshCatalog } = require("./self-catalog");
const { parseComponents, parseElements, setLiveSource } = require("./playgrounds/framework-entrypoint.js");
const { buildCandidate, buildElementCandidate } = require("./normalize/candidate.js");
const { matchSignals } = require("./matcher");
const { getFrameworkMatcher } = require("./matcher/framework");
const { decide, bestOf } = require("./decision-maker");
const { matchPairs, applyFilters, findParts } = require("./main");
const { buildLibRegistry, fileImportSpecifiers, suggestFromLib } = require("./lib-registry");

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

const normalizedCanons = new WeakMap();

const normalizeCanon = (canon, config) => {
	if (!normalizedCanons.has(canon)) normalizedCanons.set(canon, buildCandidate(canon, config));

	return normalizedCanons.get(canon);
};

const createRule = () => {
	return {
		meta: {
			type: "problem",
			docs: {
				description: "Flag components that duplicate a canonical component, and raw HTML elements that should use the canonical packages.",
			},
			messages: {
				duplicateComponent: "Component \"{{name}}\" duplicates the canonical \"{{canonName}}\" ({{reason}}).{{libHint}}",
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
						compareAll: { type: "boolean" },
						proposeFromLib: {
							type: "boolean",
							description:
								"When a duplicate is found, also check the project's installed dependencies (read dynamically from package.json) for an export with the same name and suggest it in the message. Skipped for libs the file already imports (the local component is likely extending the lib, not duplicating it). Default false.",
						},
						include: { type: "array" },
						exclude: { type: "array" },
						exts: { type: "array" },
						ignoreDirs: { type: "array" },
						rootMarkers: { type: "array" },
						cache: { type: "boolean" },
						root: { type: "string" },
					},
					additionalProperties: false,
				},
			],
		},
		create(context) {
			const options = context.options && context.options[0] ? context.options[0] : {};
			const config = normalizeOptions(options);
			const filename = context.filename || (context.getFilename ? context.getFilename() : "");
			const relPath = path.relative(config.root, filename).split(path.sep).join("/");

			const isInComponentsFolder = inComponentsFolder(relPath, config.componentsFolder);
			if (isIgnored(relPath, isInComponentsFolder ? [] : config.include, config.exclude)) return {};

			const registry = loadRegistry(config);
			// Self-maintain the on-disk catalog (per-file mtime+size cache in
			// os.tmpdir()). Fast path (~0ms) when nothing changed.
			if (config.cache !== false) refreshCatalog(config);
			const catalogComponents = ((loadCatalog(config) || {}).components) || [];
			const canonNames = [...new Set(catalogComponents.map((c) => c.name))];
			// proposeFromLib: inventory of the project's installed dependency
			// exports, so a duplicate report can suggest "use `Accordion` from
			// `radix-ui`". Built lazily once per lint; cached in os.tmpdir()
			// and invalidated when package.json changes.
			let libRegistry = null;
			const libHint = (name, sourceText) => {
				if (!config.proposeFromLib) return "";
				if (!libRegistry) libRegistry = buildLibRegistry(config.root);
				if (libRegistry.size === 0) return "";
				const imports = fileImportSpecifiers(sourceText);
				const suggestions = suggestFromLib(name, libRegistry, imports);
				if (suggestions.length === 0) return "";
				const list = suggestions.map((s) => `\`${s.name}\` from \`${s.lib}\``).join(", ");
				return ` Consider using ${list} instead of a local implementation.`;
			};

			const checkDuplicates = () => {
				let parsed;
				try {
					// Parse the LIVE source (the editor buffer), not the disk
					// state: on save the ESLint extension lints the buffer via
					// lintText, and the file on disk may not match it yet.
					const sourceCode = context.sourceCode || (context.getSourceCode ? context.getSourceCode() : null);
					const liveText = sourceCode === null ? null : typeof sourceCode === "string" ? sourceCode : typeof sourceCode.text === "string" ? sourceCode.text : null;
					if (liveText !== null) setLiveSource(filename, liveText, config);
					parsed = parseComponents(filename, canonNames, config);
				} catch {
					return;
				}
				const normalizeComp = (comp) => buildCandidate(comp, config);

				for (const comp of parsed) {
					if (!comp.isExported) continue;
					const candidate = normalizeComp({ ...comp, path: relPath });
					const pairs = [];
					for (const canon of catalogComponents) {
						if (canon.name === candidate.name) continue;
						if (!canSeeCanon(relPath, canon.path, config.componentsFolder, config.compareAll)) continue;
						const normCanon = normalizeCanon(canon, config);
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
							data: { name: candidate.name, canonName: p.canon.name, reason: p.decision.reason, libHint: libHint(candidate.name, liveText) },
						});
					}
				}
				if (config.rawHtml && !isInComponentsFolder) {
					const canons = catalogComponents.map((canon) => normalizeCanon(canon, config));
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
					const canons = catalogComponents.map((canon) => normalizeCanon(canon, config));
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

const rule = createRule();
const pkg = require("./package.json");

module.exports = {
	meta: {
		name: pkg.name,
		version: pkg.version,
	},
	rules: {
		"component-uniqueness": rule,
	},
};
module.exports.RULE_NAME = RULE_NAME;
module.exports.RULE_SHORT = RULE_SHORT;
