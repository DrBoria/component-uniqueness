"use strict";

const { FILTERS, registerFilter, applyFilters } = require("./registry");

require("./drop-usages");
require("./drop-child-element-matches");

module.exports = { FILTERS, registerFilter, applyFilters };
