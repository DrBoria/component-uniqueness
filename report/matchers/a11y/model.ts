"use strict";

// The A11Y model: the ARIA roles/attributes and test ids each component carries.

import { buildSet } from "../set-model";

const build = (left, right, signal) => {
	if (!left || !right) return null;
	const ev = signal?.evidence ?? {};
	const leftTokens = [...(ev.candidateA11y ?? []), ...(ev.candidateTestId ?? [])];
	const rightTokens = [...(ev.canonicalA11y ?? []), ...(ev.canonicalTestId ?? [])];
	return buildSet(signal, leftTokens, rightTokens);
};

export {  build  };