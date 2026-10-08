import React from "react";

interface CardProps {
	title: string;
	children: React.ReactNode;
}

const Card = ({ title, children }: CardProps) => {
	return (
		<div className="rounded-xl border border-gray-100 p-5">
			<div className="mb-3 text-sm font-semibold">{title}</div>
			{children}
		</div>
	);
};

export default Card;
