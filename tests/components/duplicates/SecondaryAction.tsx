import React from "react";

const SecondaryAction = ({ label, onClick }: { label: string; onClick: () => void }) => {
	return (
		<button type="button" onClick={onClick} className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
			{label}
		</button>
	);
};

export default SecondaryAction;
