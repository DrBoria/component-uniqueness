import { ShieldCheck } from "lucide-react";
import { TileFrame } from "./TileFrame";
import { TileHeading } from "./TileHeading";
import { TileValue } from "./TileValue";
import { TileDelta } from "./TileDelta";

export function CoverageTile({ percent, change }: { percent: string; change: string }) {
	return (
		<TileFrame>
			<TileHeading
				glyph={<ShieldCheck className="h-[14px] w-[14px]" aria-hidden="true" />}
				label="Test coverage"
			/>
			<TileValue>{percent}</TileValue>
			<TileDelta tone="positive">{change}</TileDelta>
		</TileFrame>
	);
}
