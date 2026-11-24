"use strict";

// ── THE SNAPSHOT BOARDS ────────────────────────────────────────────────────
//
// Structure and Accessibility are FIVE-column screens, exactly like the utils AST
// tab:
//
//   0 code · 1 snapshot · 2 match · 3 snapshot · 4 code
//
// Columns 1 and 3 are NOT the source: they are what the framework BUILDS from the
// component — the expanded HTML tree (Structure) or only what a screen reader
// announces (Accessibility). A `Button` becomes `button + span + icon` there, and
// the reader sees which node is the duplicate. The middle column lists what the
// two snapshots share.
//
// The model states facts (the snapshot rows, each pointing at the code line that
// produced it); this module arranges them into columns and multi-end connections.
// code-diff draws every ribbon, band and mark — no geometry is computed here.

import { diffLines, resolveLanes, locate, rangeOf } from "@md-code/code-diff";
import { compareCss } from "../../../../matcher/css-matching";
import { pairTheme } from "../components/pair/theme";

// The ink a focused mark is underlined in: red = duplicate, green = unique.
const INK = { same: pairTheme.band.same, differs: pairTheme.band.diff };

const textOf = (cell) => (cell == null ? "" : cell.words ? cell.words.map((w) => w.text).join("") : (cell.text ?? ""));
const spanOf = (side) => ({ startLine: side.startLine, lines: side.lines ?? [] });

const flatten = (rows) => {
	const out = [];
	for (const row of rows) {
		if (row.type === "fold" && row.rows) out.push(...flatten(row.rows));
		else out.push(row);
	}

	return out;
};

// The aligned source rows, as plain cells (the same material the 2-column board
// uses). The code columns of the snapshot board list these.
const codeRowsOf = (pair) => flatten(diffLines(spanOf(pair.left), spanOf(pair.right)).rows);

// One CODE column: its own lines, addressed by line number, painted with the
// ranges the snapshot lanes name (the tag / component each matched node came from).
const codeColumnOf = (rows, side, id, path, marksByLine) => ({
	id,
	kind: "items",
	mirrored: side === 1,
	ratio: 2,
	path,
	items: rows
		.filter((row) => row.cells?.[side] != null)
		.map((row) => {
			const cell = row.cells[side];
			const line = String(cell.no);
			const marks = marksByLine.get(id + "\u0000" + line) ?? [];

			return { id: line, plate: line, text: textOf(cell), marks };
		}),
});

// ── MATCHING THE TWO SNAPSHOTS ─────────────────────────────────────────────
//
// Rows are matched the way the ENGINE matches nodes: two interactive elements
// (`input` ↔ `button`) correspond fully, otherwise by tag affinity (a `div`
// and a `section` correspond as generic containers, `b` ≡ `strong`), refined by
// the CSS they carry. A pair is shown with its agreement % unless the two tags
// are exactly equal or synonyms — then no number (they ARE the same thing).
//
// Accessibility shows ONLY what is duplicated: a reader row that has no
// counterpart on the other side is dropped, not displayed.

// Tag affinity, mirroring normalize/dom.ts: exact = 1, synonyms = 1, two generic
// containers = 0.75, otherwise 0.
const GENERIC = new Set(["div", "span", "section", "header", "footer", "article", "aside", "nav", "main", "fieldset", "form"]);
const SYNONYMS = new Map([["b", "strong"], ["strong", "b"], ["i", "em"], ["em", "i"]]);
const tagAffinity = (a, b) => {
	const ta = String(a || "").toLowerCase();
	const tb = String(b || "").toLowerCase();
	if (ta === tb) return 1;
	if (SYNONYMS.get(ta) === tb) return 1;
	if (GENERIC.has(ta) && GENERIC.has(tb)) return 0.75;

	return 0;
};

// Interactive elements, mirroring normalize/dom.ts INTERACTIVE_TAGS. The engine
// pairs any two interactive nodes (input ↔ button is the SAME kind of thing — a
// control the user operates), so the board must pair them too or a real
// duplicate (EmailInput ↔ NavToggle) shows an empty screen.
const INTERACTIVE = new Set(["a", "area", "audio", "button", "details", "embed", "iframe", "input", "label", "optgroup", "option", "select", "summary", "textarea", "video"]);
const interactiveTag = (tag) => INTERACTIVE.has(String(tag || "").toLowerCase());

