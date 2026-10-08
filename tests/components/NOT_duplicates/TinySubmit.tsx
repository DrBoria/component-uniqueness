import React from "react";

const TinySubmit = ({ onClick }: { onClick: () => void }) => {
	return (
		<button type="button" onClick={onClick} className="rounded px-3 py-1 text-sm">
			Submit
		</button>
	);
};

export default TinySubmit;
