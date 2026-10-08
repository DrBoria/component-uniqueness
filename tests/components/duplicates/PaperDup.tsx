import React from "react";

interface PaperDupProps {
	children: React.ReactNode;
	elevation?: number;
}

const PaperDup = ({ children, elevation = 1 }: PaperDupProps) => {
	return (
		<div className={`rounded-lg bg-white p-4 shadow-${elevation}`}>
			{children}
		</div>
	);
};

export default PaperDup;
