import React from "react";

const PatientSummaryPanel = ({ name, onEdit, items, onDischarge }: { name: string; onEdit: () => void; items: { label: string; value: string }[]; onDischarge: () => void }) => {
	return (
		<section className="flex flex-col rounded-lg border border-gray-200 bg-white">
			<header className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
				<h2 className="text-base font-semibold text-gray-900">{name}</h2>
				<button type="button" onClick={onEdit} className="text-sm text-blue-600">
					Edit
				</button>
			</header>
			<div className="flex-1 divide-y divide-gray-100 px-4">
				{items.map((i) => (
					<div key={i.label} className="flex items-center justify-between py-2">
						<span className="text-sm text-gray-500">{i.label}</span>
						<span className="text-sm font-medium text-gray-900">{i.value}</span>
					</div>
				))}
			</div>
			<footer className="flex items-center justify-end border-t border-gray-100 px-4 py-3">
				<button type="button" onClick={onDischarge} className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white">
					Discharge
				</button>
			</footer>
		</section>
	);
};

export default PatientSummaryPanel;
