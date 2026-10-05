"use strict";

const resolveClasses = (classes) => {
	return { css: {}, unresolved: [...(classes || [])] };
};

module.exports = { resolveClasses, available: () => false };
