import { Rocket } from "lucide-react";
import { TileFrame } from "./TileFrame";
import { TileHeading } from "./TileHeading";
import { TileValue } from "./TileValue";
import { TileDelta } from "./TileDelta";

export function DeploysTile({ total, note }: { total: string; note: string }) {
	return (
		<TileFrame>
			<TileHeading
				glyph={<Rocket className="h-[14px] w-[14px]" aria-hidden="true" />}
				label="Deploys"
			/>
			<TileValue>{total}</TileValue>
			<TileDelta tone="positive">{note}</TileDelta>
		</TileFrame>
	);
}
