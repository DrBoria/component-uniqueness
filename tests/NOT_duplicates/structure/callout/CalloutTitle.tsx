import type { ReactNode } from "react";

export function CalloutTitle({ children }: { children: ReactNode }) {
	return <strong className="text-[13px] font-semibold text-[#0f172a]">{children}</strong>;
}
