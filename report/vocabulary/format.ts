"use strict";

// Small number/word formatters shared by every surface that prints a verdict.
// They only ever produce TEXT: the engine decides ("0.8666…"), the report speaks
// ("0.87", "87%", "yes").

const num = (n) => (typeof n === "number" && Number.isFinite(n) ? n.toFixed(2) : String(n));

const pct = (n) => `${Math.round((Number.isFinite(n) ? n : 0) * 100)}%`;

const showValue = (value) => {
	if (typeof value === "boolean") return value ? "yes" : "no";
	if (Array.isArray(value)) return value.length === 0 ? "none" : value.join(", ");
	if (typeof value === "number") return Number.isInteger(value) ? String(value) : num(value);
	return String(value);
};

export {  num, pct, showValue  };