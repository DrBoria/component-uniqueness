import React from "react";

const LabResultCard = ({ test, value, children }: { test: string; value: string; children: React.ReactNode }) => {
	return (
		<div className="rounded-lg border border-gray-200 bg-white shadow-sm">
			<div className="flex items-center justify-between border-b border-gray-100 px-4 py-2">
				<span className="text-sm font-semibold">{test}</span>
				<span className="text-xs text-gray-500">{value}</span>
			</div>
			<div className="px-4 py-3">{children}</div>
		</div>
	);
};

export default LabResultCard;
