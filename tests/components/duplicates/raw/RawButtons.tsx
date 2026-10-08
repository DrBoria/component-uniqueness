import React from "react";

const RawButtons = () => {
	return (
		<div className="flex gap-2">
			<button type="button" onClick={() => {}} className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
				Submit
			</button>
			<button type="button" aria-label="Delete item" className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
				Delete
			</button>
		</div>
	);
};

export default RawButtons;
