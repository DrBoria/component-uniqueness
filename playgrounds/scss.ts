"use strict";

const resolveClasses = (classes) => {
	return { css: {}, unresolved: [...(classes || [])] };
};

const available = () => false;
export { resolveClasses, available };
