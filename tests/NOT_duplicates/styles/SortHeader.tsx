import { ChevronDown } from "lucide-react";

type SortHeaderProps = {
	label: string;
	active: boolean;
	onSort: () => void;
};

/** Interactive indigo sort control. */
export function SortHeader({ label, active, onSort }: SortHeaderProps) {
	return (
		<button
			type="button"
			aria-pressed={active}
			onClick={onSort}
			className="inline-flex h-[32px] cursor-pointer items-center gap-[6px] rounded-[6px] px-[10px] text-[12px] font-semibold text-[#4f46e5] hover:bg-[#eef2ff]"
		>
			<span>{label}</span>
			<ChevronDown className="h-[14px] w-[14px]" aria-hidden="true" />
		</button>
	);
}
