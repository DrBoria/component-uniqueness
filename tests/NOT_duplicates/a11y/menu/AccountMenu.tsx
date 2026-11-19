import { MenuSurface } from "./MenuSurface";
import { MenuList } from "./MenuList";

export type AccountMenuEntry = { id: string; label: string };

type AccountMenuProps = {
	entries: readonly AccountMenuEntry[];
	onPick: (id: string) => void;
};

/**
 * Canonical account menu. The a11y contract lives 3–5 components below this file:
 * role="menu" + aria-label on MenuList, role="none" on MenuEntry,
 * role="menuitem" + tabIndex on MenuButton.
 */
export function AccountMenu({ entries, onPick }: AccountMenuProps) {
	return (
		<MenuSurface>
			<MenuList entries={entries} onPick={onPick} />
		</MenuSurface>
	);
}
