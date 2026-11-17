"use strict";

// ── THE SNAPSHOT: what the component BECOMES, and what a screen reader SEES ──
//
// The MODEL states facts only. A component is written as framework tags
// (`Button`, `Field`); the framework expands each into real HTML
// (`button > span + Icon`). This module flattens that expanded tree into rows the
// board can draw, and keeps two facts per row:
//
//   • the HTML snapshot — the tag the framework rendered, indented by depth, with
//     the component it came FROM (`via`) so the reader sees `Button → button`;
//   • the screen-reader view — only what assistive technology announces: a role,
//     an accessible name, a state. A `div` with no role and no name is silent.
//
// Every row carries the CODE LINE the parser reported for it (no text search, so
// a row never anchors on a comment or a parameter), the CSS the framework
// resolved, and what a screen reader announces. No character range is computed
// here — the view (code-diff) locates names and paints marks.

const isContainer = (tag) => tag === "fragment" || tag === "children";
const isText = (tag) => tag === "text";

// The accessible name a screen reader announces for one node: an explicit
// aria-label, the text it wraps, or the alt/title fallback. Empty = silent.
const accessibleNameOf = (node) => {
	const attrs = node.attrs || {};
	if (attrs["aria-label"]) return String(attrs["aria-label"]);
	if (attrs["aria-labelledby"]) return `labelled by ${attrs["aria-labelledby"]}`;
	if (attrs.alt) return String(attrs.alt);
	if (attrs.title) return String(attrs.title);
	const text = (node.children || [])
		.filter((child) => isText(child.tag))
		.map((child) => String(child.text || "").trim())
		.filter(Boolean)
		.join(" ");

	return text || null;
};

// The ARIA states a screen reader reports (expanded / checked / disabled / …).
const STATE_ATTRS = ["aria-expanded", "aria-checked", "aria-selected", "aria-disabled", "aria-hidden", "aria-pressed", "aria-required", "aria-invalid"];
const statesOf = (node) => {
	const attrs = node.attrs || {};
	const out = [];
	for (const name of STATE_ATTRS) {
		if (attrs[name] !== undefined && attrs[name] !== null) out.push(`${name}=${attrs[name]}`);
	}
	if (attrs.disabled === true || attrs.disabled === "true") out.push("disabled");

	return out;
};

// The implicit role of an HTML tag, when it has one a screen reader announces.
const IMPLICIT_ROLE = {
	button: "button",
	a: "link",
	input: "textbox",
	select: "combobox",
	textarea: "textbox",
	img: "img",
	nav: "navigation",
	main: "main",
	header: "banner",
	footer: "contentinfo",
	aside: "complementary",
	form: "form",
	fieldset: "group",
	label: "label",
	h1: "heading",
	h2: "heading",
	h3: "heading",
	h4: "heading",
	h5: "heading",
	h6: "heading",
	ul: "list",
	ol: "list",
	li: "listitem",
	table: "table",
	dialog: "dialog",
};

const roleOf = (node) => {
	const attrs = node.attrs || {};
	if (attrs.role) return String(attrs.role);

	return IMPLICIT_ROLE[String(node.tag || "").toLowerCase()] ?? null;
};

// One snapshot of a component: the HTML rows and the screen-reader rows, each
// addressed by a stable id and pointing at the code line that produced it.
const snapshotOf = (candidate, span) => {
	const tree = candidate?.tree ?? null;
	if (!tree || !span) return null;
	const html = [];
	const reader = [];
	let at = 0;

	// The resolved-CSS tree (dom.tree, same shape) in document order, so each HTML
	// row can carry its computed styles.
	const domQueue = [];
	const collectDom = (n) => {
		if (!n) return;
		if (isContainer(n.tag)) {
			for (const c of n.children || []) collectDom(c);

			return;
		}
		if (isText(n.tag)) return;
		domQueue.push(n);
		for (const c of n.children || []) collectDom(c);
	};
	collectDom(candidate?.dom?.tree ?? null);
	let domAt = 0;

	const walk = (node, depth, via) => {
		if (!node) return;
		if (isContainer(node.tag)) {
			for (const child of node.children || []) walk(child, depth, via);

			return;
		}
		if (isText(node.tag)) return;

		const id = `s${at}`;
		at += 1;
		// The via CHAIN from the root usage down to the producer. The first name is the
		// component the reader wrote in THIS file (`Button`); the rest is the internal
		// expansion path (`Loader`). The code anchor is that root name on the usage line,
		// so a ribbon always reaches a word the reader can see in the code column.
		const chain = node.via && node.via.length > 0 ? node.via : (via || []);
		const fromVia = chain.length > 0 ? chain[chain.length - 1] : null;
		// The code anchor is the ROOT usage name the parser stamped (the component the
		// reader wrote in THIS file), falling back to the chain head / the tag itself.
		const codeName = node.codeName ?? (chain.length > 0 ? chain[0] : node.tag);
		// The parser reported the exact source line of this element's usage. No text
		// search: a row can never land on a comment or a destructured parameter.
		const line = node.line != null ? String(node.line) : null;
		const name = accessibleNameOf(node);
		const role = roleOf(node);
		const states = statesOf(node);
		const testId = node.attrs?.["data-testid"] ?? node.attrs?.["data-test"] ?? null;
		// Computed CSS from the parallel dom tree (same document order).
		const domNode = domQueue[domAt] && domQueue[domAt].tag === node.tag ? domQueue[domAt] : null;
		if (domNode) domAt += 1;
		const css = (domNode && domNode.css) || node.css || {};

		// The HTML row: real tag, with the component the reader WROTE that produced it
		// (the root usage), so `<img> ← Button` reads "this img comes from the Button on
		// line 8" — and hovering lights that same word. The tree INDENT is drawn by the
		// renderer from `depth` (one clear level per nest), not baked into the text, so
		// a parent and its children read as a tree at a glance.
		const viaLabel = codeName && codeName !== node.tag ? `  ← ${codeName}` : "";
		html.push({ id, text: `<${node.tag}>${viaLabel}`, line, tag: node.tag, via: fromVia, viaChain: chain, codeName, codeLine: line, depth, css, role, name });

		// The screen-reader row: only nodes that announce something. A silent
		// container is skipped, but its children are still walked.
		const announces = role || name || states.length > 0 || testId;
		if (announces) {
			const parts = [];
			if (role) parts.push(role);
			if (name) parts.push(`"${name}"`);
			if (states.length > 0) parts.push(states.join(" "));
			if (testId) parts.push(`testid=${testId}`);
			reader.push({ id, text: parts.join(" · "), line, tag: node.tag, via: fromVia, viaChain: chain, codeName, codeLine: line, depth, role, name, states, testId });
		}

		for (const child of node.children || []) walk(child, depth + 1, node.via || via);
	};

	walk(tree, 0, null);

	return { html, reader, available: candidate?.dom?.available !== false };
};

export { snapshotOf, accessibleNameOf, roleOf, statesOf };
