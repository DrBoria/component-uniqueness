import type { ReactNode } from "react";

export function CalloutText({ children }: { children: ReactNode }) {
	return <p className="m-[0px] text-[13px] leading-[20px] text-[#475569]">{children}</p>;
}
