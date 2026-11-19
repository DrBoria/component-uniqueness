import { TrendingUp } from "lucide-react";

type StatCardProps = {
	label: string;
	value: string;
	delta: string;
};

/** Compact KPI tile: header row, big number, delta line. No media, no links. */
export function StatCard({ label, value, delta }: StatCardProps) {
	return (
		<article className="flex w-[220px] flex-col gap-[6px] rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-[16px]">
			<header className="flex items-center gap-[6px] text-[12px] font-medium text-[#64748b]">
				<TrendingUp className="h-[14px] w-[14px]" aria-hidden="true" />
				<h3 className="m-[0px] text-[12px] font-medium">{label}</h3>
			</header>
			<p className="m-[0px] text-[26px] font-semibold leading-[32px] text-[#0f172a]">{value}</p>
			<span className="text-[12px] font-medium text-[#166534]">{delta}</span>
		</article>
	);
}
