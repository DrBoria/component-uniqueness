import { Activity } from "lucide-react";
import { TileFrame } from "./TileFrame";
import { TileHeading } from "./TileHeading";
import { TileValue } from "./TileValue";
import { TileDelta } from "./TileDelta";

export function VelocityTile({ points, trend }: { points: string; trend: string }) {
	return (
		<TileFrame>
			<TileHeading
				glyph={<Activity className="h-[14px] w-[14px]" aria-hidden="true" />}
				label="Velocity"
			/>
			<TileValue>{points}</TileValue>
			<TileDelta tone="positive">{trend}</TileDelta>
		</TileFrame>
	);
}
