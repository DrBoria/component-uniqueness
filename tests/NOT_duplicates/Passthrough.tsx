import React from "react";

const Passthrough = ({ children, ...props }: { children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) => {
	return <div data-slot="passthrough" className={props.className} {...props}>{children}</div>;
};

export default Passthrough;
