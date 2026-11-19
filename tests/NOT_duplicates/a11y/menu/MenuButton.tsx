import type { AccountMenuEntry } from "./AccountMenu";

type MenuButtonProps = {
	entry: AccountMenuEntry;
	onPick: (id: string) => void;
};

/** Depth 5 — the actual menuitem, roving-tabindex managed by the parent menu. */
export function MenuButton({ entry, onPick }: MenuButtonProps) {
	return (
		<button
			type="button"
			role="menuitem"
			tabIndex={-1}
			onClick={() => onPick(entry.id)}
			className="flex w-full items-center rounded-[6px] px-[10px] py-[8px] text-left text-[13px] text-[#334155] hover:bg-[#f1f5f9]"
		>
			{entry.label}
		</button>
	);
}
