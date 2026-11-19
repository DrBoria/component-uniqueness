type ColumnCaptionProps = {
	label: string;
	muted?: boolean;
};

/**
 * NEGATIVE trap. Identical box model, font size and weight as SortHeader, but this is
 * a static caption: slate text, cursor-default, no handler, no sort affordance.
 * Same layout ≠ same component.
 */
export function ColumnCaption({ label, muted = false }: ColumnCaptionProps) {
	return (
		<span
			aria-disabled={muted}
			className="inline-flex h-[32px] cursor-default items-center gap-[6px] rounded-[6px] px-[10px] text-[12px] font-semibold text-[#94a3b8]"
		>
			<span>{label}</span>
		</span>
	);
}
