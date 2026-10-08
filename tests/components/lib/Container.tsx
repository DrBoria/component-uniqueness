import React from "react";

const Container = ({ children }: { children: React.ReactNode }) => {
	return <div className="mx-auto max-w-2xl p-4">{children}</div>;
};

export default Container;
