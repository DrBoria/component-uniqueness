"use strict";

// The READER's names for the matchers' evidence keys. The matchers emit numbers
// under machine-ish keys because they are diagnostics, not prose. A person
// reading a finding needs the QUESTION the number answers, so the translation
// lives here with the rest of the wording — not in the decision engine.
//
// A key missing here falls back to its own name, so a new evidence field shows
// up (ugly but visible) instead of disappearing.

const EVIDENCE_LABELS = Object.freeze({
	// structure
	mode: "comparison mode",
	similarity: "chain similarity",
	quality: "chain quality",
	minNodeSim: "weakest node match",
	chainSize: "matched chain length",
	refSize: "reference size",
	conflicts: "CSS conflicts",
	conflictRatio: "CSS conflict ratio",
	agreement: "CSS agreement",
	classesDiffer: "class names differ",
	ceiling: "score ceiling",
	sizeFactor: "size factor",
	rootSim: "root similarity",
	rejected: "rejected",
	// behavior
	candidateEvents: "events (local)",
	canonicalEvents: "events (canonical)",
	sharedEvents: "shared events",
	smallSetDiscount: "small-set discount",
	// a11y
	candidateA11y: "ARIA (local)",
	canonicalA11y: "ARIA (canonical)",
	candidateTestId: "test ids (local)",
	canonicalTestId: "test ids (canonical)",
	a11ySimilarity: "ARIA overlap",
	testIdSimilarity: "test-id overlap",
	// styles
	pairs: "matched node pairs",
	properties: "relevant CSS properties",
	agreeing: "agreeing properties",
	// framework (usage-based: components USED and props PASSED, never accepted)
	candidateUsages: "component usages (local)",
	canonicalUsages: "component usages (canonical)",
	sharedComponents: "shared components",
	nameSimilarity: "component overlap",
	passedPropSimilarity: "passed-prop overlap",
	// framework (legacy prop keys, kept for older payloads)
	candidateProps: "props (local)",
	canonicalProps: "props (canonical)",
	candidateNames: "child components (local)",
	canonicalNames: "child components (canonical)",
	propsSimilarity: "props overlap",
	eventsSimilarity: "events overlap",
	namesSimilarity: "child-component overlap",
	// name
	exactName: "exact name",
	exactBasename: "exact basename",
	fuzzy: "fuzzy name hit",
	wordSim: "name word overlap",
	matchType: "name match type",
});

const labelOfEvidence = (key) => EVIDENCE_LABELS[key] ?? key;

export {  EVIDENCE_LABELS, labelOfEvidence  };