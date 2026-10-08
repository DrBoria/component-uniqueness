import React from "react";

const Panel = ({ children }: { children: React.ReactNode }) => {
	return <div className="border border-gray-200 p-4">{children}</div>;
};

export default Panel;
