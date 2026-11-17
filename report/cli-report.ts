"use strict";

// The terminal / `--report` document and the per-finding console block. It is a
// MARKDOWN rendering of the same findings the HTML page draws — same ids, same
// numbers, same repair sentences. `findingText` is the single string the page's
// Detail panel prints for one pair.

import { describeComp } from "./errorTypes";
import { TIER_LABEL, signalOf } from "./vocabulary/labels";
import { describe as describeMatchers } from "./matchers";
import { KIND, TONE, TIER } from "../constants";

const loc = (p) => (p?.line ? `\`${p.path}:${p.line}\`` : `\`${p?.path ?? "—"}\``);

const table = (headers, rows) => {
	const lines = [];
	lines.push(`| ${headers.join(" | ")} |`);
	lines.push(`| ${headers.map(() => "---").join(" | ")} |`);
	for (const row of rows) lines.push(`| ${row.join(" | ")} |`);
	lines.push("");
	return lines;
};

// The five explanations the page draws: what each signal compared. `candidates`
// is a Map keyed `path#name` → component, so the matcher models are rebuilt from
// the same components the decision used.
const matcherBlocks = (candidates, finding) => {
	const left = candidates.get(`${finding.left?.path}#${finding.left?.name}`);
	const right = candidates.get(`${finding.right?.path}#${finding.right?.name}`);
	if (!left || !right || !finding.evidence?.engine) return [];
	const blocks = describeMatchers(left, right, finding.evidence.engine);
	const lines = [];
	for (const block of blocks) {
		const [first, ...rest] = block.lines;
		lines.push(`  ${signalOf(block.key).label}  ${first}`);
		for (const line of rest) lines.push(`    ${line}`);
	}

	return lines;
};

// ONE finding, ONE block: the verdict sentence, every reason, each matcher's own
// lines, the repair.
const findingBlock = (f, candidates = new Map()) => {
	const lines = [`- **${f.left?.name ?? "—"}** — ${f.message}`];
	const scores = (f.decision?.signals ?? []).filter((signal) => signal.applied).map((signal) => `${signal.label} ${Math.round(signal.score * 100)}%`);
	if (scores.length > 0) lines.push(`  scores  ${scores.join("  ·  ")}`);
	for (const why of f.decision?.why ?? []) if (why.tone === TONE.Veto) lines.push(`  ! ${why.text}`);
	lines.push(...matcherBlocks(candidates, f));
	lines.push(`  **Fix** — ${f.fix?.text ?? ""}`);

	return lines;
};

// The whole console entry for one finding, as a single string.
const findingText = (f, candidates = new Map()) => {
	const top = f.decision ? f.decision.signals.reduce((best, s) => (s.contribution > best.contribution ? s : best), f.decision.signals[0]) : null;
	const head = [
		`\`${f.id}\``,
		`${f.left?.name ?? "—"}  ${loc(f.left)}  →  ${f.right?.name ?? "—"}  ${loc(f.right)}`,
		`confidence ${f.confidence != null ? f.confidence.toFixed(2) : "—"}${top ? ` · top signal ${top.label}` : ""}`,
		"",
	];

	return [...head, ...findingBlock(f, candidates)].join("\n");
};

const renderHeader = (comp, findings) => {
	const count = (kind) => findings.filter((f) => f.kind === kind).length;
	const missingMembers = findings.filter((f) => f.kind === KIND.Missing).reduce((n, f) => n + (f.members?.length ?? 0), 0);
	const lines = [];
	lines.push("# Component duplicates (component-level funnel)");
	lines.push("");
	lines.push(`Scanned ${comp.files} app file(s), ${comp.appCount} app component(s) against ${comp.canonCount} canonical component(s).`);
	lines.push("");
	const parts = [
		`Found ${count(KIND.Duplicate)} duplicate component(s) and ${count(KIND.Similar)} similar component(s)`,
		missingMembers > 0 ? `, plus ${missingMembers} component(s) grouped under ${count(KIND.Missing)} potentially missing component(s)` : "",
		count(KIND.RawHtml) > 0 ? `, plus ${count(KIND.RawHtml)} raw-html element(s)` : "",
		count(KIND.Part) > 0 ? `, plus ${count(KIND.Part)} copied part(s)` : "",
	];
	lines.push(`${parts.filter(Boolean).join("")}.`);
	lines.push("");

	return lines;
};

// One row per verdict: the id (pasteable into the page's deep link), the two
// names with their locations, the confidence, the signal that decided it and the
// repair — the same columns utils prints.
const verdictRows = (rows) =>
	rows.map((f) => [
		`\`${f.id}\``,
		`${f.left?.name ?? "—"}`,
		loc(f.left),
		`${f.right?.name ?? "—"}`,
		loc(f.right),
		`${f.confidence != null ? f.confidence.toFixed(2) : "—"}`,
		f.decision ? `${f.decision.signals.reduce((top, s) => (s.contribution > top.contribution ? s : top), f.decision.signals[0]).label}` : "—",
		f.fix?.text ?? "",
	]);

