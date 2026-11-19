import type { ComponentType } from "react";

type ActivityItemProps = {
	icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
	text: string;
	when: string;
};

export function ActivityItem({ icon: Icon, text, when }: ActivityItemProps) {
	return (
		<li className="flex items-start gap-[8px]">
			<Icon className="mt-[2px] h-[14px] w-[14px] text-[#94a3b8]" aria-hidden="true" />
			<div className="flex flex-col">
				<span className="text-[12px] text-[#334155]">{text}</span>
				<span className="text-[11px] text-[#94a3b8]">{when}</span>
			</div>
		</li>
	);
}
