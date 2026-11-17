"use strict";

// Every sentence the report prints about a verdict lives here, as a template
// with `{placeholders}`. A producer states the FACTS (names, paths, numbers);
// the wording is chosen here, once, so the terminal report and the HTML page
// cannot drift apart.

const fill = (template, vars) =>
	String(template).replace(/\{([A-Za-z][A-Za-z0-9_]*)\}/g, (_, key) =>
		vars[key] != null ? String(vars[key]) : `{${key}}`,
	);

const PHRASES = {
	// ── Verdicts ────────────────────────────────────────────────────────────
	duplicate: "{left} duplicates canonical {right} — {confidence} confidence. Use the canonical component instead.",
	similar: "{left} looks like canonical {right}, but not closely enough to call it a copy — {confidence}.",
	missing: "{count} distinct components all matched canonical {right}. A shared component is likely missing — weakest link {confidence}.",
	rawHtml: "Raw <{tag}> outside the canonical packages — replace with {right}.",
	part: "{left} copies a part of canonical {right} — {confidence}. Reuse the canonical component.",

	// ── Why it matched ──────────────────────────────────────────────────────
	headline: "{confidence} confidence — {top} contributes {share} of it.",
	signal: "{label} agrees at {score} ({weight} of the verdict) — it compares {what}.",
	signalDisagrees: "{label} agrees only at {score} ({weight} of the verdict) — it compares {what}.",
	signalOff: "{label} has no evidence for this pair, its weight was redistributed.",

	// ── The number itself ───────────────────────────────────────────────────
	confidence: "confidence {confidence} ({signals})",

	// ── Why a pair was dismissed (the filters) ──────────────────────────────
	filtered: "{left} and {right} were filtered out — {reason}",

	// ── Repairs ─────────────────────────────────────────────────────────────
	fixUseCanonical: "Replace `{left}` with `{right}` from `{path}` — they are the same component.",
	fixExtractComponent: "Extract a shared component for this group and have all {count} use it.",
	fixReplaceRawHtml: "Replace the raw <{tag}> with `{right}` from `{path}`.",
	fixKeep: "No action needed beyond the note.",

	// ── Caveats ─────────────────────────────────────────────────────────────
	notRead: "{path} was not read: {reason}",
};

export {  PHRASES, fill  };