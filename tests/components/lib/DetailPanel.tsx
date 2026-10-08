import React from "react";

const DetailPanel = ({ title, onAction, rows, onPrimary }: { title: string; onAction: () => void; rows: { label: string; value: string }[]; onPrimary: () => void }) => {
	return (
		<section className="flex flex-col rounded-lg border border-gray-200 bg-white">
			<header className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
				<h2 className="text-base font-semibold text-gray-900">{title}</h2>
				<button type="button" onClick={onAction} className="text-sm text-blue-600">
					Action
				</button>
			</header>
			<div className="flex-1 divide-y divide-gray-100 px-4">
				{rows.map((r) => (
					<div key={r.label} className="flex items-center justify-between py-2">
						<span className="text-sm text-gray-500">{r.label}</span>
						<span className="text-sm font-medium text-gray-900">{r.value}</span>
					</div>
				))}
			</div>
			<footer className="flex items-center justify-end border-t border-gray-100 px-4 py-3">
				<button type="button" onClick={onPrimary} className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white">
					Primary
				</button>
			</footer>
		</section>
	);
};

export default DetailPanel;
