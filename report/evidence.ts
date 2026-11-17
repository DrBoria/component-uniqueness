"use strict";

// Small evidence helpers the report's React app reads. The engine keeps its
// scoring in the matchers and decision-maker; this module only turns a 0..1
// score into the reader's percentage, the same way every surface prints it.

const percentOf = (value) => Math.round((Number.isFinite(value) ? value : 0) * 100);

export {  percentOf  };