"use strict";

// A finding states WHAT is wrong; a repair states WHAT TO DO. Every repair is
// `{ action, text, target }`: a stable id so the UI can label it without parsing
// the sentence, the sentence from the vocabulary, and the place it points at.

import { PHRASES, fill } from "./vocabulary/phrases";
import { ACTION } from "../constants";

const useCanonical = (left, right) => ({
	action: ACTION.UseCanonical,
	text: fill(PHRASES.fixUseCanonical, { left: left.name, right: right.name, path: right.path }),
	target: right.path ? { path: right.path, line: right.line ?? 1 } : null,
});

const extractComponent = (count) => ({
	action: ACTION.ExtractComponent,
	text: fill(PHRASES.fixExtractComponent, { count }),
	target: null,
});

const replaceRawHtml = (tag, right) => ({
	action: ACTION.ReplaceRawHtml,
	text: fill(PHRASES.fixReplaceRawHtml, { tag, right: right.name, path: right.path }),
	target: right.path ? { path: right.path, line: right.line ?? 1 } : null,
});

const none = () => ({ action: ACTION.None, text: PHRASES.fixKeep, target: null });

export {  useCanonical, extractComponent, replaceRawHtml, none  };