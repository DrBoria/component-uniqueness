"use strict";

// THE CODES. One table, one id per thing the tool can say about a component.
// A producer states a CODE plus its PARAMETERS, and every surface renders it
// through `render()` here: the terminal report, the HTML page and the ESLint
// message all agree. A new kind of finding is one entry here.

import { PHRASES, fill } from "../vocabulary/phrases";
import { CODE, KIND } from "../../constants";

const CODES = {
	[CODE.Duplicate]: { kind: KIND.Duplicate, sentence: (p) => fill(PHRASES.duplicate, p) },
	[CODE.Similar]: { kind: KIND.Similar, sentence: (p) => fill(PHRASES.similar, p) },
	[CODE.Missing]: { kind: KIND.Missing, sentence: (p) => fill(PHRASES.missing, p) },
	[CODE.RawHtml]: { kind: KIND.RawHtml, sentence: (p) => fill(PHRASES.rawHtml, p) },
	[CODE.Part]: { kind: KIND.Part, sentence: (p) => fill(PHRASES.part, p) },
	[CODE.FilteredOut]: { kind: KIND.Dropped, sentence: (p) => fill(PHRASES.filtered, p) },
	[CODE.Confidence]: { kind: null, sentence: (p) => fill(PHRASES.confidence, p) },
	[CODE.Headline]: { kind: null, sentence: (p) => fill(PHRASES.headline, p) },
};

// An unknown code is a producer bug, but it must not crash a report: the id is
// printed where the sentence should be, which is exactly what makes it findable.
const render = (code, params) => {
	const entry = CODES[code];
	if (!entry) return String(code);

	return entry.sentence(params ?? {});
};

const kindOfCode = (code) => CODES[code]?.kind ?? null;

export {  CODES, render, kindOfCode  };