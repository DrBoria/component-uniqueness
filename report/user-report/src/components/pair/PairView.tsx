"use strict";

import React, { useState } from "react";
import styled from "styled-components";
import { SIGNALS } from "../../../../vocabulary/labels";
import { usePairBoard } from "../../hooks/usePairBoard";
import { buildSnapshotBoard } from "../../domain/snapshot-board";
import { PairTabs } from "./PairTabs";
import { PairLegend } from "./PairLegend";
import { PairBoard } from "./PairBoard";
import { Detail } from "./Detail";
import { pairTheme } from "./theme";

// ── THE PAIR VIEW ─────────────────────────────────────────────────────────
//
// Composition only. The board model (rows + lanes) is built by code-diff through
// the usePairBoard hook; this view owns the selected signal tab, the gutter width
// and the show-all toggle, and hands the result to the board. It draws no code,
// no rectangle, no ribbon itself.

const GUTTERS = { 3: 220, 4: 300, 5: 380 };

const Frame = styled.div`
	border: 1px solid ${pairTheme.chrome.border};
	border-radius: ${pairTheme.radius.md};
	overflow: hidden;
	background: ${pairTheme.chrome.panelAlt};
`;

const Head = styled.div`
	display: grid;
	grid-template-columns: ${(p) => p.$template};
	background: ${pairTheme.chrome.panelAlt};
	border-bottom: 1px solid ${pairTheme.chrome.border};
	font-family: ${pairTheme.font.sans};
	font-size: 11px;
	color: ${pairTheme.chrome.dim};
	& > div { padding: 4px 6px; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
`;

export const PairView = ({ pair, decision }) => {
	const [mode, setMode] = useState(SIGNALS[0].key);
	const [set, setSet] = useState(5);
	const [expanded, setExpanded] = useState(false);
	const board = usePairBoard(pair, mode);

	if (!pair) return null;
	const gutter = GUTTERS[set];
	const columns = pair.columns ?? [];
	// Structure, Styles and Accessibility are five-column snapshot screens: code,
	// the framework-built snapshot, the match, the snapshot, code. Other signals
	// keep the two-column code board.
	const isSnapshot = mode === "structure" || mode === "a11y" || mode === "styles";
	const snapshotBoard = isSnapshot ? buildSnapshotBoard(pair, mode) : null;
	const shownBoard = snapshotBoard ?? board;
	const shownColumns = snapshotBoard ? snapshotBoard.columns : columns;
	const headTemplate = snapshotBoard ? "2fr 1fr 1fr 1fr 2fr" : `minmax(0, 1fr) ${gutter}px minmax(0, 1fr)`;
	const headLabel = (column, index) => {
		if (!snapshotBoard) return column.path ?? "";
		if (column.id === "0" || column.id === "4") return column.path ?? "";
		if (column.id === "2") return "match";
		if (mode === "a11y") return "screen reader";
		if (mode === "styles") return "resolved css";

		return "html snapshot";
	};

	return (
		<Frame>
			<PairTabs
				mode={mode}
				onMode={setMode}
				expanded={expanded}
				onExpanded={() => setExpanded(!expanded)}
				gutters={GUTTERS}
				set={set}
				onSet={setSet}
			/>
			<PairLegend mode={mode} pair={pair} decision={decision} />
			<Head $template={headTemplate}>
				{shownColumns.map((column, index) => (
					<React.Fragment key={column.id ?? index}>
						<div>{headLabel(column, index)}</div>
						{index < shownColumns.length - 1 ? <div /> : null}
					</React.Fragment>
				))}
			</Head>
			{/* A tab is a DIFFERENT board (2 code columns vs the 5-column snapshot tree).
			    Keying by mode remounts it, so the new board measures its own rows from a
			    clean state instead of inheriting the previous tab's layout. */}
			<PairBoard key={mode} board={shownBoard} corridor={gutter} reveal={expanded} onReveal={setExpanded} snapshot={!!snapshotBoard} />
			<Detail pair={pair} />
		</Frame>
	);
};

export default PairView;
