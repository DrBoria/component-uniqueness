import type { ProfileOption } from "./ProfileDropdown";

type OptionRowProps = {
	option: ProfileOption;
	onChoose: (key: string) => void;
};

/** Two a11y layers collapsed into one file — same final HTML as MenuEntry + MenuButton. */
export function OptionRow({ option, onChoose }: OptionRowProps) {
	return (
		<li role="none">
			<button
				type="button"
				role="menuitem"
				tabIndex={-1}
				onClick={() => onChoose(option.key)}
				className="flex w-full items-center rounded-[6px] px-[10px] py-[8px] text-left text-[13px] text-[#334155] hover:bg-[#f1f5f9]"
			>
				{option.text}
			</button>
		</li>
	);
}
