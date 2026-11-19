import type { ReactNode } from "react";

/** Shared chrome for every KPI tile in the overview grid. */
export function TileFrame({ children }: { children: ReactNode }) {
	return (
		<article className="flex flex-col gap-[6px] rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-[16px]">
			{children}
		</article>
	);
}
