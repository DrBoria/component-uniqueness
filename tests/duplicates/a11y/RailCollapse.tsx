import { Menu } from "lucide-react";

type RailCollapseProps = {
	collapsed: boolean;
	onFlip: () => void;
};

/**
 * NEGATIVE trap. Pixel-identical to NavToggle, but it announces something else:
 * different name, toggle semantics (aria-pressed) instead of disclosure
 * (aria-expanded), the glyph is exposed as a named image, and tabIndex=-1
 * removes it from the tab order entirely. Not the same control.
 */
export function RailCollapse({ collapsed, onFlip }: RailCollapseProps) {
	return (
		<div
			role="button"
			tabIndex={-1}
			aria-label="Collapse sidebar"
			aria-pressed={collapsed}
			onClick={onFlip}
			className="inline-flex h-[36px] w-[36px] items-center justify-center rounded-[6px] border border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc]"
		>
			<span role="presentation">
				<Menu className="h-[20px] w-[20px]" role="img" aria-label="Sidebar glyph" />
			</span>
		</div>
	);
}
