import React from "react";
import { Button as MuiButtonBase } from "@mui/material";

interface MuiButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	variant?: "primary" | "secondary";
	disabled?: boolean;
}

const MuiButton = ({ children, onClick, variant = "primary", disabled }: MuiButtonProps) => {
	return (
		<MuiButtonBase variant={variant === "primary" ? "contained" : "outlined"} color={variant === "primary" ? "primary" : "default"} onClick={onClick} disabled={disabled}>
			{children}
		</MuiButtonBase>
	);
};

export default MuiButton;
