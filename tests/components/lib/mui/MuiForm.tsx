import React from "react";
import {
	Box,
	TextField,
	Select,
	InputLabel,
	FormControl,
	MenuItem,
	Checkbox,
	FormControlLabel,
	FormHelperText,
	Button,
	Divider,
	Stack,
	Alert,
	Typography,
} from "@mui/material";

interface MuiFormProps {
	onSubmit: () => void;
}

const MuiForm = ({ onSubmit }: MuiFormProps) => {
	return (
		<Box component="form" sx={{ maxWidth: 480 }} onSubmit={(e: React.FormEvent) => { e.preventDefault(); onSubmit(); }}>
			<Typography variant="h6" component="h2">
				Account settings
			</Typography>
			<Alert severity="info">Changes are saved automatically.</Alert>
			<Stack spacing={3} sx={{ mt: 2 }}>
				<TextField label="Full name" required variant="outlined" fullWidth />
				<TextField label="Email" type="email" required variant="outlined" fullWidth />
				<FormControl variant="outlined" fullWidth required>
					<InputLabel id="role-label">Role</InputLabel>
					<Select labelId="role-label" label="Role">
						<MenuItem value="admin">Admin</MenuItem>
						<MenuItem value="viewer">Viewer</MenuItem>
					</Select>
					<FormHelperText>Choose the access level.</FormHelperText>
				</FormControl>
				<FormControlLabel control={<Checkbox />} label="Subscribe to updates" />
				<Divider />
				<Stack direction="row" spacing={2} justifyContent="flex-end">
					<Button variant="text">Cancel</Button>
					<Button variant="contained" type="submit">
						Save
					</Button>
				</Stack>
			</Stack>
		</Box>
	);
};

export default MuiForm;
