import React from "react";
import {
	Table as MuiTableBase,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TablePagination,
} from "@mui/material";

interface Column<T> {
	key: string;
	header: string;
}

interface MuiTableProps<T> {
	columns: Column<T>[];
	rows: T[];
	rowKey: (row: T) => string;
	onRowClick?: (row: T) => void;
}

const MuiTable = <T,>({ columns, rows, rowKey, onRowClick }: MuiTableProps<T>) => {
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);

	return (
		<TableContainer component={Paper}>
			<MuiTableBase size="small">
				<TableHead>
					<TableRow>
						{columns.map((col) => (
							<TableCell key={col.key} sx={{ fontWeight: 600 }}>
								{col.header}
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
						<TableRow key={rowKey(row)} hover={!!onRowClick} onClick={onRowClick ? () => onRowClick(row) : undefined}>
							{columns.map((col) => (
								<TableCell key={col.key}>{String(row[col.key as keyof T] ?? "")}</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</MuiTableBase>
			<TablePagination
				component="div"
				count={rows.length}
				page={page}
				onPageChange={(_, newPage) => setPage(newPage)}
				rowsPerPage={rowsPerPage}
				onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
				rowsPerPageOptions={[5, 10, 25]}
			/>
		</TableContainer>
	);
};

export default MuiTable;
