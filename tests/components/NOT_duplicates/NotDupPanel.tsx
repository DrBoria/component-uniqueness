import React from "react";

interface NotDupPanelProps {
	title: string;
	children: React.ReactNode;
	onClose: () => void;
}

const NotDupPanel = ({ title, children, onClose }: NotDupPanelProps) => {
	return (
		<aside className="fixed right-0 top-0 z-50 flex h-full w-96 flex-col border-l border-gray-200 bg-white shadow-xl">
			<nav className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
				<strong className="text-sm font-semibold text-gray-900">{title}</strong>
				<a href="#" onClick={onClose} className="text-xs text-gray-400 hover:text-gray-600">
					Dismiss
				</a>
			</nav>
			<section className="flex-1 overflow-y-auto p-4">{children}</section>
			<dl className="border-t border-gray-200 px-4 py-3 text-xs text-gray-500">
				<dt>Panel type</dt>
				<dd>Slide-over, not a dialog</dd>
			</dl>
		</aside>
	);
};

export default NotDupPanel;
