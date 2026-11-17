"use strict";

import React from "react";
import styled from "styled-components";
import { SIGNALS } from "../../../../vocabulary/labels";
import { pairTheme } from "./theme";

// The signal tabs (one per comparison group), the show-all toggle and the gutter
// width chips. Pure controls: they set state the view owns, draw no code.

const Bar = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 6px;
	padding: 6px 10px;
	border-bottom: 1px solid ${pairTheme.chrome.border};
	background: ${pairTheme.chrome.panel};
	font-family: ${pairTheme.font.sans};
	font-size: 11.5px;
`;

const Tab = styled.button`
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 3px 9px;
	border-radius: 999px;
	border: 1px solid ${(p) => (p.$on ? p.$c : pairTheme.chrome.border)};
	background: ${(p) => (p.$on ? `${p.$c}22` : "transparent")};
	color: ${(p) => (p.$on ? pairTheme.chrome.text : pairTheme.chrome.dim)};
	font: inherit;
	cursor: pointer;
`;

const Dot = styled.span`
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: ${(p) => p.$c};
`;

const Chip = styled.button`
	padding: 0 7px;
	border-radius: 999px;
	border: 1px solid ${(p) => (p.$on ? pairTheme.chrome.borderStrong : pairTheme.chrome.border)};
	background: ${(p) => (p.$on ? pairTheme.chrome.panelAlt : "transparent")};
	color: ${(p) => (p.$on ? pairTheme.chrome.text : pairTheme.chrome.faint)};
	font: inherit;
	font-size: 10.5px;
	cursor: pointer;
`;

export const PairTabs = ({ mode, onMode, expanded, onExpanded, gutters, set, onSet }) => (
	<Bar>
		{SIGNALS.map((item) => (
			<Tab key={item.key} $on={item.key === mode} $c={item.color} title={item.what} onClick={() => onMode(item.key)}>
				<Dot $c={item.color} />
				{item.label}
			</Tab>
		))}
		<Chip $on={!expanded} onClick={onExpanded} title="show every line, folded or not">
			{expanded ? "show all" : "only blocks"}
		</Chip>
		<span style={{ marginLeft: "auto", color: pairTheme.chrome.faint }}>gutter:</span>
		{Object.keys(gutters).map((n) => (
			<Chip key={n} $on={Number(n) === set} onClick={() => onSet(Number(n))} title={`${gutters[n]}px`}>
				{n}
			</Chip>
		))}
	</Bar>
);

export default PairTabs;