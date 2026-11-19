export type TileTone = "positive" | "attention";

type TileDeltaProps = { tone: TileTone; children: string };


export function TileDelta({ tone, children }: TileDeltaProps) {
	return (
		<span
			className={`text-[12px] font-medium ${
				tone === "attention" ? "text-[#b45309]" : "text-[#166534]"
			}`}
		>
			{children}
		</span>
	);
}
