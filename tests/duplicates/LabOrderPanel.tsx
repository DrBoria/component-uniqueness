import React from "react";

const LabOrderPanel = ({ test, onReview, results, onOrder }: { test: string; onReview: () => void; results: { label: string; value: string }[]; onOrder: () => void }) => {
	return (
		<section className="flex flex-col rounded-lg border border-gray-200 bg-white">
			<header className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
				<h2 className="text-base font-semibold text-gray-900">{test}</h2>
				<button type="button" onClick={onReview} className="text-sm text-blue-600">
					Review
				</button>
			</header>
			<div className="flex-1 divide-y divide-gray-100 px-4">
				{results.map((r) => (
					<div key={r.label} className="flex items-center justify-between py-2">
						<span className="text-sm text-gray-500">{r.label}</span>
						<span className="text-sm font-medium text-gray-900">{r.value}</span>
					</div>
				))}
			</div>
			<footer className="flex items-center justify-end border-t border-gray-100 px-4 py-3">
				<button type="button" onClick={onOrder} className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white">
					Order
				</button>
			</footer>
		</section>
	);
};

export default LabOrderPanel;
