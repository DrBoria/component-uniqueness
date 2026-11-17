"use strict";

import { tokensOf } from "./matcher/a11y";
import { NON_SEMANTIC_TAGS } from "./normalize/dom.js";

const DEFAULT_WEIGHTS = {
	name: 0.10,
	structure: 0.4,
	styles: 0.15,
	behavior: 0.15,
	a11y: 0.1,
	framework: 0.1,
};

const DEFAULT_THRESHOLDS = {
	duplicate: 0.4,
	similar: 0.2,
};

const clamp01 = (x) => Math.max(0, Math.min(1, x));

const resolveWeights = (opts) => {
	const w = (opts && opts.weights) || {};
	return {
		name: w.name ?? DEFAULT_WEIGHTS.name,
		structure: w.structure ?? DEFAULT_WEIGHTS.structure,
		styles: w.styles ?? DEFAULT_WEIGHTS.styles,
		behavior: w.behavior ?? DEFAULT_WEIGHTS.behavior,
		a11y: w.a11y ?? DEFAULT_WEIGHTS.a11y,
		framework: w.framework ?? DEFAULT_WEIGHTS.framework,
	};
};

const resolveThresholds = (opts) => {
	const t = (opts && opts.thresholds) || {};
	return {
		duplicate: t.duplicate ?? DEFAULT_THRESHOLDS.duplicate,
		similar: t.similar ?? DEFAULT_THRESHOLDS.similar,
	};
};

const applicableOf = (candidate) => ({
	name: false,
	behavior: candidate.framework.events.length > 0,
	a11y: tokensOf(candidate, "a11y").size > 0,
	structure: !!candidate.dom.tree && (Object.keys(candidate.dom.tree.css).length > 0 || !NON_SEMANTIC_TAGS.has(candidate.dom.tree.tag)),
	styles: !!candidate.dom.tree,
	framework: candidate.framework.props.length > 0 || candidate.framework.events.length > 0,
});

const applicableWeights = (weights, applicable) => Object.fromEntries(Object.entries(weights).map(([key, w]) => [key, applicable[key] === false ? 0 : w]));

const decide = (candidate, canon, ctx) => {
	const o: any = ctx || {};
	const flagged = Object.fromEntries(Object.entries(o.signals || {}).filter(([, s]: [string, any]) => s && s.applicable === false).map(([key]) => [key, false]));
	const weights: any = applicableWeights(resolveWeights(o), { ...(candidate.partial ? applicableOf(candidate) : {}), ...flagged });
	const thresholds = resolveThresholds(o);

	const signals: any = {};
	for (const key of ["name", "structure", "styles", "behavior", "a11y", "framework"]) {
		const s = o.signals && o.signals[key];
		signals[key] = { score: s ? clamp01(s.score) : 0, evidence: s && s.evidence ? s.evidence : {} };
	}

	const totalW = weights.name + weights.structure + weights.styles + weights.behavior + weights.a11y + weights.framework;
	const weighted =
		weights.name * signals.name.score +
		weights.structure * signals.structure.score +
		weights.styles * signals.styles.score +
		weights.behavior * signals.behavior.score +
		weights.a11y * signals.a11y.score +
		weights.framework * signals.framework.score;
	const confidence = totalW === 0 ? 0 : clamp01(weighted / totalW);

	let isDuplicate = false;
	let tier = null;
	if (confidence >= thresholds.duplicate) {
		isDuplicate = true;
		tier = "duplicate";
	} else if (confidence >= thresholds.similar) {
		tier = "similar";
	}

	// A duplicate is the SAME component, not two components that happen to share
	// a design system. When the structure signal is applicable but its tree
	// coverage is weak (less than half of the larger tree corresponds), shared
	// styles / behavior / a11y must not carry the pair to a duplicate verdict:
	// pixel-identical widgets that announce different things, or filter panels
	// with different contents, are similar at most.
	const structureEvidence = signals.structure.evidence || {};
	const structureWeak = o.signals && o.signals.structure && o.signals.structure.applicable !== false && typeof structureEvidence.similarity === "number" && structureEvidence.similarity < 0.5;
	if (isDuplicate && structureWeak) {
		isDuplicate = false;
		tier = confidence >= thresholds.similar ? "similar" : null;
	}

	// Two widgets that ANNOUNCE different things are not the same component,
	// however identical they look: a collapse toggle (aria-pressed) and a menu
	// disclosure (aria-expanded + aria-controls) with different accessible names
	// serve different purposes. When both sides carry explicit accessibility
	// markup and the semantic announcement comparison is weak, the pair is at
	// most similar — shared pixels do not overrule a different screen-reader
	// contract.
	const a11yEvidence = signals.a11y.evidence || {};
	const a11yContradicts = a11yEvidence.form === "semantic" && Array.isArray(a11yEvidence.candidateAnnouncements) && a11yEvidence.candidateAnnouncements.length > 0 && Array.isArray(a11yEvidence.canonicalAnnouncements) && a11yEvidence.canonicalAnnouncements.length > 0 && (a11yEvidence.a11ySimilarity ?? 1) < 0.5;
	if (isDuplicate && a11yContradicts) {
		isDuplicate = false;
		tier = confidence >= thresholds.similar ? "similar" : null;
	}

	const parts = ["name", "structure", "styles", "behavior", "a11y", "framework"].map((key) => `${key} ${signals[key].score.toFixed(2)}`);
	const reason = `confidence ${confidence.toFixed(2)} (${parts.join(", ")})`;

	return {
		isDuplicate,
		confidence,
		tier,
		reason,
		signals,
		thresholds,
		weights,
	};
};

const nodeCount = (node) => (node ? 1 + (node.children || []).reduce((sum, child) => sum + nodeCount(child), 0) : 0);

const tagCount = (match) => nodeCount(match.canon.dom && match.canon.dom.tree);

const bestOf = (matches) =>
	[...matches].sort((a, b) => b.decision.confidence - a.decision.confidence || tagCount(a) - tagCount(b) || a.canon.name.localeCompare(b.canon.name))[0] || null;

export {
	decide,
	bestOf,
	resolveWeights,
	resolveThresholds,
	clamp01,
	DEFAULT_WEIGHTS,
	DEFAULT_THRESHOLDS,
};
