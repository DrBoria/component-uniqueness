type FloatingBadgeProps = {
	count: number;
};

/** Offsets expressed as top + left. */
export function FloatingBadge({ count }: FloatingBadgeProps) {
	return (
		<div className="relative h-[64px] w-[64px] rounded-[12px] bg-[#f1f5f9]">
			<span className="absolute left-[16px] top-[12px] inline-flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-[#ef4444] px-[6px] text-[11px] font-semibold text-[#ffffff]">
				{count}
			</span>
		</div>
	);
}
