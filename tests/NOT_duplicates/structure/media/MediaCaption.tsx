import type { ReactNode } from "react";

export function MediaCaption({ children }: { children: ReactNode }) {
	return <figcaption className="flex flex-col gap-[4px] p-[12px]">{children}</figcaption>;
}
