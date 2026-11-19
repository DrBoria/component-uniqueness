type PriceTagProps = {
	amount: string;
	currency: string;
};

/** Route 1: pure tailwind utilities. */
export function PriceTag({ amount, currency }: PriceTagProps) {
	return (
		<span className="inline-flex items-baseline gap-[4px] rounded-[10px] bg-[#0f172a] px-[14px] py-[6px] text-[18px] font-bold text-[#f8fafc]">
			<span>{amount}</span>
			<span className="text-[11px] font-medium text-[#94a3b8]">{currency}</span>
		</span>
	);
}
