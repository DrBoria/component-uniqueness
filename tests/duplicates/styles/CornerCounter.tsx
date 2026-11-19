type CornerCounterProps = {
	value: number;
};

/** Same offsets expressed as the inset shorthand (top right bottom left). */
export function CornerCounter({ value }: CornerCounterProps) {
	return (
		<div className="relative h-[64px] w-[64px] rounded-[12px] bg-[#f1f5f9]">
			<span className="absolute inset-[12px_auto_auto_16px] inline-flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-[#ef4444] px-[6px] text-[11px] font-semibold text-[#ffffff]">
				{value}
			</span>
		</div>
	);
}
