import React from "react";

const Stack = ({ children }: { children: React.ReactNode }) => {
	return <div className="flex flex-col gap-3">{children}</div>;
};

export default Stack;
