type StateTagProps = {
	text: string;
	onPick: () => void;
};

/** Same resolved CSS as StatusChip, reached in one step with tailwind utilities. */
export function StateTag({ text, onPick }: StateTagProps) {
	return (
		<span
			onClick={onPick}
			className="inline-flex cursor-pointer items-center gap-[6px] rounded-[999px] bg-[#dcfce7] px-[10px] py-[4px] text-[12px] font-semibold text-[#166534]"
		>
			<span className="h-[6px] w-[6px] rounded-full bg-current" />
			{text}
		</span>
	);
}
