import type { ReactNode } from "react";

type InvoiceSectionProps = {
	amount: string;
	payBy: string;
};

function SummaryRow({ term, children }: { term: string; children: ReactNode }) {
	return (
		<div className="flex justify-between">
			<dt>{term}</dt>
			<dd className="font-medium text-[#0f172a]">{children}</dd>
		</div>
	);
}

/**
 * Same landmark + same accessible name ("Billing"), reached with aria-label/title
 * instead of aria-labelledby, and with the rows factored into a local wrapper.
 */
export function InvoiceSection({ amount, payBy }: InvoiceSectionProps) {
	return (
		<section
			aria-label="Billing"
			title="Billing"
			className="rounded-[8px] border border-[#e2e8f0] bg-[#ffffff] p-[20px]"
		>
			<h2 className="text-[15px] font-semibold text-[#0f172a]">Billing</h2>
			<dl className="mt-[12px] space-y-[4px] text-[13px] text-[#475569]">
				<SummaryRow term="Amount due">{amount}</SummaryRow>
				<SummaryRow term="Due date">{payBy}</SummaryRow>
			</dl>
		</section>
	);
}
