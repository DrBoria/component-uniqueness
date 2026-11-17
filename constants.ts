"use strict";

// The ONE vocabulary of the component report. Every word the tool says — a
// signal name, a verdict, a repair verb — is written here once and read back by
// the terminal report, the HTML page and the log, so "structure 0.80" in a
// message and the blue bar in the picture are the same thing. The engine
// (matcher, decision-maker) keeps its own numeric knobs; this file is only WORDS.

// ═══ 1. The five comparison signals ═════════════════════════════════════════
// Components are compared by their DOM structure + CSS, their behaviour (events),
// their accessibility profile, their framework profile (props / child components)
// and their name. Unlike entities, `name` IS a signal here: the engine weights it.
const SIGNAL = Object.freeze({
	Structure: "structure",
	Styles: "styles",
	Behavior: "behavior",
	A11y: "a11y",
	Framework: "framework",
	Name: "name",
});

const SIGNAL_ORDER = Object.freeze([SIGNAL.Structure, SIGNAL.Styles, SIGNAL.Behavior, SIGNAL.A11y, SIGNAL.Framework, SIGNAL.Name]);

// ═══ 2. Tiers (two, as the engine decides) ══════════════════════════════════
const TIER = Object.freeze({
	Duplicate: "duplicate",
	Similar: "similar",
});

const TIER_ORDER = Object.freeze([TIER.Duplicate, TIER.Similar]);

// ═══ 3. Kinds of finding ════════════════════════════════════════════════════
const KIND = Object.freeze({
	Duplicate: "duplicate",
	Similar: "similar",
	Missing: "missing",
	RawHtml: "rawhtml",
	Part: "part",
	Dropped: "dropped",
});

const KIND_LIST = Object.freeze([KIND.Duplicate, KIND.Similar, KIND.Missing, KIND.RawHtml, KIND.Part, KIND.Dropped]);

// ═══ 4. Sentence codes — the only source of any verdict/message ═════════════
const CODE = Object.freeze({
	Duplicate: "duplicate",
	Similar: "similar",
	Missing: "missing",
	RawHtml: "rawHtml",
	Part: "part",
	FilteredOut: "filteredOut",
	Confidence: "confidence",
	Headline: "headline",
});

const WARN_PREFIX = "[component-uniqueness] ";

// ═══ 5. Sides of a comparison ═══════════════════════════════════════════════
// Components compare an app (local) component against a canonical one.
const SIDE = Object.freeze({
	App: "app",
	Canon: "canon",
});

// ═══ 6. Per-row annotation state (the diff gutter) ══════════════════════════
const MARK = Object.freeze({
	Same: "same",
	Differs: "differs",
});

// ═══ 7. Actions a repair can carry ══════════════════════════════════════════
const ACTION = Object.freeze({
	UseCanonical: "use-canonical",
	ExtractComponent: "extract-component",
	ReplaceRawHtml: "replace-raw-html",
	None: "none",
});

// ═══ 8. Tone of a "why" line ════════════════════════════════════════════════
const TONE = Object.freeze({
	Agree: "agree",
	Disagree: "disagree",
	Veto: "veto",
	Off: "off",
});

export {  SIGNAL, SIGNAL_ORDER, TIER, TIER_ORDER, KIND, KIND_LIST, CODE, WARN_PREFIX, SIDE, MARK, ACTION, TONE  };