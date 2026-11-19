import React from "react";

const MiniButton = ({ label, onClick }: { label: string; onClick: () => void }) => {
	return <button type="button" onClick={onClick} className="rounded px-2 py-1 text-xs">{label}</button>;
};

export default MiniButton;
