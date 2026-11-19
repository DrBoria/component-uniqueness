import { Info, AlertTriangle } from "lucide-react";

type BannerAccentProps = { severity: "info" | "warning" };

export function BannerAccent({ severity }: BannerAccentProps) {
	if (severity === "warning") {
		return (
			<AlertTriangle
				className="h-[18px] w-[18px] shrink-0 text-[#d97706]"
				aria-hidden="true"
			/>
		);
	}
	return <Info className="h-[18px] w-[18px] shrink-0 text-[#2563eb]" aria-hidden="true" />;
}
