"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { DEFAULT_EXTS, DEFAULT_IGNORE_DIRS } = require("./config");

const walk = (dir, exts = DEFAULT_EXTS, ignoreDirs = DEFAULT_IGNORE_DIRS) => {
	const extSet = new Set(exts);
	const ignoreSet = new Set(ignoreDirs);
	const out = [];
	const visit = (d) => {
		let list;
		try {
			list = fs.readdirSync(d, { withFileTypes: true });
		} catch {
			return;
		}
		for (const entry of list) {
			if (entry.name.startsWith(".") || ignoreSet.has(entry.name)) continue;
			const full = path.join(d, entry.name);
			if (entry.isDirectory()) {
				visit(full);
			} else if ([...extSet].some((e) => entry.name.endsWith(e))) {
				out.push(full);
			}
		}
	};
	visit(dir);
	return out;
};

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
};

const writeCatalog = (outPath, components) => {
	fs.mkdirSync(path.dirname(outPath), { recursive: true });
	fs.writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), components }, null, 2) + "\n", "utf8");
};

const buildDirNameMap = (repoRoot, registryPath) => {
	const map = new Map();
	const regPath = registryPath || path.join(repoRoot, "reports", "component-registry.json");
	if (!fs.existsSync(regPath)) return map;
	try {
		const reg = JSON.parse(fs.readFileSync(regPath, "utf8"));
		for (const [name, dirs] of Object.entries((reg && reg.names) || {})) {
			for (const d of dirs) {
				if (!map.has(d)) map.set(d, name);
			}
		}
	} catch {}
	return map;
};

const componentNameFor = (fileAbs, repoRoot, dirNameMap) => {
	const dir = path.dirname(fileAbs);
	let name = path.basename(fileAbs).replace(/\.[^.]+$/, "");
	const isFileScoped = /^(index|styles|types|constants|utils|hooks|test|stories)$/i.test(name);
	let up = dir;
	if (/^[A-Z][A-Za-z0-9]*$/.test(path.basename(dir)) && isFileScoped) {
		name = path.basename(dir);
	} else {
		for (let i = 0; i < 4; i += 1) {
			const parent = path.dirname(up);
			if (parent === up) break;
			const bn = path.basename(parent);
			if (/^[A-Z][A-Za-z0-9]*$/.test(bn)) {
				up = parent;
				if (isFileScoped) name = bn;
				break;
			}
			up = parent;
		}
	}
	const relDir = path.relative(repoRoot, dir).split(path.sep).join("/");
	const relUp = path.relative(repoRoot, up).split(path.sep).join("/");
	const regName = dirNameMap.get(relDir) || dirNameMap.get(relUp);
	if (regName) name = regName;
	return name;
};

module.exports = { walk, dedupeAndSort, writeCatalog, buildDirNameMap, componentNameFor };
