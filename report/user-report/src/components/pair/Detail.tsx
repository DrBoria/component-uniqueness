"use strict";

import React from "react";
import styled from "styled-components";
import { pairTheme } from "./theme";

// ── DETAIL ────────────────────────────────────────────────────────────────
//
// The console block for the whole pair — every signal together, whatever tab is
// open. `pair.cli` IS the text `cli-report` prints for this finding: id, names,
// locations, verdict, reasons, each matcher's own lines, the fix. The page
// renders that string and nothing else: no rerun, no reassembly, no summary.

const Panel = styled.div`
	border-top: 1px solid ${pairTheme.chrome.border};
	background: ${pairTheme.chrome.panelAlt};
	font-family: ${pairTheme.font.mono};
	font-size: 11.5px;
	max-height: 30vh;
	overflow: auto;
`;

const Head = styled.div`
	display: flex;
	gap: 10px;
	align-items: baseline;
	padding: 5px 10px;
	border-bottom: 1px solid ${pairTheme.chrome.border};
	background: ${pairTheme.chrome.panel};
	font-family: ${pairTheme.font.sans};
	font-size: 11.5px;
	color: ${pairTheme.chrome.dim};
`;

const Pre = styled.pre`
	margin: 0;
	padding: 6px 10px;
	font-family: ${pairTheme.font.mono};
	font-size: 11.5px;
	line-height: 1.5;
	white-space: pre-wrap;
	color: ${pairTheme.chrome.text};
`;

export const Detail = ({ pair }) => {
	if (!pair?.cli) return null;

	return (
		<Panel>
			<Head>
				<strong style={{ color: pairTheme.chrome.text }}>CLI Output</strong>
				<span>what the terminal prints for this pair</span>
			</Head>
			<Pre>{pair.cli}</Pre>
		</Panel>
	);
};

export default Detail;
