import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
} from "@mui/material";

interface MuiDialogProps {
	title: string;
	children: React.ReactNode;
	footer?: React.ReactNode;
	open: boolean;
	onClose: () => void;
}

const MuiDialog = ({ title, children, footer, open, onClose }: MuiDialogProps) => {
	return (
		<Dialog open={open} onClose={onClose} aria-labelledby="mui-dialog-title">
			<DialogTitle id="mui-dialog-title">{title}</DialogTitle>
			<DialogContent>
				<DialogContentText>{children}</DialogContentText>
			</DialogContent>
			{footer && (
				<DialogActions>{footer}</DialogActions>
			)}
		</Dialog>
	);
};

export default MuiDialog;
