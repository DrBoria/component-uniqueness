import React from "react";

const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "primary" | "danger" }) => {
	const cls = variant === "primary" ? "bg-blue-100 text-blue-800" : variant === "danger" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800";

	return (
		<span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
			{children}
		</span>
	);
};

export default Badge;
