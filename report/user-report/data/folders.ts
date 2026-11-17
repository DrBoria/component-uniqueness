"use strict";

import { KIND_LIST } from "../../../constants";

// The report BY FOLDER. Findings are rolled up into the directory tree they live
// in — every folder carries the count of each kind of finding BELOW it. Only the
// LOCAL (app) side counts here: the canonical component is the answer, not the
// problem.

const emptyCounts = () => Object.fromEntries([...KIND_LIST.map((k) => [k, 0]), ["total", 0]]);

const dirOf = (relPath) => {
	const clean = String(relPath ?? "").replace(/\\/g, "/");
	const idx = clean.lastIndexOf("/");

	return idx === -1 ? "." : clean.slice(0, idx) || ".";
};

const makeNode = (dirPath) => ({
	path: dirPath,
	name: dirPath === "." ? "(root)" : dirPath.split("/").pop(),
	depth: dirPath === "." ? 0 : dirPath.split("/").length,
	counts: emptyCounts(),
	childDirs: new Map(),
	children: [],
	findings: [],
});

const ensureNode = (tree, dirPath) => {
	if (!dirPath || dirPath === ".") return tree;
	const parts = dirPath.split("/");
	let node = tree;
	let walked = "";
	for (const part of parts) {
		walked = walked ? `${walked}/${part}` : part;
		if (!node.childDirs.has(walked)) node.childDirs.set(walked, makeNode(walked));
		node = node.childDirs.get(walked);
	}

	return node;
};

const bump = (tree, dirPath, kind) => {
	if (tree.counts[kind] != null) tree.counts[kind] += 1;
	tree.counts.total += 1;
	let walked = "";
	for (const part of String(dirPath).split("/").filter((p) => p && p !== ".")) {
		walked = walked ? `${walked}/${part}` : part;
		const node = ensureNode(tree, walked);
		if (node.counts[kind] != null) node.counts[kind] += 1;
		node.counts.total += 1;
	}
};

const finalize = (node) => ({
	path: node.path,
	name: node.name,
	depth: node.depth,
	counts: node.counts,
	findings: node.findings,
	children: [...node.childDirs.values()].sort((a, b) => a.path.localeCompare(b.path)).map(finalize),
});

const buildFolders = (findings) => {
	const tree = makeNode(".");

	for (const finding of findings) {
		const dirPath = dirOf(finding.left?.path);
		const node = ensureNode(tree, dirPath);
		node.findings.push(finding.id);
		bump(tree, dirPath, finding.kind);
	}

	const root = finalize(tree);
	const isEmpty = (node) => node.counts.total === 0 && node.children.every(isEmpty);
	const walk = (node) => (isEmpty(node) ? null : { ...node, children: node.children.map(walk).filter(Boolean) });

	return walk(root) ?? { ...root, children: [] };
};

export {  buildFolders, dirOf  };