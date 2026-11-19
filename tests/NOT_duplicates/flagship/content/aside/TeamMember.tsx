import Image from "next/image";
import Link from "next/link";
import type { OverviewMember } from "./TeamRoster";

export function TeamMember({ member }: { member: OverviewMember }) {
	return (
		<li className="flex items-center gap-[10px]">
			<Image
				src={member.avatar}
				alt=""
				width={28}
				height={28}
				className="h-[28px] w-[28px] rounded-full object-cover"
			/>
			<div className="flex flex-1 flex-col">
				<span className="text-[12px] font-medium text-[#0f172a]">{member.name}</span>
				<span className="text-[11px] text-[#94a3b8]">{member.role}</span>
			</div>
			<Link
				href={`/team/${member.id}`}
				className="text-[11px] font-medium text-[#4f46e5] hover:underline"
			>
				Profile
			</Link>
		</li>
	);
}
