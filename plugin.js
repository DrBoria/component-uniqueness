"use strict";

const rule = require("./index");
const pkg = require("./package.json");

module.exports = {
	meta: {
		name: pkg.name,
		version: pkg.version,
	},
	rules: {
		"duplicate-component": rule,
	},
};
