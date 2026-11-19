type BillingRegionProps = {
	total: string;
	dueOn: string;
};

/** Region named through aria-labelledby pointing at its own heading. */
export function BillingRegion({ total, dueOn }: BillingRegionProps) {
	return (
		<section
			aria-labelledby="billing-heading"
			className="rounded-[8px] border border-[#e2e8f0] bg-[#ffffff] p-[20px]"
		>
			<h2 id="billing-heading" className="text-[15px] font-semibold text-[#0f172a]">
				Billing
			</h2>
			<dl className="mt-[12px] space-y-[4px] text-[13px] text-[#475569]">
				<div className="flex justify-between">
					<dt>Amount due</dt>
					<dd className="font-medium text-[#0f172a]">{total}</dd>
				</div>
				<div className="flex justify-between">
					<dt>Due date</dt>
					<dd className="font-medium text-[#0f172a]">{dueOn}</dd>
				</div>
			</dl>
		</section>
	);
}
