import styled from "styled-components";

/** Grey base from styled-components… */
const Chip = styled.span`
	display: inline-flex;
	align-items: center;
	gap: 6px;
	border-radius: 999px;
	background: #e2e8f0;
	color: #334155;
	padding: 4px 10px;
	font-size: 12px;
	font-weight: 600;
	cursor: pointer;
`;

type StatusChipProps = {
	label: string;
	onSelect: () => void;
};

/** …overridden by an inline style to the green "resolved" palette. */
export function StatusChip({ label, onSelect }: StatusChipProps) {
	return (
		<Chip style={{ background: "#dcfce7", color: "#166534" }} onClick={onSelect}>
			<span className="h-[6px] w-[6px] rounded-full bg-current" />
			{label}
		</Chip>
	);
}
