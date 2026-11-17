"use strict";

// ── ACCESSIBILITY MATCH · what a screen reader ANNOUNCES ────────────────────
//
// Two components are accessibility duplicates when a screen reader announces
// the SAME things: the same roles with the same accessible names and states.
// The comparison is semantic, not a bag of attribute strings:
//
//   • a real <button> and a <div role="button" tabIndex={0}> announce the same
//     role — the implicit role of the tag counts exactly like an explicit one;
//   • the accessible NAME is compared by value: aria-label vs the text the
//     element wraps are the same name when they say the same words;
//   • states are compared by value: aria-pressed="true" ≠ aria-expanded="true",
//     so two pixel-identical toggles that announce different states are NOT
//     accessibility duplicates;
//   • aria-hidden / role="presentation" nodes are silent — they announce nothing
//     and cannot create (or destroy) a correspondence.
//
// The raw token lists (`role:button`, `aria-label:Close`) remain as evidence and
// as the applicability gate for callers that only have the token surface.

const TEST_ID_WEIGHT = 0.5;

const parseToken = (token) => {
	const t = String(token || "").toLowerCase();
	const m = t.match(/^(role|aria-[\w-]+)(?::(.*))?$/);
	if (m) return { name: m[1], value: m[2] || "" };
	return null;
};

const classify = (token) => {
	const t = String(token || "").toLowerCase();
	if (t.startsWith("data-test") || t.startsWith("data-testid") || t.startsWith("data-test-id")) return "testid";
	const p = parseToken(t);
	if (p) return "a11y";
	return null;
};

const tokensOf = (c, kind) => {
	const s = new Set();
	for (const t of c.a11y || []) {
		if (classify(t) === kind) s.add(String(t).toLowerCase());
	}
	return s;
};

const jaccard = (a, b) => {
	if (a.size === 0 || b.size === 0) return 0;
	let inter = 0;
	for (const t of a) if (b.has(t)) inter += 1;
	const union = a.size + b.size - inter;
	return union === 0 ? 0 : inter / union;
};

// ── The semantic surface: one entry per ANNOUNCED node ─────────────────────

const IMPLICIT_ROLE = {
	button: "button",
	a: "link",
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
	option: "option",
	progress: "progressbar",
};

const INPUT_ROLE = {
	button: "button",
	submit: "button",
	reset: "button",
	checkbox: "checkbox",
	radio: "radio",
	range: "slider",
	number: "spinbutton",
	search: "searchbox",
	email: "textbox",
	tel: "textbox",
	url: "textbox",
	password: "textbox",
	text: "textbox",
};

const STATE_ATTRS = ["aria-expanded", "aria-checked", "aria-selected", "aria-disabled", "aria-pressed", "aria-required", "aria-invalid", "aria-current", "aria-level"];

const norm = (v) => String(v ?? "").toLowerCase().replace(/\s+/g, " ").trim();

const roleOf = (node) => {
	const attrs = node.attrs || {};
	if (attrs.role) return norm(attrs.role);
	const tag = String(node.tag || "").toLowerCase();
	if (tag === "input") return INPUT_ROLE[norm(attrs.type) || "text"] || "textbox";
	if (tag === "a") return attrs.href !== undefined ? "link" : null;
	return IMPLICIT_ROLE[tag] ?? null;
};

// The accessible name: aria-label wins, then aria-labelledby (resolved against
// the tree's own ids), then alt/title, then the text the node wraps.
const textOf = (node) =>
	(node.children || [])
		.filter((child) => child.tag === "text")
		.map((child) => String(child.text || "").trim())
		.filter(Boolean)
		.join(" ");

// Tags whose accessible name may come from their CONTENT (ARIA name-from-content).
// A structural container (div / section / dl / li …) is NOT named by the text it
// wraps — only an explicit aria-label / aria-labelledby / title names it. Letting
// containers inherit descendant text invents announcements ("dl named 'amount
// due'") that no screen reader makes.
const NAME_FROM_CONTENT = new Set(["button", "a", "h1", "h2", "h3", "h4", "h5", "h6", "label", "legend", "option", "summary", "figcaption", "caption", "th", "td", "dt", "dd", "p", "span", "strong", "em", "b", "i", "code", "pre", "blockquote", "q", "cite", "abbr", "mark", "small", "sub", "sup", "u", "s", "kbd", "samp", "var", "time", "data", "output", "progress", "meter", "li"]);

const nameOf = (node, byId) => {
	const attrs = node.attrs || {};
	if (attrs["aria-label"]) return norm(attrs["aria-label"]);
	if (attrs["aria-labelledby"]) {
		const ids = String(attrs["aria-labelledby"]).split(/\s+/).filter(Boolean);
		const parts = ids.map((id) => {
			const target = byId.get(id);
			return target ? textOf(target) || nameOf(target, byId) : "";
		}).filter(Boolean);
		if (parts.length > 0) return norm(parts.join(" "));
	}
	if (attrs.alt) return norm(attrs.alt);
	if (attrs.title) return norm(attrs.title);
	const tag = String(node.tag || "").toLowerCase();
	if (!NAME_FROM_CONTENT.has(tag)) return null;
	const wrapped = textOf(node);
	if (wrapped) return norm(wrapped);
	// A control with no text of its own may be named by a descendant (a button
	// wrapping a span, an img with alt inside a link).
	for (const child of node.children || []) {
		if (child.tag === "text" || child.tag === "fragment" || child.tag === "children") continue;
		const inner = nameOf(child, byId);
		if (inner) return inner;
	}
	return null;
};

