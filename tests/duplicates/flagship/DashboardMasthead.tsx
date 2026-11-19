import { Search, Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
	TopBar,
	Wordmark,
	NavBar,
	NavItem,
	CurrentNavItem,
	SearchForm,
	ScreenReaderText,
	SearchField,
	IconSubmit,
	RoundIcon,
	UnreadDot,
} from "./primitives";

type MastheadProps = {
	term: string;
	onTerm: (next: string) => void;
	onRunSearch: () => void;
};

const LINKS = [
	{ href: "/projects", label: "Projects", current: true },
	{ href: "/reports", label: "Reports", current: false },
	{ href: "/team", label: "Team", current: false },
] as const;

/** Header written flat against styled primitives — canon uses six header components. */
export function DashboardMasthead({ term, onTerm, onRunSearch }: MastheadProps) {
	const run = (event: { preventDefault: () => void }) => {
		event.preventDefault();
		onRunSearch();
	};

	return (
		<TopBar>
			<Wordmark as={Link} href="/">
				Northwind
			</Wordmark>
			<NavBar aria-label="Main">
				{LINKS.map((link) =>
					link.current ? (
						<CurrentNavItem key={link.href} as={Link} href={link.href} aria-current="page">
							{link.label}
						</CurrentNavItem>
					) : (
						<NavItem key={link.href} as={Link} href={link.href}>
							{link.label}
						</NavItem>
					),
				)}
			</NavBar>
			<SearchForm role="search" onSubmit={run}>
				<ScreenReaderText htmlFor="overview-search">Search projects</ScreenReaderText>
				<SearchField
					id="overview-search"
					type="search"
					value={term}
					placeholder="Search projects"
					onChange={(event) => onTerm(event.target.value)}
				/>
				<IconSubmit type="submit" aria-label="Search">
					<Search className="h-[16px] w-[16px]" aria-hidden="true" />
				</IconSubmit>
			</SearchForm>
			<RoundIcon type="button" aria-label="Notifications" onClick={onRunSearch}>
				<Bell className="h-[18px] w-[18px]" aria-hidden="true" />
				<UnreadDot />
			</RoundIcon>
			<Image
				src="/avatars/ada.png"
				alt=""
				width={32}
				height={32}
				className="h-[32px] w-[32px] rounded-full object-cover"
			/>
		</TopBar>
	);
}
