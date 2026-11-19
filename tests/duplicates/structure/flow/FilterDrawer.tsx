type FilterDrawerProps = {
	expanded: boolean;
	activeCount: number;
	onExpand: () => void;
	onSubmit: () => void;
	onReset: () => void;
};

/**
 * NEGATIVE trap. Same domain and shared chrome, but the branches genuinely change
 * the tree: a div[role=region] with an h3 instead of fieldset/legend, three filter
 * rows instead of two, and an extra Reset action in the expanded branch.
 */
export function FilterDrawer({ expanded, activeCount, onExpand, onSubmit, onReset }: FilterDrawerProps) {
	return (
		<div
			role="region"
			aria-label="Product filters"
			className="rounded-[8px] border border-[#e2e8f0] bg-[#ffffff] p-[16px]"
		>
			<h3 className="m-[0px] text-[12px] font-semibold uppercase text-[#64748b]">Filters</h3>
			{expanded ? (
				<div className="mt-[12px] flex flex-col gap-[8px]">
					<label className="flex items-center gap-[8px] text-[13px] text-[#334155]">
						<input type="checkbox" className="h-[14px] w-[14px] accent-[#4f46e5]" />
						In stock only
					</label>
					<label className="flex items-center gap-[8px] text-[13px] text-[#334155]">
						<input type="checkbox" className="h-[14px] w-[14px] accent-[#4f46e5]" />
						On sale
					</label>
					<label className="flex items-center gap-[8px] text-[13px] text-[#334155]">
						<input type="checkbox" className="h-[14px] w-[14px] accent-[#4f46e5]" />
						Free shipping
					</label>
					<div className="mt-[4px] flex gap-[8px]">
						<button
							type="button"
							onClick={onReset}
							className="rounded-[6px] border border-[#e2e8f0] px-[12px] py-[6px] text-[12px] font-medium text-[#475569] hover:bg-[#f8fafc]"
						>
							Reset
						</button>
						<button
							type="button"
							onClick={onSubmit}
							className="rounded-[6px] bg-[#0f172a] px-[12px] py-[6px] text-[12px] font-semibold text-[#ffffff] hover:bg-[#1e293b]"
						>
							Apply filters
						</button>
					</div>
				</div>
			) : (
				<p className="mt-[8px] text-[12px] text-[#64748b]">
					{activeCount} filters active ·{" "}
					<button
						type="button"
						aria-expanded={false}
						onClick={onExpand}
						className="font-medium text-[#4f46e5] hover:underline"
					>
						Edit
					</button>
				</p>
			)}
		</div>
	);
}
