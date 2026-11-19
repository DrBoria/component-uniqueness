import Link from "next/link";

const FOOTER_LINKS = [
	{ href: "/docs", label: "Docs" },
	{ href: "/support", label: "Support" },
	{ href: "/status", label: "Status" },
	{ href: "/changelog", label: "Changelog" },
] as const;

export function OverviewFooter() {
	return (
		<footer className="border-t border-[#e2e8f0] bg-[#ffffff] px-[24px] py-[16px]">
			<div className="mx-auto flex max-w-[1120px] items-center justify-between">
				<p className="m-[0px] text-[12px] text-[#64748b]">© 2026 Northwind Labs</p>
				<nav aria-label="Footer" className="flex items-center gap-[16px]">
					{FOOTER_LINKS.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="text-[12px] text-[#64748b] hover:text-[#0f172a]"
						>
							{link.label}
						</Link>
					))}
				</nav>
			</div>
		</footer>
	);
}
