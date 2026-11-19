import React from "react";

interface GenericBlockProps {
	children: React.ReactNode;
	onClick?: () => void;
}

const GenericBlock = ({ children, onClick }: GenericBlockProps) => {
	return <div className="pb-2 pl-4" onClick={onClick}>{children}</div>;
};

export default GenericBlock;
