"use strict";

// SEMANTIC member links — WHAT corresponds, never WHERE the characters are.
//
// The model decides which token on the left is the same as which on the right
// (a shared event, a shared prop, a shared ARIA attribute, the root tag, the
// component name). It hands these to code-diff as `MemberLink`s; code-diff
// locates the names in the rows and computes the marks and twins. No character
// range is computed here — that is the view's job.
//
// Each signal highlights a DIFFERENT part of the component, so the tabs are not
// the same picture:
//
//   structure   the root tag (and the matched chain's tags)
//   behavior    the shared event handler names (onClick…)
//   a11y        the shared ARIA attributes / test ids
//   framework   the shared props and child-component names
//   name        the component names themselves

import { wordOf } from "./word";
import { tagAffinity } from "../../../normalize/dom";
import { percentOf } from "../../evidence";

// THE COLOR MODEL: a correspondence is a duplicate (red) at ANY percent — the
// label carries the percent when it is partial; a member on ONE side only is
// 100% unique (green), drawn as a stub lane with its absent end null.
const pctLabel = (word, degree) => (degree >= 1 ? word : `${word} · ${percentOf(degree)}%`);

// One link per row of a set model. A shared token is red (100% — the token IS
// the same on both sides); a token on one side only keeps ONLY its own end, so
// resolveLanes draws a green stub with the inter-line continuation.
const setLinks = (model, kind, label) => {
	if (!model || !model.rows) return [];
	const links = [];
	for (const row of model.rows) {
		const shared = row.shared === true;
		links.push({
			connectionId: `same:${kind}:${row.name}`,
			label,
			tone: shared ? "same" : "differs",
			leftColumn: "0",
			rightColumn: "1",
			left: row.left ? { name: row.left.name, key: row.name } : null,
			right: row.right ? { name: row.right.name, key: row.name } : null,
		});
	}

	return links;
};

// The root tags correspond as containers at their tag affinity (div ≡ section
// = 75%): a partial duplicate, red with that percent. A tag on one side only is
// a green stub.
const structureLinks = (model) => {
	if (!model || !model.rows) return [];
	const word = wordOf("root tags", 1);
	const links = [];
	for (const row of model.rows) {
		if (!row.left && !row.right) continue;
		const shared = row.shared === true;
		const degree = shared ? tagAffinity(row.left?.name, row.right?.name) : 0;
		links.push({
			connectionId: `same:structure:${row.name}`,
			label: shared ? pctLabel(word, degree) : word,
			tone: shared ? "same" : "differs",
			leftColumn: "0",
			rightColumn: "1",
			left: row.left ? { name: row.left.name, key: row.name } : null,
			right: row.right ? { name: row.right.name, key: row.name } : null,
		});
	}

	return links;
};

const behaviorLinks = (model, left, right) => {
	if (!model || !model.rows) return [];
	const label = wordOf("events", model?.sharedCount ?? 0);
	const links = [];
	for (const row of model.rows) {
		// Anchor on the handler as it is WRITTEN in each side's source — `onClick`
		// (React), `(click)` (Angular), `@click` (Vue) or `onclick` (plain HTML) —
		// so the ribbon underlines the actual action, not a bare event name that
		// never appears in the code. An event on one side only keeps ONLY its own
		// end (a green stub).
		const shared = row.shared === true;
		const leftName = handlerNameOf(left, row.name) ?? row.name;
		const rightName = handlerNameOf(right, row.name) ?? row.name;
		links.push({
			connectionId: `same:behavior:${row.name}`,
			label,
			tone: shared ? "same" : "differs",
			leftColumn: "0",
			rightColumn: "1",
			left: row.left ? { name: leftName, key: row.name } : null,
			right: row.right ? { name: rightName, key: row.name } : null,
		});
	}

	return links;
};

// The attribute name a side writes for an event, read from its own source lines.
// React `onClick`, Angular `(click)`, Vue `@click`/`v-on:click`, plain `onclick`.
const handlerNameOf = (side, event) => {
	const lines = side?.lines ?? [];
	const camel = `on${event[0]?.toUpperCase()}${event.slice(1)}`;
	const candidates = [camel, `(${event})`, `@${event}`, `v-on:${event}`, `on${event}`];
	for (const line of lines) {
		for (const name of candidates) {
			if (String(line).includes(name)) return name;
		}
	}

	return null;
};