// The tags are "the same" (no % shown) when equal or synonyms.
const sameTag = (a, b) => tagAffinity(a, b) === 1;

const cssPairs = (css) => new Set(Object.entries(css || {}).map(([p, v]) => `${p}:${v}`));
const cssJaccard = (a, b) => {
	const A = cssPairs(a);
	const B = cssPairs(b);
	if (A.size === 0 && B.size === 0) return 1;
	const inter = [...A].filter((x) => B.has(x)).length;
	const uni = A.size + B.size - inter;

	return uni === 0 ? 0 : inter / uni;
};

// How much two snapshot rows correspond — the ENGINE's nodeSimilarity shape:
// two interactive elements correspond fully; otherwise tag affinity, blended
// with CSS overlap when either carries styles. (The engine also blends text;
// the snapshot rows carry no element text, so that term is absent here.)
const rowSim = (a, b) => {
	const tag = interactiveTag(a.tag) && interactiveTag(b.tag) ? 1 : tagAffinity(a.tag, b.tag);
	if (tag === 0) return 0;
	const ca = a.css || {};
	const cb = b.css || {};
	if (Object.keys(ca).length === 0 && Object.keys(cb).length === 0) return tag;

	return 0.6 * tag + 0.4 * cssJaccard(ca, cb);
};

// In-order alignment (LCS-style): each left row takes the next compatible right
// row in document order, so the root pairs with the root and repeated tags pair
// by occurrence. A compatibility floor keeps unrelated tags from pairing.
const MIN_ROW_SIM = 0.5;
const matchRows = (left, right, signal) => {
	const sim = (a, b) => (signal === "a11y" ? a11ySim(a, b) : rowSim(a, b));
	// DP table: best total similarity aligning left[i..] with right[j..] in order.
	const n = left.length;
	const m = right.length;
	const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
	for (let i = n - 1; i >= 0; i -= 1) {
		for (let j = m - 1; j >= 0; j -= 1) {
			const s = sim(left[i], right[j]);
			const take = s >= MIN_ROW_SIM ? s + dp[i + 1][j + 1] : -1;
			dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1], take);
		}
	}
	// Walk the table, emitting the pairs it chose.
	const pairs = [];
	let i = 0;
	let j = 0;
	while (i < n && j < m) {
		const s = sim(left[i], right[j]);
		if (s >= MIN_ROW_SIM && Math.abs(dp[i][j] - (s + dp[i + 1][j + 1])) < 1e-9) {
			pairs.push({ left: left[i], right: right[j], sim: s });
			i += 1;
			j += 1;
		} else if (dp[i + 1][j] >= dp[i][j + 1]) {
			i += 1;
		} else {
			j += 1;
		}
	}

	return pairs;
};

// Accessibility correspondence: same role AND same accessible name is a full
// match; same role with a different name is partial; different role is nothing.
const a11ySim = (a, b) => {
	const roleA = a.role || "";
	const roleB = b.role || "";
	if (!roleA || !roleB || roleA !== roleB) return 0;
	const nameA = (a.name || "").toLowerCase();
	const nameB = (b.name || "").toLowerCase();
	if (nameA && nameB && nameA === nameB) return 1;
	if (!nameA && !nameB) return 1;

	return 0.6;
};

// The character range of a name inside a code line, or null. The view computes
// the range; the model only named the line and the word. The anchor is the ROOT
// usage name (`Button`, `Input`) on the line the parser reported — never a deep
// library name (`Loader`) that is not written in this file.
const codeMark = (rows, side, row) => {
	const line = row.codeLine ?? row.line;
	const name = row.codeName ?? row.via ?? row.tag;
	if (!line || !name) return null;
	const at = locate({ rows, column: side, name, line: Number(line) });
	if (!at) return null;

	return { line: at.line, from: at.from, to: at.to };
};

// ── FOLD ALIGNMENT — REMOVED (W2R / L3) ────────────────────────────────────
//
// The old code BAKED "⋯ N lines hidden" text rows into the derived columns so
// their rows sat at the code columns' folded heights. That static baking leaked
// fold text into the show-all state (the mandate violation) and duplicated the
// board's own fold mechanism. There is now ONE fold owner: the board's reactive
// `useRowFold`, which folds unconnected rows in EVERY column from the shared
// connected set. The derived columns (snapshot / match / styles) pass their
// rows as DATA and bake no fold text.

