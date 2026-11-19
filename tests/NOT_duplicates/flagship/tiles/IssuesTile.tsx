import { AlertCircle } from "lucide-react";
import { TileFrame } from "./TileFrame";
import { TileHeading } from "./TileHeading";
import { TileValue } from "./TileValue";
import { TileDelta } from "./TileDelta";

export function IssuesTile({ count, note }: { count: string; note: string }) {
	return (
		<TileFrame>
			<TileHeading
				glyph={<AlertCircle className="h-[14px] w-[14px]" aria-hidden="true" />}
				label="Open issues"
			/>
			<TileValue>{count}</TileValue>
			<TileDelta tone="attention">{note}</TileDelta>
		</TileFrame>
	);
}
