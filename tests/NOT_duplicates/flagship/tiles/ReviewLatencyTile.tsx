import { Timer } from "lucide-react";
import { TileFrame } from "./TileFrame";
import { TileHeading } from "./TileHeading";
import { TileValue } from "./TileValue";
import { TileDelta } from "./TileDelta";

export function ReviewLatencyTile({ hours, change }: { hours: string; change: string }) {
	return (
		<TileFrame>
			<TileHeading
				glyph={<Timer className="h-[14px] w-[14px]" aria-hidden="true" />}
				label="Review latency"
			/>
			<TileValue>{hours}</TileValue>
			<TileDelta tone="positive">{change}</TileDelta>
		</TileFrame>
	);
}
