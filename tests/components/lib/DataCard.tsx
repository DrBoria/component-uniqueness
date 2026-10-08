import React from "react";

const DataCard = ({ title, status, children }: { title: string; status: string; children: React.ReactNode }) => {
	return (
		<div className="rounded-lg border border-gray-200 bg-white shadow-sm">
			<div className="flex items-center justify-between border-b border-gray-100 px-4 py-2">
				<span className="text-sm font-semibold">{title}</span>
				<span className="text-xs text-gray-500">{status}</span>
			</div>
			<div className="px-4 py-3">{children}</div>
		</div>
	);
};

export default DataCard;
