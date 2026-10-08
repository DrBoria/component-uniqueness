import React from "react";

interface Hint {
	label: string;
	hint: string;
}

interface HintListProps {
	hints: Hint[];
}

const HintList = ({ hints }: HintListProps) => {
	return (
		<div className="rounded-lg border border-gray-200">
			{hints.map((h, i) => (
				<div key={h.label} className="border-t first:border-t-0" data-index={i}>
					<div className="px-2 pt-2 text-xs font-semibold text-gray-500">{h.label}</div>
					<div className="px-2 pb-2 text-sm text-gray-700">{h.hint}</div>
				</div>
			))}
		</div>
	);
};

export default HintList;
