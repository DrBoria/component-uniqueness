import type { ReactNode } from "react";

type CalloutFrameProps = {
	tone: "info" | "warning";
	children: ReactNode;
};

export function CalloutFrame({ tone, children }: CalloutFrameProps) {
	return (
		<div
			role="alert"
			className={`flex flex-col gap-[8px] rounded-[8px] border p-[16px] ${
				tone === "warning"
					? "border-[#fde68a] bg-[#fffbeb]"
					: "border-[#bfdbfe] bg-[#eff6ff]"
			}`}
		>
			{children}
		</div>
	);
}
