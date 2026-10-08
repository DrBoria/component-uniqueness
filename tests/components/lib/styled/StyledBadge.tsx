import React from "react";
import styled from "styled-components";

const StyledBadge = styled.span`
	display: inline-flex;
	align-items: center;
	border-radius: 9999px;
	padding: 2px 8px;
	font-size: 12px;
	font-weight: 500;
	background-color: #eff6ff;
	color: #1e40af;
`;

const StyledBadgeComponent = ({ children }: { children: React.ReactNode }) => {
	return <StyledBadge>{children}</StyledBadge>;
};

export default StyledBadgeComponent;
