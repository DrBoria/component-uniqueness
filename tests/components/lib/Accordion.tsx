import React, { useState } from "react";

interface AccordionItem {
	id: string;
	question: string;
	answer: string;
}

const Accordion = ({ items }: { items: AccordionItem[] }) => {
	const [openId, setOpenId] = useState<string | null>(null);

	return (
		<div className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
			{items.map((item) => {
				const open = openId === item.id;
				return (
					<div key={item.id} className="px-4">
						<button
							type="button"
							className="flex w-full items-center justify-between py-3 text-left"
							onClick={() => setOpenId(open ? null : item.id)}
							aria-expanded={open}
							aria-controls={`panel-${item.id}`}
						>
							<span className="font-medium text-gray-900">{item.question}</span>
							<span className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true">
								&#9660;
							</span>
						</button>
						{open && (
							<div id={`panel-${item.id}`} className="pb-4 text-sm text-gray-600" role="region">
								<p>{item.answer}</p>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default Accordion;
