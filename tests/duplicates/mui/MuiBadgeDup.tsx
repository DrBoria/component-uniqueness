import React from "react";
import { Badge } from "@mui/material";

interface MuiBadgeDupProps {
	children: React.ReactNode;
	variant?: "default" | "primary" | "danger";
}

const MuiBadgeDup = ({ children, variant = "default" }: MuiBadgeDupProps) => {
	const color = variant === "primary" ? "primary" : variant === "danger" ? "error" : "default";

	return (
		<Badge color={color} variant="dot" overlap="circular">
			<span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">{children}</span>
		</Badge>
	);
};

export default MuiBadgeDup;
