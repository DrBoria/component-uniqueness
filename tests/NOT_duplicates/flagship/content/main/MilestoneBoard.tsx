import { MilestoneCard } from "./MilestoneCard";

export type OverviewMilestone = {
	id: string;
	name: string;
	summary: string;
	percent: number;
	shipDate: string;
};

const MILESTONES: readonly OverviewMilestone[] = [
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

export function MilestoneBoard() {
	return (
		<section className="rounded-[12px] border border-[#e2e8f0] bg-[#ffffff]">
			<header className="flex items-center justify-between border-b border-[#e2e8f0] px-[20px] py-[16px]">
				<h2 className="m-[0px] text-[15px] font-semibold text-[#0f172a]">Milestones</h2>
				<span className="text-[12px] text-[#64748b]">3 in flight</span>
			</header>
			<div className="grid grid-cols-3 gap-[12px] p-[20px]">
				{MILESTONES.map((milestone) => (
					<MilestoneCard key={milestone.id} milestone={milestone} />
				))}
			</div>
		</section>
	);
}
