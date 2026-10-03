"use strict";

const fs = require("node:fs");
const path = require("node:path");

const dedupeAndSort = (components) => {
	const seen = new Set();
	const out = [];
	for (const c of components) {
		const key = JSON.stringify({ n: c.name, ...c });
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(c);
	}
	out.sort((a, b) => (a.name + a.tag + a.path).localeCompare(b.name + b.tag + b.path));
	return out;
}

const writeCatalog = (outPath, components) => {
	fs.mkdirSync(path.dirname(outPath), { recursive: true });
	fs.writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), components }, null, 2) + "\n", "utf8");
}

module.exports = { dedupeAndSort, writeCatalog };