// The snapshot column: one row per node, capped so it scrolls beside its code.
// Each row carries its tone and a standing mark on the tag word, so every piece
// of a lane is highlighted even before the pointer arrives. `parentIds` marks the
// rows that head a subtree block, so they read emphasised (the block's head).
const snapshotColumnOf = (rows, id, mirrored, parentIds) => ({
	id,
	kind: "items",
	mirrored,
	ratio: 1,
	cap: true,
	// W2R / L3 — rows as DATA. Fold text is NEVER baked here: the derived columns
	// list only matched rows (all connected), so the board's ONE reactive
	// `useRowFold` has nothing to fold in them; the code columns fold their own
	// unconnected rows. In the show-all state nothing is hidden in ANY column.
	items: rows.map((row) => {
		const tagRange = rangeOf(row.text, row.tag);
		return { id: row.id, text: row.text, line: row.line ?? undefined, indent: row.depth ?? 0, blockParent: parentIds?.has(row.id) === true, marks: tagRange ? [tagRange] : [] };
	}),
});

// The middle column: one row per matched pair. It names what corresponds and,
// UNLESS the two are exactly the same (div≡div, b≡strong), shows the agreement
// percentage — so `main vs div` reads "75%", not a silent ribbon.
const matchColumnOf = (pairs, signal, parentIds) => ({
	id: "2",
	kind: "items",
	mirrored: false,
	ratio: 1,
	// W2R / L3 — rows as DATA, no baked fold text (see snapshotColumnOf).
	items: pairs.map((pair, index) => {
		const label = signal === "a11y" ? pair.left.role || pair.left.name || pair.left.tag : pair.left.tag;
		const exact = signal === "a11y" ? pair.sim >= 1 : sameTag(pair.left.tag, pair.right.tag);
		// 100% = no number (it IS the same thing); only a partial match shows %.
		const text = exact ? String(label ?? "") : `${label} · ${Math.round(pair.sim * 100)}%`;
		const mark = rangeOf(text, String(label ?? ""));

		// The % (when < 100) conveys how closely they agree; the lane's own
		// colour says duplicate. No row wash — the mark + ribbon carry it.
		return { id: `m${index}`, text, line: pair.left.line ?? undefined, blockParent: parentIds?.has(`m${index}`) === true, marks: mark ? [mark] : [] };
	}),
});

// ONE LANE PER MATCHED NODE — all five columns in the same lane:
//   code line ← snapshot row ← match row ← snapshot row ← code line
// The marks underline the tag / component in both code columns and the node in
// both snapshot columns, so pointing at any of them lights the whole duplicate.
const connectionsOf = (pairs, rows, signal) => {
	const connections = [];
	const marksByLine = new Map();
	const pushMark = (column, mark) => {
		if (!mark) return;
		const key = column + "\u0000" + mark.line;
		const list = marksByLine.get(key) ?? [];
		list.push({ from: mark.from, to: mark.to });
		marksByLine.set(key, list);
	};

	pairs.forEach((pair, index) => {
		// Every shown pair IS a duplicate (unmatched rows are dropped), so the lane is
		// red. Green would claim "unique", which is the opposite of what is on screen.
		const tone = "same";
		const ink = INK[tone];
		const ends = [];
		const marks = [];
		const leftCode = codeMark(rows, 0, pair.left);
		const rightCode = codeMark(rows, 1, pair.right);
		if (leftCode) {
			ends.push({ column: "0", items: [leftCode.line] });
			marks.push({ column: "0", ...leftCode, ink });
			pushMark("0", leftCode);
		}
		ends.push({ column: "1", items: [pair.left.id] });
		const leftSnap = rangeOf(pair.left.text, pair.left.tag);
		if (leftSnap) marks.push({ column: "1", line: pair.left.id, ...leftSnap, ink });
		ends.push({ column: "2", items: [`m${index}`] });
		const midLabel = signal === "a11y" ? pair.left.role || pair.left.name || pair.left.tag : pair.left.tag;
		const midText = sameTag(pair.left.tag, pair.right.tag) || (signal === "a11y" && pair.sim >= 1) ? String(midLabel ?? "") : `${midLabel} · ${Math.round(pair.sim * 100)}%`;
		const midMark = rangeOf(midText, String(midLabel ?? ""));
		if (midMark) marks.push({ column: "2", line: `m${index}`, ...midMark, ink });
		ends.push({ column: "3", items: [pair.right.id] });
		const rightSnap = rangeOf(pair.right.text, pair.right.tag);
		if (rightSnap) marks.push({ column: "3", line: pair.right.id, ...rightSnap, ink });
		if (rightCode) {
			ends.push({ column: "4", items: [rightCode.line] });
			marks.push({ column: "4", ...rightCode, ink });
			pushMark("4", rightCode);
		}
		// Twins: every piece pairs with its counterpart so hovering any word lights
		// the same word on the other side — code↔code and snapshot↔snapshot.
		const lm = marks.find((m) => m.column === "0");
		const rm = marks.find((m) => m.column === "4");
		if (lm && rm) {
			lm.twin = { column: "4", line: rm.line, from: rm.from, to: rm.to, ink };
			rm.twin = { column: "0", line: lm.line, from: lm.from, to: lm.to, ink };
		}
		if (leftSnap && rightSnap) {
			const ls = marks.find((m) => m.column === "1");
			const rs = marks.find((m) => m.column === "3");
			ls.twin = { column: "3", line: pair.right.id, ...rightSnap, ink };
			rs.twin = { column: "1", line: pair.left.id, ...leftSnap, ink };
		}
		connections.push({ id: `snap:${index}`, tone, label: null, ends, marks });
	});

	return { connections, marksByLine };
};

