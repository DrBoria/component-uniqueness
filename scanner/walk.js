"use strict";

const fs = require("node:fs");
const path = require("node:path");

function* walk(dir) {
	let list;
	try {
		list = fs.readdirSync(dir, { withFileTypes: true });
	} catch {
		return;
	}
	for (const entry of list) {
		if (entry.name === "node_modules" || entry.name === "dist" || entry.name.startsWith(".")) continue;
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			yield* walk(full);
		} else if (/\.(tsx?|jsx)$/.test(entry.name)) {
			yield full;
		}
	}
}

module.exports = { walk };
