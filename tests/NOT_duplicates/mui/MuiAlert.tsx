import React from "react";
import { Alert, AlertTitle } from "@mui/material";

interface MuiAlertProps {
	title: string;
	children: React.ReactNode;
	severity?: "success" | "info" | "warning" | "error";
}

const MuiAlert = ({ title, children, severity = "info" }: MuiAlertProps) => {
	return (
		<Alert severity={severity}>
			<AlertTitle>{title}</AlertTitle>
			{children}
		</Alert>
	);
};

export default MuiAlert;