// Build the five-column snapshot board for one pair and one signal (structure,
// a11y or styles). Returns null when the snapshots are unavailable, so the caller
// falls back to the two-column board.
//
// Accessibility shows ONLY duplicated rows: a reader row with no counterpart is
// dropped from both snapshot columns, so the screen shows what is shared, not
// everything each side announces.
export const buildSnapshotBoard = (pair, signal) => {
	const leftSnap = pair?.snapshots?.left;
	const rightSnap = pair?.snapshots?.right;
	if (!leftSnap || !rightSnap) return null;

	const rows = codeRowsOf(pair);
	const paths = pair.columns ?? [{}, {}];

	if (signal === "styles") return buildStylesBoard(pair, leftSnap, rightSnap, rows, paths);

	const leftRows = signal === "a11y" ? leftSnap.reader : leftSnap.html;
	const rightRows = signal === "a11y" ? rightSnap.reader : rightSnap.html;
	if (!leftRows || !rightRows) return null;

	const pairs = matchRows(leftRows, rightRows, signal);
	// ONLY DUPLICATES are shown: a row with no counterpart is dropped from both
	// snapshot columns, so the screen shows what is shared, not everything.
	const shownLeft = pairs.map((p) => p.left);
	const shownRight = pairs.map((p) => p.right);
	const { connections, marksByLine } = connectionsOf(pairs, rows, signal);
	// W2R / L3 — no static fold baking. The derived columns pass their matched
	// rows as DATA; the board's ONE reactive `useRowFold` folds unconnected rows
	// in every column (the code columns fold their own hidden runs). In show-all
	// no column hides anything, so no `lines hidden` text can appear anywhere.
	// Every matched node heads its own row (emphasised); no subtree block — a
	// hover lights ITS OWN lane only, never the whole subtree.
	const leftParents = new Set(shownLeft.map((r) => r.id));
	const rightParents = new Set(shownRight.map((r) => r.id));
	const midParents = new Set(pairs.map((_, i) => `m${i}`));

	return {
		rows,
		connections,
		blocks: [],
		columns: [
			codeColumnOf(rows, 0, "0", paths[0]?.path, marksByLine),
			snapshotColumnOf(shownLeft, "1", false, leftParents),
			matchColumnOf(pairs, signal, midParents),
			snapshotColumnOf(shownRight, "3", true, rightParents),
			codeColumnOf(rows, 1, "4", paths[1]?.path, marksByLine),
		],
	};
};

