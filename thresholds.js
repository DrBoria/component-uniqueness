"use strict";

const DEFAULTS = {
	minShared: 2,
	minRatioSameTag: 0.4,
	minRatioAnyTag: 0.5,
	exactRatio: 0.8,
	familyMatchMin: 0.35,
};

const clamp01 = (v) => Math.min(1, Math.max(0, v));

function resolveThresholds(opts) {
	const o = opts && typeof opts === "object" ? opts : {};
	const t = (o.thresholds && typeof o.thresholds === "object") ? o.thresholds : {};
	const num = (key) => (typeof t[key] === "number" && Number.isFinite(t[key]) ? t[key] : DEFAULTS[key]);

	return {
		minShared: Math.max(1, Math.floor(num("minShared"))),
		minRatioSameTag: clamp01(num("minRatioSameTag")),
		minRatioAnyTag: clamp01(num("minRatioAnyTag")),
		exactRatio: clamp01(num("exactRatio")),
		familyMatchMin: clamp01(num("familyMatchMin")),
	};
}

const CANON_DUP_STRICT = {
	minShared: 3,
	minRatioSameTag: 0.6,
	minRatioAnyTag: 0.7,
	exactRatio: 0.8,
	familyMatchMin: 0.35,
};

module.exports = { resolveThresholds, DEFAULT_THRESHOLDS: DEFAULTS, CANON_DUP_STRICT };
