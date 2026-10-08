import React from "react";
import styled from "styled-components";
import { Button as MuiButtonBase } from "@mui/material";

const RoundAction = styled(MuiButtonBase)`
	border-radius: 9999px;
	padding: 8px 20px;
	font-weight: 600;
	text-transform: none;
	letter-spacing: 0.02em;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

	&:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
	}
`;

interface MuiButtonOverrideDupProps {
	children: React.ReactNode;
	onClick?: () => void;
	variant?: "primary" | "secondary";
}

const MuiButtonOverrideDup = ({ children, onClick, variant = "primary" }: MuiButtonOverrideDupProps) => {
	return (
		<RoundAction variant={variant === "primary" ? "contained" : "outlined"} color={variant === "primary" ? "primary" : "default"} onClick={onClick}>
			{children}
		</RoundAction>
	);
};

export default MuiButtonOverrideDup;
