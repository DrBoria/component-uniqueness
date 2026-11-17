"use strict";

import React from "react";
import { CodeDiff } from "@md-code/code-diff/view";
import { adaptLegacyBoard, adaptLegacyTheme } from "@md-code/code-diff";
import { tones, boardTheme } from "../../domain/tones";
import { tokenizerFor } from "../../domain/syntax";

// ── THE BOARD ──────────────────────────────────────────────────────────────
//
// A thin adapter. The domain (board.js / snapshot-board.js) states the facts;
// code-diff's legacy adapter turns them into rows + ribbons. Two-column boards
// keep one corridor; five-column snapshot boards put a narrow corridor after
// every column but the last and scroll each snapshot beside its own code.

const plainTokenizer = (text) => [{ text }];

export const PairBoard = ({ board, corridor, reveal, onReveal, snapshot = false }) => {
	if (!board) return null;
	const { columns, ribbons } = adaptLegacyBoard(board);
	const theme = adaptLegacyTheme(boardTheme, tones);
	const tokenize = (text, column) => {
		const col = board.columns[Number(column)];
		if (snapshot && col && col.id !== "0" && col.id !== "4") return plainTokenizer(text);
		return tokenizerFor(col?.path)(text);
	};
	const corridors = snapshot ? columns.map((_, index) => (index < columns.length - 1 ? 70 : undefined)) : [corridor, undefined];
	const sync = snapshot
		? [
				{ columns: ["1", "3"], axis: "xy" },
				{ columns: ["0", "4"], axis: "xy" },
				{ columns: ["0", "2", "4"], axis: "y" },
			]
		: [{ columns: columns.map((c) => c.id), axis: "xy" }];

	return (
		<CodeDiff
			theme={theme}
			columns={columns}
			ribbons={ribbons}
			corridors={corridors}
			sync={sync}
			fit="scroll"
			tokenize={tokenize}
			state={{ revealed: reveal }}
			events={onReveal === undefined ? undefined : { "board:revealChange": (p) => onReveal(p.revealed) }}
			config={{ boardHeight: "68vh", fullMount: 120 }}
		/>
	);
};

export default PairBoard;
