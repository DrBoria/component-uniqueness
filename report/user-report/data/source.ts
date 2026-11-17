"use strict";

// Reading the two sides of a diff. A span is the real lines of the file at the
// numbers the parser reported, so the viewer shows the code AS THE FILE HAS IT.
// Files are read once per run and kept: a canonical component may be the
// right-hand side of twenty pairs.

import * as fs from "node:fs";

const cache = new Map();

const readLines = (absPath) => {
	if (cache.has(absPath)) return cache.get(absPath);
	let lines = null;
	try {
		lines = fs.readFileSync(absPath, "utf8").split(/\r?\n/);
	} catch {
		lines = null;
	}
	cache.set(absPath, lines);

	return lines;
};

const spanOf = (absPath, startLine, endLine) => {
	const all = readLines(absPath);
	if (!all) return { startLine: startLine ?? 1, endLine: endLine ?? startLine ?? 1, lines: [], missing: true };

	const from = Math.max(1, Number(startLine ?? 1));
	const to = Math.min(all.length, Number(endLine ?? from));
	const lines = [];
	for (let no = from; no <= to; no += 1) lines.push({ no, text: all[no - 1] ?? "" });

	return { startLine: from, endLine: to, lines, missing: false };
};

export {  readLines, spanOf  };