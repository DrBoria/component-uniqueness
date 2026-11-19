import { GitCommit, MessageSquare, UserPlus, Rocket, AlertCircle } from "lucide-react";
import { ActivityItem } from "./ActivityItem";

const ACTIVITY = [
	{ id: "a1", icon: GitCommit, text: "Grace merged invoice-rounding fix", when: "2h ago" },
	{ id: "a2", icon: MessageSquare, text: "Ada commented on onboarding checklist", when: "5h ago" },
	{ id: "a3", icon: UserPlus, text: "Margaret invited linus@northwind.dev", when: "Yesterday" },
	{ id: "a4", icon: Rocket, text: "Deploy 142 promoted to production", when: "Yesterday" },
	{ id: "a5", icon: AlertCircle, text: "Contrast audit flagged 3 blockers", when: "2d ago" },
] as const;

export function ActivityFeed() {
	return (
		<section className="rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-[20px]">
			<h2 className="m-[0px] text-[15px] font-semibold text-[#0f172a]">Recent activity</h2>
			<ol className="m-[0px] mt-[12px] flex list-none flex-col gap-[12px] p-[0px]">
				{ACTIVITY.map((item) => (
					<ActivityItem key={item.id} icon={item.icon} text={item.text} when={item.when} />
				))}
			</ol>
		</section>
	);
}
