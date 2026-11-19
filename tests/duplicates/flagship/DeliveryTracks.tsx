import Image from "next/image";
import Link from "next/link";
import {
	BoardGrid,
	BoardCard,
	CardTitle,
	CardText,
	MeterRow,
	MeterTrack,
	MeterFill,
	MeterValue,
	CardFoot,
	TinyMuted,
	TinyLink,
} from "./primitives";

type Track = {
	id: string;
	name: string;
	summary: string;
	percent: number;
	shipDate: string;
};

const TRACKS: readonly Track[] = [
	{
		id: "m1",
		name: "Q4 billing revamp",
		summary: "Invoice rounding, webhook migration and the new dunning emails.",
		percent: 72,
		shipDate: "Nov 28",
	},
	{
		id: "m2",
		name: "Accessibility pass",
		summary: "Contrast audit, focus rings and screen-reader labels across the app.",
		percent: 41,
		shipDate: "Dec 12",
	},
	{
		id: "m3",
		name: "Mobile shell",
		summary: "Responsive navigation, offline queue and the compact task list.",
		percent: 18,
		shipDate: "Jan 09",
	},
];

export function DeliveryTracks() {
	return (
		<BoardGrid>
			{TRACKS.map((track) => (
				<BoardCard key={track.id}>
					<Image
						src={`/milestones/${track.id}.png`}
						alt=""
						width={240}
						height={80}
						className="h-[80px] w-full rounded-[6px] object-cover"
					/>
					<CardTitle>{track.name}</CardTitle>
					<CardText>{track.summary}</CardText>
					<MeterRow>
						<MeterTrack
							role="progressbar"
							aria-label={`${track.name} progress`}
							aria-valuenow={track.percent}
							aria-valuemin={0}
							aria-valuemax={100}
						>
							<MeterFill $percent={track.percent} />
						</MeterTrack>
						<MeterValue>{track.percent}%</MeterValue>
					</MeterRow>
					<CardFoot>
						<TinyMuted>Ships {track.shipDate}</TinyMuted>
						<TinyLink as={Link} href={`/milestones/${track.id}`}>
							Details
						</TinyLink>
					</CardFoot>
				</BoardCard>
			))}
		</BoardGrid>
	);
}
