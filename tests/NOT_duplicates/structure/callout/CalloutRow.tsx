import type { ReactNode } from "react";
import { CalloutGlyph } from "./CalloutGlyph";

type CalloutRowProps = {
	tone: "info" | "warning";
	children: ReactNode;
};

export function CalloutRow({ tone, children }: CalloutRowProps) {
	return (
		<div className="flex items-start gap-[10px]">
			<CalloutGlyph tone={tone} />
			{children}
		</div>
	);
}
