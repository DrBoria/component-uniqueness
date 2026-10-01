"use strict";

/**
 * plugin.js
 *
 * ESLint flat-config plugin export. Usage:
 *
 *   const plugin = require("@md-code/react-component-uniqueness/plugin");
 *
 *   export default [
 *     {
 *       plugins: { "md-code": plugin },
 *       rules: { "md-code/react-component-uniqueness": "error" },
 *     },
 *   ];
 */

module.exports = {
	rules: {
		"react-component-uniqueness": require("./index"),
	},
};
