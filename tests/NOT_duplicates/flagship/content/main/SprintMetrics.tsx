import { VelocityTile } from "../../tiles/VelocityTile";
import { IssuesTile } from "../../tiles/IssuesTile";
import { CycleTimeTile } from "../../tiles/CycleTimeTile";
import { ShippedTile } from "../../tiles/ShippedTile";
import { ReviewLatencyTile } from "../../tiles/ReviewLatencyTile";
import { BlockedTile } from "../../tiles/BlockedTile";
import { DeploysTile } from "../../tiles/DeploysTile";
import { CoverageTile } from "../../tiles/CoverageTile";

export function SprintMetrics({ onNewTask }: { onNewTask: () => void }) {
	return (
		<section className="rounded-[12px] border border-[#e2e8f0] bg-[#ffffff]">
			<header className="flex items-center justify-between border-b border-[#e2e8f0] px-[20px] py-[16px]">
				<h2 className="m-[0px] text-[15px] font-semibold text-[#0f172a]">This sprint</h2>
				<button
					type="button"
					onClick={onNewTask}
					className="rounded-[6px] bg-[#4f46e5] px-[12px] py-[6px] text-[12px] font-semibold text-[#ffffff] hover:bg-[#4338ca]"
				>
					New task
				</button>
			</header>
			<div className="grid grid-cols-4 gap-[12px] p-[20px]">
				<VelocityTile points="38 pts" trend="+6 vs last sprint" />
				<IssuesTile count="12" note="3 need triage" />
				<CycleTimeTile days="2.4 d" change="-0.6 d" />
				<ShippedTile total="27" note="this quarter" />
				<ReviewLatencyTile hours="9 h" change="-2 h" />
				<BlockedTile count="3" note="2 awaiting design" />
				<DeploysTile total="14" note="+4 this week" />
				<CoverageTile percent="86%" change="+1.2%" />
			</div>
		</section>
	);
}
