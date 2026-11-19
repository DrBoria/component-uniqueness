import Link from "next/link";
import { PageFoot, FootInner, Copyright, NavBar, FootLink } from "./primitives";

const LINKS = [
	{ href: "/docs", label: "Docs" },
	{ href: "/support", label: "Support" },
	{ href: "/status", label: "Status" },
	{ href: "/changelog", label: "Changelog" },
] as const;

export function DashboardColophon() {
	return (
		<PageFoot>
			<FootInner>
				<Copyright>© 2026 Northwind Labs</Copyright>
				<NavBar aria-label="Footer">
					{LINKS.map((link) => (
						<FootLink key={link.href} as={Link} href={link.href}>
							{link.label}
						</FootLink>
					))}
				</NavBar>
			</FootInner>
		</PageFoot>
	);
}
