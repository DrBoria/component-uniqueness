import React from "react";
import styled from "styled-components";
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

const CardForm = styled(Box)`
	border-radius: 16px;
	border: 1px solid #e5e7eb;
	padding: 32px;
	background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);

	h2 {
		margin-bottom: 12px;
	}
`;

interface MuiFormOverrideProps {
	onSubmit: () => void;
}

const MuiFormOverride = ({ onSubmit }: MuiFormOverrideProps) => {
	return (
		<CardForm component="form" maxWidth="md" onSubmit={(e: React.FormEvent) => { e.preventDefault(); onSubmit(); }}>
			<Typography variant="h6" component="h2">
				Workspace settings
			</Typography>
			<Alert severity="warning">This form overrides the base MUI form styles.</Alert>
			<Stack spacing={3} sx={{ mt: 2 }}>
				<TextField label="Display name" required variant="outlined" fullWidth />
				<TextField label="Email" type="email" required variant="outlined" fullWidth />
				<FormControl variant="outlined" fullWidth required>
					<InputLabel id="team-label">Team</InputLabel>
					<Select labelId="team-label" label="Team">
						<MenuItem value="core">Core</MenuItem>
						<MenuItem value="platform">Platform</MenuItem>
					</Select>
					<FormHelperText>Team access is inherited.</FormHelperText>
				</FormControl>
				<FormControlLabel control={<Checkbox />} label="Email me on mentions" />
				<Divider />
				<Stack direction="row" spacing={2} justifyContent="flex-end">
					<Button variant="text">Cancel</Button>
					<Button variant="contained" type="submit">
						Apply
					</Button>
				</Stack>
			</Stack>
		</CardForm>
	);
};

export default MuiFormOverride;
