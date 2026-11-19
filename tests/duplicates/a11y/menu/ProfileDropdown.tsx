import { OptionList } from "./OptionList";

export type ProfileOption = { key: string; text: string };

type ProfileDropdownProps = {
	options: readonly ProfileOption[];
	onChoose: (key: string) => void;
};

/**
 * Same menu, shallower decomposition (3 levels instead of 5) and different names.
 * The a11y attributes sit on different wrapper depths but land on the same elements.
 */
export function ProfileDropdown({ options, onChoose }: ProfileDropdownProps) {
	return (
		<div className="w-[220px] rounded-[8px] border border-[#e2e8f0] bg-[#ffffff] p-[4px] shadow-lg">
			<OptionList options={options} onChoose={onChoose} />
		</div>
	);
}
