import React from "react";

const SaveButton = ({ onSave }: { onSave: () => void }) => {
	return <button type="button" onClick={onSave} className="rounded bg-green-600 px-3 py-1 text-xs text-white">Save</button>;
};

export default SaveButton;
