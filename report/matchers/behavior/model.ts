"use strict";

// The BEHAVIOR model: the events each component handles, side by side.

import { buildSet } from "../set-model";

const build = (left, right, signal) => {
	if (!left || !right) return null;
	const ev = signal?.evidence ?? {};
	return buildSet(signal, ev.candidateEvents ?? left.framework?.events, ev.canonicalEvents ?? right.framework?.events);
};

export {  build  };