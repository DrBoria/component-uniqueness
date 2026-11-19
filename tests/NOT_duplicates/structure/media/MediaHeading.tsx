import type { ReactNode } from "react";

export function MediaHeading({ children }: { children: ReactNode }) {
	return <h3 className="m-[0px] text-[14px] font-semibold text-[#0f172a]">{children}</h3>;
}
