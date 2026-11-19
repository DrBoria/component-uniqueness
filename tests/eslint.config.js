"use strict";

// Fixture config for the CLI/e2e suites. Parser and plugin are repo-local:
// @typescript-eslint/parser is a devDependency of THIS package and the plugin
// is the built dist/index.js — no workspace (../..) or DebugMCP escapes.
const tsParser = require("@typescript-eslint/parser");
const components = require("../dist/index.js");

module.exports = [
	{
		files: ["tests/**/*.{ts,tsx,js,jsx}"],
		languageOptions: {
			parser: tsParser,
			parserOptions: { ecmaFeatures: { jsx: true }, sourceType: "module" },
		},
		plugins: { "md-code": components },
		rules: {
			"md-code/component-uniqueness": [
				"error",
				{
					componentsFolder: ["tests/NOT_duplicates", "tests/NOT_duplicates/styled", "tests/NOT_duplicates/mui"],
					rawHtml: true,
					parts: true,
					thresholds: { duplicate: 0.55, similar: 0.2 },
				},
			],
		},
	},
];
