import React from "react";

const FullBadgeDiffClasses = ({ children }: { children: React.ReactNode }) => {
	return (
		<span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold bg-indigo-100 text-indigo-800">
			{children}
		</span>
	);
};

export default FullBadgeDiffClasses;
