"use strict";

// The colour keys code-diff paints with. The MODEL owns the colours (the pair
// theme); code-diff only receives them. THE COLOR MODEL: `same` (red) is a
// duplicate at ANY percent — the lane's label carries the percent when it is
// partial; `differs` (green) is a member on ONE side only (100% unique, a stub
// lane). Each has a stronger `hot` fill for the lane under the pointer.

import { pairTheme } from "../components/pair/theme";

export const tones = {
        same: { fill: pairTheme.wash.same, line: pairTheme.ribbon.same, lineHot: pairTheme.ribbon.hot, hot: pairTheme.wash.hot, paint: pairTheme.mark.same },
        differs: { fill: pairTheme.wash.diff, line: pairTheme.ribbon.diff, lineHot: pairTheme.ribbon.hotDiff, hot: pairTheme.wash.hotDiff, paint: pairTheme.mark.diff },
	// A one-sided member is its OWN lane (stub ribbon + word mark), never a row wash.
	added: { fill: pairTheme.wash.diff, line: pairTheme.ribbon.diff, hot: pairTheme.wash.hotDiff, paint: pairTheme.mark.diff },
	removed: { fill: pairTheme.wash.same, line: pairTheme.ribbon.same, hot: pairTheme.wash.hot, paint: pairTheme.mark.same },
};

// The theme code-diff draws its chrome with (paper, ink, ribbons, fonts).
export const boardTheme = {
	paper: pairTheme.chrome.panelAlt,
	paint: pairTheme.mark.same,
	ribbon: pairTheme.chrome.text,
	panel: pairTheme.chrome.panel,
	edge: pairTheme.chrome.border,
	text: pairTheme.chrome.text,
	dim: pairTheme.chrome.dim,
	faint: pairTheme.chrome.faint,
	mono: pairTheme.font.mono,
};
