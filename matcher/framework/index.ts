"use strict";

import * as react from "./react.js";

const REGISTRY = {
	react,
};

const getFrameworkMatcher = (framework) => {
	if (!framework) return react;
	const key = String(framework).toLowerCase();
	return REGISTRY[key] || react;
};

export {  getFrameworkMatcher  };
