import type { ReactNode } from "react";

export function BannerHeadline({ children }: { children: ReactNode }) {
	return <strong className="text-[13px] font-semibold text-[#0f172a]">{children}</strong>;
}
