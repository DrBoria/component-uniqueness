"use strict";

const react = require("./react.js");

const REGISTRY = {
	react,
};

const getFrameworkMatcher = (framework) => {
	if (!framework) return react;
	const key = String(framework).toLowerCase();
	return REGISTRY[key] || react;
};

module.exports = { getFrameworkMatcher };
