"use strict";

// Fixture config with a deliberately NON-matching `include`: the CLI test
// asserts explicit --app-roots are not filtered out by it. Parser and plugin
// are repo-local (devDependency + built dist/index.js), no workspace escapes.
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
					include: ["tests/NOT_matching/**"],
				},
			],
		},
	},
];
