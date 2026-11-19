import React from "react";

const Chip = ({ label, onRemove }: { label: string; onRemove?: () => void }) => {
	return (
		<span className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm">
			<span className="text-gray-700">{label}</span>
			{onRemove && (
				<button type="button" onClick={onRemove} className="ml-1 text-gray-400 hover:text-gray-600" aria-label={`Remove ${label}`}>
					&times;
				</button>
			)}
		</span>
	);
};

export default Chip;
