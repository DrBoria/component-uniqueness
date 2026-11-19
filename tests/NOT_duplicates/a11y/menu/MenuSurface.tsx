import type { ReactNode } from "react";

/** Depth 2 — purely visual shell, no a11y semantics here. */
export function MenuSurface({ children }: { children: ReactNode }) {
	return (
		<div className="w-[220px] rounded-[8px] border border-[#e2e8f0] bg-[#ffffff] p-[4px] shadow-lg">
			{children}
		</div>
	);
}
