import Image from "next/image";
import Link from "next/link";
import type { OverviewMilestone } from "./MilestoneBoard";

export function MilestoneCard({ milestone }: { milestone: OverviewMilestone }) {
	return (
		<article className="flex flex-col gap-[8px] rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] p-[14px]">
			<Image
				src={`/milestones/${milestone.id}.png`}
				alt=""
				width={240}
				height={80}
				className="h-[80px] w-full rounded-[6px] object-cover"
			/>
			<h3 className="m-[0px] text-[13px] font-semibold text-[#0f172a]">{milestone.name}</h3>
			<p className="m-[0px] text-[12px] leading-[18px] text-[#64748b]">{milestone.summary}</p>
			<div className="flex items-center gap-[8px]">
				<div
					role="progressbar"
					aria-label={`${milestone.name} progress`}
					aria-valuenow={milestone.percent}
					aria-valuemin={0}
					aria-valuemax={100}
					className="h-[6px] flex-1 overflow-hidden rounded-full bg-[#e2e8f0]"
				>
					<div
						className="h-[6px] rounded-full bg-[#4f46e5]"
						style={{ width: `${milestone.percent}%` }}
					/>
				</div>
				<span className="text-[11px] font-medium text-[#475569]">{milestone.percent}%</span>
			</div>
			<footer className="flex items-center justify-between">
				<span className="text-[11px] text-[#94a3b8]">Ships {milestone.shipDate}</span>
				<Link
					href={`/milestones/${milestone.id}`}
					className="text-[11px] font-medium text-[#4f46e5] hover:underline"
				>
					Details
				</Link>
			</footer>
		</article>
	);
}
