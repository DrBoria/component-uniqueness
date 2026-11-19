import { OverviewMain } from "./main/OverviewMain";
import { OverviewAside } from "./aside/OverviewAside";

type OverviewContentProps = {
	onNewTask: () => void;
	onToggleTask: (id: string) => void;
	inviteEmail: string;
	onInviteEmailChange: (next: string) => void;
	onInvite: () => void;
};

export function OverviewContent({
	onNewTask,
	onToggleTask,
	inviteEmail,
	onInviteEmailChange,
	onInvite,
}: OverviewContentProps) {
	return (
		<div className="mx-auto flex w-full max-w-[1120px] flex-1 gap-[24px] px-[24px] py-[24px]">
			<OverviewMain onNewTask={onNewTask} onToggleTask={onToggleTask} />
			<OverviewAside
				inviteEmail={inviteEmail}
				onInviteEmailChange={onInviteEmailChange}
				onInvite={onInvite}
			/>
		</div>
	);
}
