import Link from "next/link";

const SECTIONS = [
	{ href: "/projects", label: "Projects", current: true },
	{ href: "/reports", label: "Reports", current: false },
	{ href: "/team", label: "Team", current: false },
] as const;

export function PrimaryNav() {
	return (
		<nav aria-label="Main" className="flex items-center gap-[16px]">
			{SECTIONS.map((section) => (
				<Link
					key={section.href}
					href={section.href}
					aria-current={section.current ? "page" : undefined}
					className={
						section.current
							? "text-[13px] font-medium text-[#4f46e5]"
							: "text-[13px] font-medium text-[#64748b] hover:text-[#0f172a]"
					}
				>
					{section.label}
				</Link>
			))}
		</nav>
	);
}
