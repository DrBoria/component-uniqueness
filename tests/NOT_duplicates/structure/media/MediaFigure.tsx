import type { ReactNode } from "react";

export function MediaFigure({ children }: { children: ReactNode }) {
	return (
		<figure className="m-[0px] w-[280px] overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-[#ffffff]">
			{children}
		</figure>
	);
}
