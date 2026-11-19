import React from "react";

const TertiaryAction = ({ label, onClick }: { label: string; onClick: () => void }) => {
	return (
		<button type="button" onClick={onClick} className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
			{label}
		</button>
	);
};

export default TertiaryAction;
