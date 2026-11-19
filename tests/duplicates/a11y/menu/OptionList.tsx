import { OptionRow } from "./OptionRow";
import type { ProfileOption } from "./ProfileDropdown";

type OptionListProps = {
	options: readonly ProfileOption[];
	onChoose: (key: string) => void;
};

export function OptionList({ options, onChoose }: OptionListProps) {
	return (
		<ul role="menu" aria-label="Account" className="flex flex-col">
			{options.map((option) => (
				<OptionRow key={option.key} option={option} onChoose={onChoose} />
			))}
		</ul>
	);
}
