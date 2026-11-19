import React from "react";

type Match = {
	id: string;
	name: string;
	code?: string;
	note?: string;
	detail?: string;
};

// A DYNAMIC list component: it maps over a prop and renders one row per item.
// Its DOM tree is deep (root > row > content > title + detail).
const MatchList = ({ matches }: { matches: readonly Match[] }) => (
	<div className="w-full gap-1.5">
		{matches.map((match) => (
			<div key={match.id} className="flex items-center justify-between rounded-md px-3 py-2">
				<div className="min-w-0">
					<div className="text-sm font-semibold">
						<strong>{match.name}</strong>
						{match.code && <code>({match.code})</code>}
					</div>
					{match.detail && <span className="truncate text-xs text-gray-500">{match.detail}</span>}
				</div>
			</div>
		))}
	</div>
);

export default MatchList;
