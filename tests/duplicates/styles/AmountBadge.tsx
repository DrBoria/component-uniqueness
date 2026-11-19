import styled from "styled-components";

/** Route 2: styled-components template CSS, byte-different source, identical computed CSS. */
const Tag = styled.span`
	display: inline-flex;
	align-items: baseline;
	gap: 4px;
	border-radius: 10px;
	background: #0f172a;
	padding: 6px 14px;
	font-size: 18px;
	font-weight: 700;
	color: #f8fafc;
`;

const Unit = styled.span`
	font-size: 11px;
	font-weight: 500;
	color: #94a3b8;
`;

type AmountBadgeProps = {
	value: string;
	unit: string;
};

export function AmountBadge({ value, unit }: AmountBadgeProps) {
	return (
		<Tag>
			<span>{value}</span>
			<Unit>{unit}</Unit>
		</Tag>
	);
}