// A verdict tier: the table, then one block per finding with every matcher's own
// lines (Structure / Styles / Behavior / Accessibility / Framework / Name) — the
// same per-tab detail the page draws, so a confidence is checkable in a terminal.
const renderTier = (tier, findings, candidates) => {
	const rows = findings.filter((f) => f.kind === tier).sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0));
	if (rows.length === 0) return [];
	const lines = [];
	lines.push(`## ${TIER_LABEL[tier]} (${rows.length})`);
	lines.push("");
	lines.push(...table(["Id", "Local component", "Location", "Canonical", "Canonical location", "Confidence", "Top signal", "Fix"], verdictRows(rows)));
	lines.push("### Why each one matched");
	lines.push("");
	for (const f of rows) {
		lines.push(...findingBlock(f, candidates));
		lines.push("");
	}

	return lines;
};

const renderMissing = (findings) => {
	const groups = findings.filter((f) => f.kind === KIND.Missing);
	if (groups.length === 0) return [];
	const lines = [`## Potentially missing component (${groups.length})`, ""];
	lines.push("Several distinct components all matched the same canonical. The codebase is missing a shared component that would unify them — not that any single one is a duplicate.");
	lines.push("");
	for (const f of groups) {
		lines.push(`### ${f.left?.name ?? f.right?.name ?? "—"}`);
		lines.push("");
		lines.push(f.message);
		lines.push("");
		lines.push(...table(["Component", "Location", "Confidence"], (f.members ?? []).map((m) => [m.name, loc(m), m.confidence != null ? m.confidence.toFixed(2) : "—"])));
		lines.push(`**Fix** — ${f.fix?.text ?? ""}`);
		lines.push("");
	}

	return lines;
};

const renderRawHtml = (findings) => {
	const rows = findings.filter((f) => f.kind === KIND.RawHtml);
	if (rows.length === 0) return [];
	return [
		`## Raw HTML outside canonical packages (${rows.length})`,
		"",
		...table(
			["Element", "Location", "Replace with", "From", "Why"],
			rows.map((f) => [`${f.left?.name ?? "—"}`, loc(f.left), `\`${f.right?.name ?? "—"}\``, `\`${f.right?.path ?? "—"}\``, f.evidence?.reason ?? f.message]),
		),
	];
};

const renderParts = (findings) => {
	const rows = findings.filter((f) => f.kind === KIND.Part);
	if (rows.length === 0) return [];
	return [
		`## Partial duplicates (parts) (${rows.length})`,
		"",
		...table(
			["Part", "Location", "Replace with", "From", "Why"],
			rows.map((f) => [`${f.left?.name ?? "—"}`, loc(f.left), `\`${f.right?.name ?? "—"}\``, `\`${f.right?.path ?? "—"}\``, f.evidence?.reason ?? f.message]),
		),
	];
};

const renderFiltered = (findings) => {
	const dropped = findings.filter((f) => f.kind === KIND.Dropped);
	if (dropped.length === 0) return [];
	return [
		`## Filtered out (${dropped.length})`,
		"",
		...table(
			["Local component", "Location", "Canonical", "Filter", "Why dropped"],
			dropped.map((f) => [`${f.left?.name ?? "—"}`, loc(f.left), `\`${f.right?.name ?? "—"}\``, `\`${f.dropped?.filter ?? "—"}\``, f.dropped?.reason ?? ""]),
		),
	];
};

// The full terminal report: every tab the page draws, with locations and each
// matcher's own lines — like utils, not a prose summary. `verbose` keeps the
// filtered-out section (the answer to "why is this duplicate missing?").
const renderComponentReport = (comp, verbose = false) => {
	const findings = describeComp(comp);
	const candidates = new Map((comp.candidates ?? []).map((c) => [`${c.path}#${c.name}`, c]));
	const lines = [];
	lines.push(...renderHeader(comp, findings));
	for (const tier of [TIER.Duplicate, TIER.Similar]) lines.push(...renderTier(tier, findings, candidates));
	lines.push(...renderMissing(findings));
	lines.push(...renderRawHtml(findings));
	lines.push(...renderParts(findings));
	if (verbose) lines.push(...renderFiltered(findings));

	return lines.join("\n");
};

// Kept for the page's Detail panel: the same per-finding block the report prints.
const renderComponentOverviewReport = (comp) => renderComponentReport(comp, false);

export {  findingText, findingBlock, renderComponentReport, renderComponentOverviewReport, renderTier, TIER_LABEL  };
