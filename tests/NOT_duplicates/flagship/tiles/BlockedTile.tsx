import { Ban } from "lucide-react";
import { TileFrame } from "./TileFrame";
import { TileHeading } from "./TileHeading";
import { TileValue } from "./TileValue";
import { TileDelta } from "./TileDelta";

export function BlockedTile({ count, note }: { count: string; note: string }) {
	return (
		<TileFrame>
			<TileHeading
				glyph={<Ban className="h-[14px] w-[14px]" aria-hidden="true" />}
				label="Blocked"
			/>
			<TileValue>{count}</TileValue>
			<TileDelta tone="attention">{note}</TileDelta>
		</TileFrame>
	);
}
