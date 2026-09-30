"use strict";

/**
 * plugin.js
 *
 * ESLint flat-config plugin export. Usage:
 *
 *   const plugin = require("@md/react-component-uniqueness/plugin");
 *
 *   export default [
 *     {
 *       plugins: { "react-component-uniqueness": plugin },
 *       rules: { "react-component-uniqueness/react-component-uniqueness": "error" },
 *     },
 *   ];
 */

module.exports = {
	rules: {
		"react-component-uniqueness": require("./index"),
	},
};
