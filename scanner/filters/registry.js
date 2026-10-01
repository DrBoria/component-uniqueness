"use strict";

const FILTERS = [];

function registerFilter(filter) {
	if (!filter || typeof filter.name !== "string") throw new Error("filter must have a string `name`");
	if (typeof filter.test !== "function") throw new Error(`filter "${filter && filter.name}" must have a test(match) function`);
	FILTERS.push(filter);
	return filter;
}

function applyFilters(matches) {
	const kept = [];
	const dropped = [];
	for (const m of matches) {
		let drop = null;
		for (const f of FILTERS) {
			const reason = f.test(m);
			if (reason) {
				drop = { filter: f.name, reason };
				break;
			}
		}
		if (drop) dropped.push({ match: m, ...drop });
		else kept.push(m);
	}
	return { kept, dropped };
}

module.exports = { FILTERS, registerFilter, applyFilters };
