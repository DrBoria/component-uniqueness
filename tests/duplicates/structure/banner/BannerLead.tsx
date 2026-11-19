import type { ReactNode } from "react";
import { BannerAccent } from "./BannerAccent";

type BannerLeadProps = {
	severity: "info" | "warning";
	children: ReactNode;
};

export function BannerLead({ severity, children }: BannerLeadProps) {
	return (
		<div className="flex items-start gap-[10px]">
			<BannerAccent severity={severity} />
			{children}
		</div>
	);
}
