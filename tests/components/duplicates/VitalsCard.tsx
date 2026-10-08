import React from "react";

const VitalsCard = ({ label, reading, children }: { label: string; reading: string; children: React.ReactNode }) => {
	return (
		<div className="rounded-lg border border-gray-200 bg-white shadow-sm">
			<div className="flex items-center justify-between border-b border-gray-100 px-4 py-2">
				<span className="text-sm font-semibold">{label}</span>
				<span className="text-xs text-gray-500">{reading}</span>
			</div>
			<div className="px-4 py-3">{children}</div>
		</div>
	);
};

export default VitalsCard;
