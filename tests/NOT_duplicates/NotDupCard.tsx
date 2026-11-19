import React from "react";

const NotDupCard = ({ title, body }: { title: string; body: string }) => {
	return (
		<figure className="rounded-lg border border-gray-200 bg-white p-4">
			<figcaption className="text-sm font-semibold text-gray-900">{title}</figcaption>
			<blockquote className="mt-2 border-l-2 border-gray-300 pl-3 text-sm italic text-gray-600">{body}</blockquote>
		</figure>
	);
};

export default NotDupCard;