// ── THE STYLES BOARD ───────────────────────────────────────────────────────
//
// Five columns like Structure, but the middle columns are the RESOLVED CSS
// DECLARATIONS of each matched node — one row per property that matters for its
// element role (`display: flex`, `cursor: pointer`, `color: …`). The center
// column says, per property, whether the two sides agree. A button and a button
// is fine — but is the color the same? is there a cursor:pointer? That is here.
const buildStylesBoard = (pair, leftSnap, rightSnap, rows, paths) => {
	const leftRows = leftSnap.html;
	const rightRows = rightSnap.html;
	if (!leftRows || !rightRows) return null;
	const pairs = matchRows(leftRows, rightRows, "structure");

	const styleRowsLeft = [];
	const styleRowsRight = [];
	const matchItems = [];
	const connections = [];
	const marksByLine = new Map();

	pairs.forEach((nodePair, index) => {
		// Compare the CSS of the two matched nodes on the properties that matter for
		// their element role (the css-matching rules).
		const cmp = compareCss(nodePair.left.tag, nodePair.left.css, nodePair.right.tag, nodePair.right.css);
		const nodeLabel = nodePair.left.tag;
		// The node header is a structural duplicate (matched by tag), so it is red.
		// Per-property rows below carry their own red/green tone.
		const nodeTone = "same";

		// A header row for the node, then one row per relevant property. The header
		// EXPLAINS itself: `div · no styles` when nothing was resolved for this role,
		// otherwise the tag (the properties below are its styles). The center shows
		// % only when it is not 100%. A bare `div` without explanation never remains.
		const leftHeader = `sh${index}l`;
		const rightHeader = `sh${index}r`;
		const leftText = cmp.total === 0 ? `${nodeLabel} · no styles` : nodeLabel;
		const rightText = cmp.total === 0 ? `${nodePair.right.tag} · no styles` : nodePair.right.tag;
		const midText = cmp.total === 0 ? `${nodeLabel} · no styles` : cmp.same === cmp.total ? nodeLabel : `${nodeLabel} · ${Math.round((cmp.same / cmp.total) * 100)}%`;
		// The header is the PARENT of its block, indented to the node's own depth in the
		// tree so a footer's styles sit under the footer, nested inside its container;
		// the property rows below are its members, one level deeper. The group reads as
		// a tree before any hover, and it is clear which element each style belongs to.
		const nodeDepth = nodePair.left.depth ?? 0;
		styleRowsLeft.push({ id: leftHeader, text: leftText, line: nodePair.left.line ?? undefined, indent: nodeDepth, blockParent: true, marks: [rangeOf(leftText, nodeLabel)].filter(Boolean) });
		styleRowsRight.push({ id: rightHeader, text: rightText, line: nodePair.right.line ?? undefined, indent: nodeDepth, blockParent: true, marks: [rangeOf(rightText, nodePair.right.tag)].filter(Boolean) });
		matchItems.push({ id: `sm${index}`, text: midText, line: nodePair.left.line ?? undefined, indent: nodeDepth, blockParent: true, marks: [rangeOf(midText, nodeLabel)].filter(Boolean) });

		// THE HEADER LANE names ONLY the header rows (and the code words below) —
		// never the property rows. Property rows belong to their OWN narrow lane;
		// listing them here made the geometry merge adjacent rows into one wide
		// band drawn OVER the property lanes.
		const ends = [{ column: "1", items: [leftHeader] }, { column: "2", items: [`sm${index}`] }, { column: "3", items: [rightHeader] }];
		const marks = [];
		const leftSnapMark = rangeOf(leftText, nodeLabel);
		const rightSnapMark = rangeOf(rightText, nodePair.right.tag);
		const midMark = rangeOf(midText, nodeLabel);
		if (leftSnapMark) marks.push({ column: "1", line: leftHeader, ...leftSnapMark, ink: INK[nodeTone], ...(rightSnapMark ? { twin: { column: "3", line: rightHeader, ...rightSnapMark, ink: INK[nodeTone] } } : {}) });
		if (midMark) marks.push({ column: "2", line: `sm${index}`, ...midMark, ink: INK[nodeTone] });
		if (rightSnapMark) marks.push({ column: "3", line: rightHeader, ...rightSnapMark, ink: INK[nodeTone], ...(leftSnapMark ? { twin: { column: "1", line: leftHeader, ...leftSnapMark, ink: INK[nodeTone] } } : {}) });

		cmp.rows.forEach((row, p) => {
			const lid = `sp${index}l${p}`;
			const rid = `sp${index}r${p}`;
			const mid = `spm${index}p${p}`;
			// THE COLOR MODEL: a property on BOTH sides is a duplicate — equal values
			// are 100% (no number), different values are a partial duplicate at 50%,
			// red. A property on ONE side only is unique (green stub): its absent
			// side's row is dropped from the lane so the ribbon keeps one body.
			const shared = row.left !== null && row.right !== null;
			const propTone = shared ? "same" : "differs";
			const propInk = INK[propTone];
			const lText = row.left === null ? `${row.prop}: —` : `${row.prop}: ${row.left}`;
			const rText = row.right === null ? `${row.prop}: —` : `${row.prop}: ${row.right}`;
			const mText = row.same ? row.prop : shared ? `${row.prop} · 50%` : row.prop;
			// A property is indented one level under its header so the tree reads
			// at a glance; its OWN lane carries the comparison, no block wash.
			styleRowsLeft.push({ id: lid, text: lText, line: nodePair.left.line ?? undefined, indent: nodeDepth + 1, marks: [rangeOf(lText, row.prop)].filter(Boolean) });
			styleRowsRight.push({ id: rid, text: rText, line: nodePair.right.line ?? undefined, indent: nodeDepth + 1, marks: [rangeOf(rText, row.prop)].filter(Boolean) });
			matchItems.push({ id: mid, text: mText, line: nodePair.left.line ?? undefined, indent: nodeDepth + 1, marks: [rangeOf(mText, row.prop)].filter(Boolean) });
			// Each property is its own lane so its ribbon never breaks: the property
			// word on the left twins with the same word on the right, and the center
			// word is a lit piece of the same path.
			const lMark = rangeOf(lText, row.prop);
			const rMark = rangeOf(rText, row.prop);
			const mMark = rangeOf(mText, row.prop);
			const pMarks = [];
			if (lMark) pMarks.push({ column: "1", line: lid, ...lMark, ink: propInk, ...(rMark ? { twin: { column: "3", line: rid, ...rMark, ink: propInk } } : {}) });
			if (mMark) pMarks.push({ column: "2", line: mid, ...mMark, ink: propInk });
			if (rMark) pMarks.push({ column: "3", line: rid, ...rMark, ink: propInk, ...(lMark ? { twin: { column: "1", line: lid, ...lMark, ink: propInk } } : {}) });
			// A one-sided property keeps ONLY its own snapshot end (+ the match row):
			// the absent side's `—` row is not part of the lane, so the ribbon draws
			// one body and the inter-line continuation, never a false twin.
			const pEnds = [{ column: "2", items: [mid] }];
			if (row.left !== null) pEnds.unshift({ column: "1", items: [lid] });
			if (row.right !== null) pEnds.push({ column: "3", items: [rid] });
			connections.push({ id: `style:${index}:p${p}`, tone: propTone, label: null, ends: pEnds, marks: pMarks });
		});

		const leftCode = codeMark(rows, 0, nodePair.left);
		const rightCode = codeMark(rows, 1, nodePair.right);
		if (leftCode) {
			ends.unshift({ column: "0", items: [leftCode.line] });
			marks.push({ column: "0", ...leftCode, ink: INK[nodeTone], ...(rightCode ? { twin: { column: "4", line: rightCode.line, from: rightCode.from, to: rightCode.to, ink: INK[nodeTone] } } : {}) });
			const key = "0\u0000" + leftCode.line;
			marksByLine.set(key, [...(marksByLine.get(key) ?? []), { from: leftCode.from, to: leftCode.to }]);
		}
		if (rightCode) {
			ends.push({ column: "4", items: [rightCode.line] });
			marks.push({ column: "4", ...rightCode, ink: INK[nodeTone], ...(leftCode ? { twin: { column: "0", line: leftCode.line, from: leftCode.from, to: leftCode.to, ink: INK[nodeTone] } } : {}) });
			const key = "4\u0000" + rightCode.line;
			marksByLine.set(key, [...(marksByLine.get(key) ?? []), { from: rightCode.from, to: rightCode.to }]);
		}
		connections.push({ id: `style:${index}`, tone: nodeTone, label: null, ends, marks });
	});

	// W2R / L3 — the styles columns pass their rows as DATA; the board's reactive
	// fold handles any unconnected rows. No baked `lines hidden` text here.
	return {
		rows,
		connections,
		blocks: [],
		columns: [
			codeColumnOf(rows, 0, "0", paths[0]?.path, marksByLine),
			{ id: "1", kind: "items", mirrored: false, ratio: 1, cap: true, items: styleRowsLeft },
			{ id: "2", kind: "items", mirrored: false, ratio: 1, items: matchItems },
			{ id: "3", kind: "items", mirrored: true, ratio: 1, cap: true, items: styleRowsRight },
			codeColumnOf(rows, 1, "4", paths[1]?.path, marksByLine),
		],
	};
};

export { matchRows, tagAffinity, sameTag, rowSim };
