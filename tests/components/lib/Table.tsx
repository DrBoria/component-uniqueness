import React from "react";

interface Column<T> {
	key: string;
	header: string;
}

interface TableProps<T> {
	columns: Column<T>[];
	rows: T[];
	rowKey: (row: T) => string;
	onRowClick?: (row: T) => void;
}

const Table = <T,>({ columns, rows, rowKey, onRowClick }: TableProps<T>) => {
	return (
		<div className="overflow-x-auto rounded-lg border border-gray-200">
			<table className="w-full text-sm">
				<thead className="bg-gray-50">
					<tr>
						{columns.map((col) => (
							<th key={col.key} className="px-4 py-2 text-left font-semibold text-gray-700">
								{col.header}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-100">
					{rows.map((row) => (
						<tr
							key={rowKey(row)}
							className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
							onClick={onRowClick ? () => onRowClick(row) : undefined}
						>
							{columns.map((col) => (
								<td key={col.key} className="px-4 py-2 text-gray-600">
									{String(row[col.key as keyof T] ?? "")}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Table;
