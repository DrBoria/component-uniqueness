import React from "react";

interface ButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	variant?: "primary" | "secondary";
	disabled?: boolean;
}

const Button = ({ children, onClick, variant = "primary", disabled }: ButtonProps) => {
	const cls = variant === "primary" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50";

	return (
		<button type="button" onClick={onClick} disabled={disabled} className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium ${cls}`}>
			{children}
		</button>
	);
};

export default Button;
