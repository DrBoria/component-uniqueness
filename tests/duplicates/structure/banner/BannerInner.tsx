import type { ReactNode } from "react";

export function BannerInner({ children }: { children: ReactNode }) {
	return <div className="flex flex-1 flex-col gap-[2px]">{children}</div>;
}
