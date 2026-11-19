import { Clock } from "lucide-react";
import { TileFrame } from "./TileFrame";
import { TileHeading } from "./TileHeading";
import { TileValue } from "./TileValue";
import { TileDelta } from "./TileDelta";

export function CycleTimeTile({ days, change }: { days: string; change: string }) {
	return (
		<TileFrame>
			<TileHeading
				glyph={<Clock className="h-[14px] w-[14px]" aria-hidden="true" />}
				label="Cycle time"
			/>
			<TileValue>{days}</TileValue>
			<TileDelta tone="positive">{change}</TileDelta>
		</TileFrame>
	);
}
