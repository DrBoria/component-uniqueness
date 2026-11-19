import { MenuEntry } from "./MenuEntry";
import type { AccountMenuEntry } from "./AccountMenu";

type MenuListProps = {
	entries: readonly AccountMenuEntry[];
	onPick: (id: string) => void;
};

/** Depth 3 — the menu landmark and its accessible name are declared here. */
export function MenuList({ entries, onPick }: MenuListProps) {
	return (
		<ul role="menu" aria-label="Account" className="flex flex-col">
			{entries.map((entry) => (
				<MenuEntry key={entry.id} entry={entry} onPick={onPick} />
			))}
		</ul>
	);
}
