import { Info, AlertTriangle } from "lucide-react";

type CalloutGlyphProps = { tone: "info" | "warning" };

export function CalloutGlyph({ tone }: CalloutGlyphProps) {
	if (tone === "warning") {
		return (
			<AlertTriangle
				className="h-[18px] w-[18px] shrink-0 text-[#d97706]"
				aria-hidden="true"
			/>
		);
	}
	return <Info className="h-[18px] w-[18px] shrink-0 text-[#2563eb]" aria-hidden="true" />;
}
