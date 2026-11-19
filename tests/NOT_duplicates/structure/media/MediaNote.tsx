import type { ReactNode } from "react";

export function MediaNote({ children }: { children: ReactNode }) {
	return <p className="m-[0px] text-[12px] text-[#64748b]">{children}</p>;
}
