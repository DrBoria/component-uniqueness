"use strict";

const parseComponents = () => [];

const resolveCss = () => ({ css: "", unresolved: [] });

module.exports = {
	parseComponents,
	resolveCss,
	available: () => false,
};
