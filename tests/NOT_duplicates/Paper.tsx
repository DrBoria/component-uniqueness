import React from "react";

const Paper = ({ children, elevation = 1 }: { children: React.ReactNode; elevation?: number }) => {
	return (
		<div className={`rounded-lg bg-white p-4 shadow-${elevation}`}>
			{children}
		</div>
	);
};

export default Paper;
