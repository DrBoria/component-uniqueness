import React from "react";

const LinkButton = ({ href, onNavigate }: { href: string; onNavigate: (href: string) => void }) => {
	return <a href={href} onClick={() => onNavigate(href)} className="text-blue-600 underline">Open</a>;
};

export default LinkButton;
