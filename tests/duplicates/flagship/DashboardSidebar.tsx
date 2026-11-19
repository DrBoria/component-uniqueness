import Image from "next/image";
import Link from "next/link";
import { GitCommit, MessageSquare, UserPlus, Rocket, AlertCircle } from "lucide-react";
import {
	PaddedPanel,
	PanelTitle,
	InviteForm,
	FieldLabel,
	TextField,
	DarkAction,
	Feed,
	FeedRow,
	FeedMain,
	FeedText,
	RosterName,
	TinyMuted,
	Roster,
	RosterRow,
	RowMain,
	TinyLink,
} from "./primitives";

type SidebarProps = {
	email: string;
	onEmail: (next: string) => void;
	onSendInvite: () => void;
};

const EVENTS = [
	{ id: "a1", icon: GitCommit, text: "Grace merged invoice-rounding fix", when: "2h ago" },
	{ id: "a2", icon: MessageSquare, text: "Ada commented on onboarding checklist", when: "5h ago" },
	{ id: "a3", icon: UserPlus, text: "Margaret invited linus@northwind.dev", when: "Yesterday" },
	{ id: "a4", icon: Rocket, text: "Deploy 142 promoted to production", when: "Yesterday" },
	{ id: "a5", icon: AlertCircle, text: "Contrast audit flagged 3 blockers", when: "2d ago" },
] as const;

const PEOPLE = [
	{ id: "u1", name: "Ada Lovelace", role: "Tech lead", avatar: "/avatars/ada.png" },
	{ id: "u2", name: "Grace Hopper", role: "Backend", avatar: "/avatars/grace.png" },
	{ id: "u3", name: "Linus Vega", role: "Design systems", avatar: "/avatars/linus.png" },
	{ id: "u4", name: "Margaret Hale", role: "Platform", avatar: "/avatars/margaret.png" },
	{ id: "u5", name: "Alan Reyes", role: "QA", avatar: "/avatars/alan.png" },
] as const;

/**
 * All three sidebar panels in ONE file, flat — the canon splits them across
 * OverviewAside → InviteTeammate / ActivityFeed → ActivityItem / TeamRoster → TeamMember.
 */
export function DashboardSidebar({ email, onEmail, onSendInvite }: SidebarProps) {
	const invite = (event: { preventDefault: () => void }) => {
		event.preventDefault();
		onSendInvite();
	};

	return (
		<>
			<PaddedPanel>
				<PanelTitle>Invite a teammate</PanelTitle>
				<InviteForm onSubmit={invite}>
					<FieldLabel htmlFor="invite-email">Work email</FieldLabel>
					<TextField
						id="invite-email"
						type="email"
						value={email}
						placeholder="teammate@company.com"
						onChange={(event) => onEmail(event.target.value)}
					/>
					<DarkAction type="submit">Send invite</DarkAction>
				</InviteForm>
			</PaddedPanel>

			<PaddedPanel>
				<PanelTitle>Recent activity</PanelTitle>
				<Feed>
					{EVENTS.map(({ id, icon: Icon, text, when }) => (
						<FeedRow key={id}>
							<Icon className="mt-[2px] h-[14px] w-[14px] text-[#94a3b8]" aria-hidden="true" />
							<FeedMain>
								<FeedText>{text}</FeedText>
								<TinyMuted>{when}</TinyMuted>
							</FeedMain>
						</FeedRow>
					))}
				</Feed>
			</PaddedPanel>

			<PaddedPanel>
				<PanelTitle>Team</PanelTitle>
				<Roster>
					{PEOPLE.map((person) => (
						<RosterRow key={person.id}>
							<Image
								src={person.avatar}
								alt=""
								width={28}
								height={28}
								className="h-[28px] w-[28px] rounded-full object-cover"
							/>
							<RowMain>
								<RosterName>{person.name}</RosterName>
								<TinyMuted>{person.role}</TinyMuted>
							</RowMain>
							<TinyLink as={Link} href={`/team/${person.id}`}>
								Profile
							</TinyLink>
						</RosterRow>
					))}
				</Roster>
			</PaddedPanel>
		</>
	);
}
