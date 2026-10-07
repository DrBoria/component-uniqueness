"use strict";

const pascalWords = (s) => String(s || "").replace(/([a-z0-9])([A-Z])/g, "$1 $2").split(/[^A-Za-z0-9]+/).filter(Boolean);

const GENERIC_WORDS = new Set([
	"button",
	"field",
	"input",
	"select",
	"box",
	"list",
	"item",
	"row",
	"cell",
	"icon",
	"label",
	"value",
	"text",
	"data",
	"info",
	"meta",
	"main",
	"base",
	"option",
	"panel",
	"view",
	"form",
	"card",
	"tag",
	"chip",
	"badge",
	"menu",
	"bar",
	"grid",
	"table",
	"section",
	"state",
]);

module.exports = { pascalWords, GENERIC_WORDS };
