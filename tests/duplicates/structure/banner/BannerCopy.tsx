import type { ReactNode } from "react";

/** Extra grouping level that emits no DOM of its own. */
export function BannerCopy({ children }: { children: ReactNode }) {
	return <>{children}</>;
}
