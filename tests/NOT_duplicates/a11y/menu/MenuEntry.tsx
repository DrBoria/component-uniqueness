import { MenuButton } from "./MenuButton";
import type { AccountMenuEntry } from "./AccountMenu";

type MenuEntryProps = {
	entry: AccountMenuEntry;
	onPick: (id: string) => void;
};

/** Depth 4 — list semantics are stripped so AT only sees menuitems. */
export function MenuEntry({ entry, onPick }: MenuEntryProps) {
	return (
		<li role="none">
			<MenuButton entry={entry} onPick={onPick} />
		</li>
	);
}
