"use strict";

module.exports = [
	{
		rules: {
			"md-code/component-uniqueness": [
				"error",
				{
					componentsFolder: ["tests/components/lib", "tests/components/lib/styled", "tests/components/lib/mui"],
					rawHtml: true,
					parts: true,
					thresholds: { duplicate: 0.55, similar: 0.2 },
					include: ["tests/components/NOT_matching/**"],
				},
			],
		},
	},
];