// ARIA tokens are written `role:button` / `aria-label:…`; the source carries the
// attribute name (the part before the colon). Anchor on that name.
const a11yLinks = (model) => {
	if (!model || !model.rows) return [];
	const label = wordOf("a11y tokens", model.sharedCount ?? 0);
	const links = [];
	for (const row of model.rows) {
		const shared = row.shared === true;
		const attr = String(row.name).split(":")[0];
		links.push({
			connectionId: `same:a11y:${row.name}`,
			label,
			tone: shared ? "same" : "differs",
			leftColumn: "0",
			rightColumn: "1",
			left: row.left ? { name: attr, key: row.name } : null,
			right: row.right ? { name: attr, key: row.name } : null,
		});
	}

	return links;
};

// The FRAMEWORK links: one per matched component USAGE, anchored on the exact
// source line the parser reported (`<Button …>`), never a text search that could
// land on a comment or a parameter. The label says which component is reused.
const frameworkLinks = (model) => {
	if (!model || !model.rows) return [];
	const word = wordOf("component usage", 1);
	const links = [];
	for (const row of model.rows) {
		if (!row.left && !row.right) continue;
		const shared = row.shared === true;
		// The usage corresponds; the props it passes may not. No shared prop is a
		// partial duplicate (50%), red — not a unique member.
		const degree = row.same ? 1 : 0.5;
		links.push({
			connectionId: `same:framework:${row.name}:${row.left?.line ?? ""}:${row.right?.line ?? ""}`,
			label: shared ? pctLabel(word, degree) : word,
			tone: shared ? "same" : "differs",
			leftColumn: "0",
			rightColumn: "1",
			left: row.left ? { name: row.name, key: row.name, line: row.left.line ?? undefined } : null,
			right: row.right ? { name: row.name, key: row.name, line: row.right.line ?? undefined } : null,
		});
	}

	return links;
};

const nameLinks = (model) => {
	if (!model || !model.rows || !model.hasEvidence) return [];
	const row = model.rows[0];
	if (!row?.left || !row?.right) return [];

	return [
		{
			connectionId: "same:name",
			label: pctLabel("component names", model.score ?? 0),
			tone: "same",
			leftColumn: "0",
			rightColumn: "1",
			left: { name: row.left.name },
			right: { name: row.right.name },
		},
	];
};

// The STYLES links: one per CSS property that corresponds on a matched node pair.
// The name is the property (`cursor`, `display`); the board locates it in the
// snapshot's style column. A property present on both sides with different
// values is a partial duplicate (50%), red; a property on one side only is a
// green stub.
const stylesLinks = (model) => {
	if (!model || !model.rows) return [];
	const word = wordOf("style properties", 1);
	const links = [];
	for (const row of model.rows) {
		if (!row.left && !row.right) continue;
		const shared = row.shared === true;
		const degree = row.same ? 1 : 0.5;
		links.push({
			connectionId: `same:styles:${row.tag}:${row.name}`,
			label: shared ? pctLabel(word, degree) : word,
			tone: shared ? "same" : "differs",
			leftColumn: "0",
			rightColumn: "1",
			left: row.left ? { name: row.name, key: `${row.tag}:${row.name}` } : null,
			right: row.right ? { name: row.name, key: `${row.tag}:${row.name}` } : null,
		});
	}

	return links;
};

// All links per signal, keyed by the SIGNAL the tab selects.
const linksBySignal = (analysis, left, right) => ({
	structure: structureLinks(analysis.structure),
	styles: stylesLinks(analysis.styles),
	behavior: behaviorLinks(analysis.behavior, left, right),
	a11y: a11yLinks(analysis.a11y),
	framework: frameworkLinks(analysis.framework),
	name: nameLinks(analysis.name),
});

export {  linksBySignal, structureLinks, stylesLinks, behaviorLinks, a11yLinks, frameworkLinks, nameLinks  };