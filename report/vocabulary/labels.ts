"use strict";

import { SIGNAL, KIND, TIER } from "../../constants";

// The words the report uses for the five comparison groups. A signal is named
// once here and read back by the terminal report, the HTML page and the log, so
// "structure 0.80" in a message and the blue bar in the picture are the same
// thing. The colour is the ONE colour of that signal everywhere.

const SIGNALS = [
	{
		key: SIGNAL.Structure,
		label: "Structure",
		short: "struct",
		color: "#6ea8fe",
		what: "the DOM tree and its styling (tags, CSS, text)",
	},
	{
		key: SIGNAL.Styles,
		label: "Styles",
		short: "styles",
		color: "#e879a0",
		what: "the CSS that matters per element: typography for text, layout for containers, offsets when positioned, colors and surfaces",
	},
	{
		key: SIGNAL.Behavior,
		label: "Behavior",
		short: "behav",
		color: "#f0a35e",
		what: "the events the component handles (onClick, onChange…)",
	},
	{
		key: SIGNAL.A11y,
		label: "Accessibility",
		short: "a11y",
		color: "#56c8a8",
		what: "the ARIA roles / attributes and test ids",
	},
	{
		key: SIGNAL.Framework,
		label: "Framework",
		short: "fw",
		color: "#b48ef0",
		what: "the props it takes and the child components it renders",
	},
	{
		key: SIGNAL.Name,
		label: "Name",
		short: "name",
		color: "#ffd166",
		what: "the component name and its file basename",
	},
];

const SIGNAL_KEYS = SIGNALS.map((s) => s.key);

const signalOf = (key) => SIGNALS.find((s) => s.key === key) ?? SIGNALS[0];

const signalColor = (key) => signalOf(key).color;

// What each KIND of finding is, its colour, and the repair verb.
const KINDS = {
	[KIND.Duplicate]: { label: "Duplicate", color: "#ff6b6b", action: "use the canonical component" },
	[KIND.Similar]: { label: "Similar", color: "#fbbf24", action: "consider unifying" },
	[KIND.Missing]: { label: "Missing component", color: "#f0a35e", action: "extract a shared component" },
	[KIND.RawHtml]: { label: "Raw HTML", color: "#7fdbca", action: "replace with the canonical component" },
	[KIND.Part]: { label: "Copied part", color: "#9aa7ff", action: "reuse the canonical component" },
	[KIND.Dropped]: { label: "Filtered out", color: "#6b7788", action: "none — a filter explained it away" },
};

const kindOf = (key) => KINDS[key] ?? KINDS[KIND.Similar];

// The same kinds as a COUNTABLE list (a tile says "Duplicates: 12").
const KIND_TILES = Object.freeze([
	{ key: KIND.Duplicate, label: "Duplicates" },
	{ key: KIND.Similar, label: "Similar" },
	{ key: KIND.Missing, label: "Missing components" },
	{ key: KIND.RawHtml, label: "Raw HTML" },
	{ key: KIND.Part, label: "Copied parts" },
	{ key: KIND.Dropped, label: "Filtered out" },
]);

const TIER_LABEL = {
	[TIER.Duplicate]: "High-confidence duplicates (confidence ≥ duplicate threshold)",
	[TIER.Similar]: "Weak similarity (similar ≤ confidence < duplicate)",
	none: "Below every threshold",
};

export {  SIGNALS, SIGNAL_KEYS, signalOf, signalColor, KINDS, kindOf, KIND_TILES, TIER_LABEL  };