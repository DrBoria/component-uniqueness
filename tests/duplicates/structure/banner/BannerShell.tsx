import type { ReactNode } from "react";

type BannerShellProps = {
	severity: "info" | "warning";
	children: ReactNode;
};

export function BannerShell({ severity, children }: BannerShellProps) {
	return (
		<div
			role="alert"
			className={`flex flex-col gap-[8px] rounded-[8px] border p-[16px] ${
				severity === "warning"
					? "border-[#fde68a] bg-[#fffbeb]"
					: "border-[#bfdbfe] bg-[#eff6ff]"
			}`}
		>
			{children}
		</div>
	);
}
