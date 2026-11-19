import React from "react";

const Box = ({ children }: { children: React.ReactNode }) => {
	return <div className="flex flex-col gap-2 p-3">{children}</div>;
};

export default Box;
