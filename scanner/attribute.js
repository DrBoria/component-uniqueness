"use strict";

const { entries } = require("remeda");

const fs = require("node:fs");
const path = require("node:path");

const buildDirNameMap = (repoRoot, registryPath) => {
	const map = new Map();
	const regPath = registryPath || path.join(repoRoot, "reports", "component-registry.json");
	if (!fs.existsSync(regPath)) return map;
	try {
		const reg = JSON.parse(fs.readFileSync(regPath, "utf8"));
		for (const [name, dirs] of entries((reg && reg.names) || {})) {
			for (const d of dirs) {
				if (!map.has(d)) map.set(d, name);
			}
		}
	} catch {
		
	}
	return map;
}

const componentNameFor = (fileAbs, repoRoot, dirNameMap) => {
	let dir = path.dirname(fileAbs);
	
	
	
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
}

module.exports = { buildDirNameMap, componentNameFor };