const statesOf = (node) => {
	const attrs = node.attrs || {};
	const out = [];
	for (const name of STATE_ATTRS) {
		const v = attrs[name];
		if (v !== undefined && v !== null && v !== false) out.push(`${name}=${norm(v) || "true"}`);
	}
	if (attrs.disabled === true || attrs.disabled === "true" || attrs.disabled === "") out.push("disabled=true");
	return out.sort();
};

const isSilent = (node) => {
	const attrs = node.attrs || {};
	return attrs["aria-hidden"] === true || attrs["aria-hidden"] === "true" || norm(attrs.role) === "presentation" || norm(attrs.role) === "none";
};

// Flatten the expanded tree into announced entries: { role, name, states, tag }.
// A silent node announces nothing itself, but its children still do.
const announcementsOf = (tree) => {
	const out = [];
	if (!tree) return out;
	const byId = new Map();
	const index = (n) => {
		if (!n) return;
		if (n.attrs && n.attrs.id) byId.set(String(n.attrs.id), n);
		for (const c of n.children || []) index(c);
	};
	index(tree);
	const walk = (n) => {
		if (!n) return;
		if (n.tag === "fragment" || n.tag === "children") {
			for (const c of n.children || []) walk(c);
			return;
		}
		if (n.tag === "text") return;
		if (!isSilent(n)) {
			const role = roleOf(n);
			const name = nameOf(n, byId);
			const states = statesOf(n);
			if (role || name || states.length > 0) out.push({ role: role || "", name: name || "", states, tag: String(n.tag || "") });
		}
		for (const c of n.children || []) walk(c);
	};
	walk(tree);
	return out;
};

// One entry's correspondence to another: the role must agree (an unnamed node
// of the same role still corresponds), the name and states are compared by
// value. A different accessible NAME means a different widget — two buttons
// labelled "Close dialog" and "Primary action" are not the same control, so the
// match is weak. Pixel-identical widgets that announce different things are not
// duplicates.
const entrySim = (a, b) => {
	if (a.role && b.role && a.role !== b.role) return 0;
	if (!a.role && !b.role && a.name !== b.name) return 0;
	let score = 1;
	if (a.name && b.name) score = a.name === b.name ? 1 : 0.2;
	else if (a.name || b.name) score = 0.5;
	const sa = a.states.join("|");
	const sb = b.states.join("|");
	if (sa || sb) score = Math.min(score, sa === sb ? 1 : 0.4);
	return score;
};

// In-order alignment (LCS-style DP) of the two announcement lists: each entry
// takes the best compatible counterpart that keeps document order. The score is
// the aligned similarity over the LARGER list, so extra announcements on one
// side lower it instead of disappearing.
const alignScore = (A, B) => {
	if (A.length === 0 || B.length === 0) return { score: 0, matched: 0 };
	const n = A.length;
	const m = B.length;
	const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
	for (let i = n - 1; i >= 0; i -= 1) {
		for (let j = m - 1; j >= 0; j -= 1) {
			const s = entrySim(A[i], B[j]);
			const take = s > 0 ? s + dp[i + 1][j + 1] : -1;
			dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1], take);
		}
	}
	return { score: dp[0][0] / Math.max(n, m), matched: dp[0][0] };
};

const matchA11y = (candidate, canon) => {
	const candA = tokensOf(candidate, "a11y");
	const canonA = tokensOf(canon, "a11y");
	const candT = tokensOf(candidate, "testid");
	const canonT = tokensOf(canon, "testid");

	const testSim = jaccard(candT, canonT);

	// The semantic comparison when both sides have an expanded tree AND BOTH
	// carry explicit accessibility markup (role / aria-* tokens). A component
	// with NO a11y tokens is not an accessibility participant: comparing its
	// implicit landmark roles against another's explicit contract would invent
	// evidence and re-distribute weight onto a signal the author never wrote.
	const candTree = candidate.tree || (candidate.dom && candidate.dom.tree);
	const canonTree = canon.tree || (canon.dom && canon.dom.tree);
	let a11ySim;
	let form;
	let candAnn = [];
	let canonAnn = [];
	if (candTree && canonTree && candA.size > 0 && canonA.size > 0) {
		candAnn = announcementsOf(candTree);
		canonAnn = announcementsOf(canonTree);
		a11ySim = alignScore(candAnn, canonAnn).score;
		form = "semantic";
	} else {
		a11ySim = jaccard(candA, canonA);
		form = "tokens";
	}

	const parts = [];
	if (candA.size > 0 || canonA.size > 0) parts.push({ w: 1 - TEST_ID_WEIGHT, v: a11ySim });
	if (candT.size > 0 || canonT.size > 0) parts.push({ w: TEST_ID_WEIGHT, v: testSim });

	const totalW = parts.reduce((s, p) => s + p.w, 0);
	const score = totalW === 0 ? 0 : parts.reduce((s, p) => s + p.w * p.v, 0) / totalW;

	const evidence = {
		candidateA11y: [...candA].sort(),
		canonicalA11y: [...canonA].sort(),
		candidateTestId: [...candT].sort(),
		canonicalTestId: [...canonT].sort(),
		a11ySimilarity: a11ySim,
		testIdSimilarity: testSim,
		form,
		...(form === "semantic"
			? {
				candidateAnnouncements: candAnn.map((e) => `${e.role || e.tag}${e.name ? ` "${e.name}"` : ""}${e.states.length ? ` [${e.states.join(",")}]` : ""}`),
				canonicalAnnouncements: canonAnn.map((e) => `${e.role || e.tag}${e.name ? ` "${e.name}"` : ""}${e.states.length ? ` [${e.states.join(",")}]` : ""}`),
			}
			: {}),
	};

	return { score, evidence };
};

export { matchA11y, tokensOf, classify, announcementsOf, TEST_ID_WEIGHT };
