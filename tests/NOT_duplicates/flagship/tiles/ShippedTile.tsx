import { CheckCircle2 } from "lucide-react";
import { TileFrame } from "./TileFrame";
import { TileHeading } from "./TileHeading";
import { TileValue } from "./TileValue";
import { TileDelta } from "./TileDelta";

export function ShippedTile({ total, note }: { total: string; note: string }) {
	return (
		<TileFrame>
			<TileHeading
				glyph={<CheckCircle2 className="h-[14px] w-[14px]" aria-hidden="true" />}
				label="Shipped"
			/>
			<TileValue>{total}</TileValue>
			<TileDelta tone="positive">{note}</TileDelta>
		</TileFrame>
	);
}
