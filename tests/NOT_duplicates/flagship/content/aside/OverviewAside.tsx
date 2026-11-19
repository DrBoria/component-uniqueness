import { InviteTeammate } from "./InviteTeammate";
import { ActivityFeed } from "./ActivityFeed";
import { TeamRoster } from "./TeamRoster";

type OverviewAsideProps = {
	inviteEmail: string;
	onInviteEmailChange: (next: string) => void;
	onInvite: () => void;
};

export function OverviewAside({ inviteEmail, onInviteEmailChange, onInvite }: OverviewAsideProps) {
	return (
		<aside className="flex w-[300px] flex-col gap-[24px]">
			<InviteTeammate
				inviteEmail={inviteEmail}
				onInviteEmailChange={onInviteEmailChange}
				onInvite={onInvite}
			/>
			<ActivityFeed />
			<TeamRoster />
		</aside>
	);
}
