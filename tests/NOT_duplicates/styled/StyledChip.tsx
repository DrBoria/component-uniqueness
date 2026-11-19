import React from "react";
import styled from "styled-components";

const ChipRoot = styled.span`
	display: inline-flex;
	align-items: center;
	gap: 4px;
	border-radius: 0.375rem;
	border: 1px solid #d1d5db;
	background-color: #fff;
	padding: 4px 12px;
	font-size: 14px;
`;

const ChipLabel = styled.span`
	color: #374151;
`;

const ChipRemove = styled.button`
	margin-left: 4px;
	color: #9ca3af;
	&:hover {
		color: #4b5563;
	}
`;

const StyledChip = ({ label, onRemove }: { label: string; onRemove?: () => void }) => {
	return (
		<ChipRoot>
			<ChipLabel>{label}</ChipLabel>
			{onRemove && (
				<ChipRemove type="button" onClick={onRemove} aria-label={`Remove ${label}`}>
					&times;
				</ChipRemove>
			)}
		</ChipRoot>
	);
};

export default StyledChip;
