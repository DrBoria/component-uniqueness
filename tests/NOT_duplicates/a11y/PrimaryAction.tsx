type PrimaryActionProps = {
	label: string;
	onActivate: () => void;
	disabled?: boolean;
};

/** Canonical primary action: a real <button>, name comes from its inner text. */
export function PrimaryAction({ label, onActivate, disabled = false }: PrimaryActionProps) {
	return (
		<button
			type="button"
			disabled={disabled}
			onClick={onActivate}
			className="inline-flex items-center gap-[8px] rounded-[6px] bg-[#4f46e5] px-[16px] py-[8px] text-[13px] font-semibold text-[#ffffff] hover:bg-[#4338ca] disabled:opacity-50"
		>
			<svg viewBox="0 0 20 20" aria-hidden="true" className="h-[16px] w-[16px] fill-current" />
			<span>{label}</span>
		</button>
	);
}
