import React from "react";

const Section = ({ children }: { children: React.ReactNode }) => {
	return <div className="rounded-md p-6">{children}</div>;
};

export default Section;
