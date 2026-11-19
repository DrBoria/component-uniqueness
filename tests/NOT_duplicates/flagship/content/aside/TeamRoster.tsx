import { TeamMember } from "./TeamMember";

export type OverviewMember = {
	id: string;
	name: string;
	role: string;
	avatar: string;
};

const MEMBERS: readonly OverviewMember[] = [
	{ id: "u1", name: "Ada Lovelace", role: "Tech lead", avatar: "/avatars/ada.png" },
	{ id: "u2", name: "Grace Hopper", role: "Backend", avatar: "/avatars/grace.png" },
	{ id: "u3", name: "Linus Vega", role: "Design systems", avatar: "/avatars/linus.png" },
	{ id: "u4", name: "Margaret Hale", role: "Platform", avatar: "/avatars/margaret.png" },
	{ id: "u5", name: "Alan Reyes", role: "QA", avatar: "/avatars/alan.png" },
];

export function TeamRoster() {
	return (
		<section className="rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-[20px]">
			<h2 className="m-[0px] text-[15px] font-semibold text-[#0f172a]">Team</h2>
			<ul className="m-[0px] mt-[12px] flex list-none flex-col gap-[10px] p-[0px]">
				{MEMBERS.map((member) => (
					<TeamMember key={member.id} member={member} />
				))}
			</ul>
		</section>
	);
}
