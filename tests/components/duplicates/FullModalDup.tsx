import React from "react";

interface FullModalDupProps {
	title: string;
	children: React.ReactNode;
	footer?: React.ReactNode;
	onClose: () => void;
}

const FullModalDup = ({ title, children, footer, onClose }: FullModalDupProps) => {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
			<div className="relative z-10 w-full max-w-lg rounded-xl bg-white shadow-2xl" role="dialog" aria-modal="true" aria-label={title}>
				<header className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
					<h2 className="text-lg font-semibold text-gray-900">{title}</h2>
					<button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close dialog">
						&times;
					</button>
				</header>
				<div className="max-h-[60vh] overflow-y-auto px-5 py-4">{children}</div>
				{footer && (
					<footer className="flex justify-end gap-2 border-t border-gray-200 px-5 py-3">{footer}</footer>
				)}
			</div>
		</div>
	);
};

export default FullModalDup;
