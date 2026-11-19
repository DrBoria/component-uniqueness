import type { ReactNode } from "react";

type TileHeadingProps = { glyph: ReactNode; label: string };

export function TileHeading({ glyph, label }: TileHeadingProps) {
	return (
		<header className="flex items-center gap-[6px] text-[12px] font-medium text-[#64748b]">
			{glyph}
			<h3 className="m-[0px] text-[12px] font-medium">{label}</h3>
		</header>
	);
}
