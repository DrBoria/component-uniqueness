"use strict";

// The board for one pair and one selected signal, memoized. All the work is
// code-diff's (diff + lane resolution); this hook only caches it so a tab switch
// or a hover does not re-align the spans.

import { useMemo } from "react";
import { buildBoard } from "../domain/board";

export const usePairBoard = (pair, signal) => useMemo(() => (pair ? buildBoard(pair, signal) : null), [pair, signal]);
