import { Menu } from "lucide-react";

type NavToggleProps = {
	expanded: boolean;
	onToggle: () => void;
};

/** Keyboard-reachable disclosure button; glyph hidden, state via aria-expanded. */
export function NavToggle({ expanded, onToggle }: NavToggleProps) {
	return (
		<button
			type="button"
			aria-label="Open navigation menu"
			aria-expanded={expanded}
			aria-controls="primary-nav"
			onClick={onToggle}
			className="inline-flex h-[36px] w-[36px] items-center justify-center rounded-[6px] border border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc]"
		>
			<Menu className="h-[20px] w-[20px]" aria-hidden="true" />
		</button>
	);
}
