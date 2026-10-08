import React from "react";
import styled from "styled-components";

const TableWrap = styled.div`
	overflow-x: auto;
	border-radius: 0.5rem;
	border: 1px solid #e5e7eb;
`;

const Table = styled.table`
	width: 100%;
	font-size: 14px;
`;

const Head = styled.thead`
	background-color: #f9fafb;
`;

const HeadRow = styled.tr`
	display: table-row;
`;

const HeadCell = styled.th`
	padding: 8px 16px;
	text-align: left;
	font-weight: 600;
	color: #374151;
`;

const Body = styled.tbody`
	& tr + tr {
		border-top: 1px solid #f3f4f6;
	}
`;

const BodyRow = styled.tr`
	cursor: pointer;
	&:hover {
		background-color: #f9fafb;
	}
`;

const BodyCell = styled.td`
	padding: 8px 16px;
	color: #4b5563;
`;

const EmptyCell = styled.td`
	padding: 16px;
	text-align: center;
	color: #9ca3af;
`;

interface Column<T> {
	key: string;
	header: string;
}

interface StyledTableProps<T> {
	columns: Column<T>[];
	rows: T[];
	rowKey: (row: T) => string;
	onRowClick?: (row: T) => void;
}

const StyledTable = <T,>({ columns, rows, rowKey, onRowClick }: StyledTableProps<T>) => {
	return (
		<TableWrap>
			<Table>
				<Head>
					<HeadRow>
						{columns.map((col) => (
							<HeadCell key={col.key}>{col.header}</HeadCell>
						))}
					</HeadRow>
				</Head>
				<Body>
					{rows.length === 0 ? (
						<tr>
							<EmptyCell colSpan={columns.length}>No rows</EmptyCell>
						</tr>
					) : (
						rows.map((row) => (
							<BodyRow key={rowKey(row)} onClick={onRowClick ? () => onRowClick(row) : undefined}>
								{columns.map((col) => (
									<BodyCell key={col.key}>{String(row[col.key as keyof T] ?? "")}</BodyCell>
								))}
							</BodyRow>
						))
					)}
				</Body>
			</Table>
		</TableWrap>
	);
};

export default StyledTable;
