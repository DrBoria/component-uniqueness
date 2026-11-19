type CollapsibleFiltersProps = {
	open: boolean;
	selected: number;
	onToggle: () => void;
	onApply: () => void;
};

/** Two returns: collapsed summary vs. the full filter form. */
export function CollapsibleFilters({ open, selected, onToggle, onApply }: CollapsibleFiltersProps) {
	if (!open) {
		return (
			<fieldset className="rounded-[8px] border border-[#e2e8f0] bg-[#ffffff] p-[16px]">
				<legend className="px-[4px] text-[12px] font-semibold uppercase text-[#64748b]">
					Filters
				</legend>
				<button
					type="button"
					aria-expanded={false}
					onClick={onToggle}
					className="text-[13px] font-medium text-[#4f46e5] hover:underline"
				>
					Show filters
				</button>
				<p className="mt-[8px] text-[12px] text-[#64748b]">{selected} active</p>
			</fieldset>
		);
	}

	return (
		<fieldset className="rounded-[8px] border border-[#e2e8f0] bg-[#ffffff] p-[16px]">
			<legend className="px-[4px] text-[12px] font-semibold uppercase text-[#64748b]">
				Filters
			</legend>
			<button
				type="button"
				aria-expanded={true}
				onClick={onToggle}
				className="text-[13px] font-medium text-[#4f46e5] hover:underline"
			>
				Hide filters
			</button>
			<div className="mt-[12px] flex flex-col gap-[8px]">
				<label className="flex items-center gap-[8px] text-[13px] text-[#334155]">
					<input type="checkbox" className="h-[14px] w-[14px] accent-[#4f46e5]" />
					In stock only
				</label>
				<label className="flex items-center gap-[8px] text-[13px] text-[#334155]">
					<input type="checkbox" className="h-[14px] w-[14px] accent-[#4f46e5]" />
					On sale
				</label>
			</div>
			<button
				type="button"
				onClick={onApply}
				className="mt-[12px] rounded-[6px] bg-[#0f172a] px-[12px] py-[6px] text-[12px] font-semibold text-[#ffffff] hover:bg-[#1e293b]"
			>
				Apply filters
			</button>
		</fieldset>
	);
}
