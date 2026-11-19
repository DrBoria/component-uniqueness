import React from "react";

const TrashIcon = () => <svg viewBox="0 0 16 16" className="h-3 w-3"><path d="M1 4h14M5 4V2h6v2M3 4l1 10h8l1-10" /></svg>;

const DeleteButton = ({ onDelete }: { onDelete: () => void }) => {
	return (
		<button type="button" onClick={onDelete} className="flex items-center gap-1 rounded bg-red-600 px-3 py-1 text-xs text-white">
			<TrashIcon />
			Delete
		</button>
	);
};

export default DeleteButton;
