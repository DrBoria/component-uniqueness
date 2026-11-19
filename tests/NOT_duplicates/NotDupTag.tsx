import React from "react";

const NotDupTag = ({ label, count }: { label: string; count: number }) => {
	return (
		<span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs">
			<em className="italic text-gray-500">{label}</em>
			<code className="ml-1 rounded bg-white px-1 font-mono text-gray-700">{count}</code>
		</span>
	);
};

export default NotDupTag;
