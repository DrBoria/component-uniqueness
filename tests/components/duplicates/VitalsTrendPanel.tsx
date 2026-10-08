import React from "react";

const VitalsTrendPanel = ({ label, onExport, readings, onShare }: { label: string; onExport: () => void; readings: { label: string; value: string }[]; onShare: () => void }) => {
	return (
		<section className="flex flex-col rounded-lg border border-gray-200 bg-white">
			<header className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
				<h2 className="text-base font-semibold text-gray-900">{label}</h2>
				<button type="button" onClick={onExport} className="text-sm text-blue-600">
					Export
				</button>
			</header>
			<div className="flex-1 divide-y divide-gray-100 px-4">
				{readings.map((r) => (
					<div key={r.label} className="flex items-center justify-between py-2">
						<span className="text-sm text-gray-500">{r.label}</span>
						<span className="text-sm font-medium text-gray-900">{r.value}</span>
					</div>
				))}
			</div>
			<footer className="flex items-center justify-end border-t border-gray-100 px-4 py-3">
				<button type="button" onClick={onShare} className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white">
					Share
				</button>
			</footer>
		</section>
	);
};

export default VitalsTrendPanel;
