import type { ComponentType } from "react";
import {
	Activity,
	AlertCircle,
	Ban,
	CheckCircle2,
	Clock,
	Rocket,
	ShieldCheck,
	Timer,
} from "lucide-react";
import {
	Tile,
	TileHead,
	TileLabel,
	TileNumber,
	TileTrend,
	TileGrid,
} from "./primitives";

type IconType = ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

type MetricSpec = {
	key: string;
	icon: IconType;
	label: string;
	value: string;
	note: string;
	attention?: boolean;
};

/** Flat data table — the canon expresses each of these as its own component file. */
const METRICS: readonly MetricSpec[] = [
	{ key: "velocity", icon: Activity, label: "Velocity", value: "38 pts", note: "+6 vs last sprint" },
	{ key: "issues", icon: AlertCircle, label: "Open issues", value: "12", note: "3 need triage", attention: true },
	{ key: "cycle", icon: Clock, label: "Cycle time", value: "2.4 d", note: "-0.6 d" },
	{ key: "shipped", icon: CheckCircle2, label: "Shipped", value: "27", note: "this quarter" },
	{ key: "review", icon: Timer, label: "Review latency", value: "9 h", note: "-2 h" },
	{ key: "blocked", icon: Ban, label: "Blocked", value: "3", note: "2 awaiting design", attention: true },
	{ key: "deploys", icon: Rocket, label: "Deploys", value: "14", note: "+4 this week" },
	{ key: "coverage", icon: ShieldCheck, label: "Test coverage", value: "86%", note: "+1.2%" },
];

/** One generic tile renderer instead of eight hand-written tile components. */
export function MetricTiles() {
	return (
		<TileGrid>
			{METRICS.map(({ key, icon: Icon, label, value, note, attention }) => (
				<Tile key={key}>
					<TileHead>
						<Icon className="h-[14px] w-[14px]" aria-hidden="true" />
						<TileLabel>{label}</TileLabel>
					</TileHead>
					<TileNumber>{value}</TileNumber>
					<TileTrend $attention={attention}>{note}</TileTrend>
				</Tile>
			))}
		</TileGrid>
	);
}
