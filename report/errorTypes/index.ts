"use strict";

// The vocabulary of the report, in one place:
//
//   describeComp(comp) -> findings[]
//
// Every finding is the same SHAPE, whatever produced it, and every sentence comes
// from a CODE (`../codes`):
//
//   { id, code, params, kind, label, color,      what it says and how it looks
//     left, right,                                the two places (or one)
//     confidence, tier,                           the numbers
//     message,                                    render(code, params)
//     fix,                                        the repair, structured
//     decision,                                   per-signal scores + why lines
//     evidence, dropped, members }                the raw facts behind it
//
// Components compare an app (local) component against a canonical one. The left
// side is the app component, the right side the canonical it should reuse.

import { kindOf } from "../vocabulary/labels";
import { render, kindOfCode } from "../codes";
import { explain } from "../explain";
import { CODE, KIND, SIDE } from "../../constants";
import * as asks from "../asks";

// A component place: the report only needs where it is and what it is called.
const place = (comp) => ({
	name: comp?.name ?? null,
	path: comp?.path ?? null,
	line: comp?.line ?? null,
	endLine: comp?.endLine ?? comp?.line ?? null,
});

const conf = (value) => (Number.isFinite(value) ? value.toFixed(2) : "n/a");
const pct = (value) => (Number.isFinite(value) ? `${Math.round(value * 100)}%` : "n/a");

const finding = ({ id, code, params, left, right = null, fix, decision = null, evidence = {}, dropped = null, members = null, suffix = "" }) => {
	const kind = kindOfCode(code) ?? KIND.Similar;
	const meta = kindOf(kind);

	return {
		id,
		code,
		params,
		kind,
		label: meta.label,
		color: meta.color,
		left,
		right,
		confidence: decision ? decision.confidence : null,
		tier: decision ? decision.tier : null,
		message: `${render(code, params)}${suffix}`,
		fix,
		decision,
		evidence,
		dropped,
		members,
	};
};

const pairFinding = (match) => {
	const decision = explain(match.decision);
	const code = match.decision.tier === "duplicate" ? CODE.Duplicate : CODE.Similar;
	const left = place(match.app);
	const right = place(match.canon);
	const fix = code === CODE.Duplicate ? asks.useCanonical(left, right) : asks.none();

	return finding({
		id: `${code}:${left.path}#${left.name}=>${right.path}#${right.name}`,
		code,
		params: {
			left: `\`${left.name}\``,
			right: `\`${right.name}\``,
			confidence: `${conf(decision.confidence)} (${pct(decision.confidence)})`,
		},
		left: { ...left, side: SIDE.App },
		right: { ...right, side: SIDE.Canon },
		fix,
		decision,
		evidence: { reason: match.reason, engine: match.decision },
	});
};

const droppedFinding = (dropped) => {
	const match = dropped.match ?? dropped;
	const decision = explain(match.decision);
	const left = place(match.app);
	const right = place(match.canon);
	const why = dropped.reason ?? "";

	return finding({
		id: `dropped:${left.path}#${left.name}=>${right.path}#${right.name}`,
		code: CODE.FilteredOut,
		params: { left: `\`${left.name}\``, right: `\`${right.name}\``, reason: why },
		left: { ...left, side: SIDE.App },
		right: { ...right, side: SIDE.Canon },
		fix: asks.none(),
		decision,
		evidence: { filter: dropped.filter, reason: why },
		suffix: ` Filtered out by \`${dropped.filter ?? "filter"}\`: ${why}`,
		dropped: { filter: dropped.filter, reason: why },
	});
};

const missingFinding = (cluster) => {
	const canon = place(cluster.canon);
	const weakest = cluster.matches.reduce((min, m) => Math.min(min, m.decision.confidence), 1);
	const members = cluster.matches.map((m) => ({ ...place(m.app), confidence: m.decision.confidence }));

	return finding({
		id: `missing:${canon.path}#${cluster.name}`,
		code: CODE.Missing,
		params: { count: cluster.matches.length, right: `\`${canon.name}\``, confidence: conf(weakest) },
		left: { name: cluster.name, path: null, line: null, endLine: null, side: SIDE.App },
		right: { ...canon, side: SIDE.Canon },
		fix: asks.extractComponent(cluster.matches.length),
		decision: null,
		evidence: { canon: canon.name, apps: cluster.matches.map((m) => m.app.name) },
		members,
	});
};

const rawHtmlFinding = (row) => {
	const right = { name: row.suggestion.component, path: row.suggestion.path, line: null, endLine: null };
	const left = { name: `<${row.tag}>`, path: row.path, line: row.line, endLine: row.line };

	return finding({
		id: `rawhtml:${row.path}:${row.line}:${row.tag}`,
		code: CODE.RawHtml,
		params: { tag: row.tag, right: `\`${right.name}\`` },
		left: { ...left, side: SIDE.App },
		right: { ...right, side: SIDE.Canon },
		fix: asks.replaceRawHtml(row.tag, right),
		decision: null,
		evidence: { reason: row.reason, confidence: row.confidence },
	});
};

const partFinding = (row) => {
	const primary = row.suggestions[0];
	const right = { name: primary.component, path: primary.path, line: primary.line ?? null, endLine: primary.endLine ?? null };
	const left = { name: `${row.owner} › <${row.tag}>`, path: row.path, line: row.line, endLine: row.endLine };
	const decision = row.engine ? explain(row.engine) : null;

	return finding({
		id: `part:${row.path}:${row.line}:${row.tag}`,
		code: CODE.Part,
		params: { left: `\`${left.name}\``, right: `\`${right.name}\``, confidence: conf(primary.confidence) },
		left: { ...left, side: SIDE.App },
		right: { ...right, side: SIDE.Canon },
		fix: asks.useCanonical(left, right),
		decision,
		evidence: { reason: primary.reason, suggestions: row.suggestions, engine: row.engine ?? null },
	});
};

// The one producer: every finding the overview / markdown / CLI consumes.
const describeComp = (comp) => {
	const findings = [];
	for (const match of comp.matches ?? []) findings.push(pairFinding(match));
	for (const cluster of comp.missingClusters ?? []) findings.push(missingFinding(cluster));
	for (const row of comp.rawHtml ?? []) findings.push(rawHtmlFinding(row));
	for (const row of comp.parts ?? []) findings.push(partFinding(row));
	for (const dropped of comp.dropped ?? []) findings.push(droppedFinding(dropped));

	return findings;
};

export {  describeComp, pairFinding, droppedFinding, missingFinding, rawHtmlFinding, partFinding  };