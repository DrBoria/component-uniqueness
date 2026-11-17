"use strict";

// ── STYLES MATCHER ─────────────────────────────────────────────────────────
//
// Structure says "a button matches a button". Styles asks the next question:
// is it the SAME button — same color, same cursor, same padding? The node pairs
// are the STRUCTURE matcher's best chain (the same correspondence the verdict
// already trusts); each pair is then compared on the CSS properties that MATTER
// for its element role (matcher/css-matching.ts): typography for text, layout
// for containers, offsets for positioned elements, surface for backgrounds.
//
// Styles never invents its own alignment: a weak structure chain yields few
// pairs, so styles cannot inflate a match the structure already doubted.

import { compareCss } from "./css-matching.js";
import { bestChain } from "./structure.js";

const matchStyles = (candidate, canon) => {
	const left = candidate.dom && candidate.dom.tree;
	const right = canon.dom && canon.dom.tree;
	if (!left || !right) return { score: 0, applicable: false, evidence: { pairs: 0 } };

	const pairs = bestChain(left, right).pairs;
	const details = [];
	let totalProps = 0;
	let sameProps = 0;
	for (const [a, b] of pairs) {
		const cmp = compareCss(a.tag, a.css, b.tag, b.css);
		totalProps += cmp.total;
		sameProps += cmp.same;
		details.push({ tag: a.tag, same: cmp.same, total: cmp.total, score: cmp.score, rows: cmp.rows });
	}

	const applicable = totalProps > 0;
	// A single shared property is weak evidence, not full agreement: discount
	// small property sets the same way the behavior signal discounts small event
	// sets, so one `font-size` cannot carry a styles score of 1.0.
	const smallSetDiscount = Math.min(1, totalProps / 3);
	const score = totalProps === 0 ? 0 : (sameProps / totalProps) * smallSetDiscount;

	return {
		score,
		applicable,
		evidence: {
			pairs: pairs.length,
			properties: totalProps,
			agreeing: sameProps,
			details,
		},
	};
};

export { matchStyles };