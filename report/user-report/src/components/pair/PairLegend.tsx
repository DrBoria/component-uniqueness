"use strict";

import React from "react";
import styled from "styled-components";
import { signalOf } from "../../../../vocabulary/labels";
import { percentOf } from "../../../../evidence";
import { pairTheme } from "./theme";

// The legend under the tabs: what the colours mean, and the selected signal's
// score × weight. Reads only the decision and the analysis scores — no ranges,
// no rows.

const Legend = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
	align-items: center;
	padding: 5px 10px;
	border-bottom: 1px solid ${pairTheme.chrome.border};
	background: ${pairTheme.chrome.panel};
	font-family: ${pairTheme.font.sans};
	font-size: 11.5px;
	color: ${pairTheme.chrome.dim};
`;

const Dot = styled.span`
	display: inline-block;
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: ${(p) => p.$c};
	margin-right: 5px;
`;

export const PairLegend = ({ mode, pair, decision }) => {
	const group = signalOf(mode);
	const signal = (decision?.signals ?? []).find((item) => item.key === mode) ?? null;

	return (
		<Legend>
			<span>
				<Dot $c={pairTheme.band.same} /> red = duplicate · no % = 100% · with % = a partial duplicate at that percent
			</span>
			<span>
				<Dot $c={pairTheme.band.diff} /> green = a member on one side only (100% unique), drawn as a short stub
			</span>
			<span>no ribbon = nothing compared here</span>
			{signal ? (
				<span style={{ marginLeft: "auto", color: pairTheme.chrome.faint }}>
					{group.label} {percentOf(signal.score)}% × {signal.weight.toFixed(2)} = {(signal.score * signal.weight).toFixed(2)}
				</span>
			) : null}
		</Legend>
	);
};

export default PairLegend;