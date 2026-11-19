import { X } from "lucide-react";

type DialogDismissProps = {
	onDismiss: () => void;
};

/** Accessible name supplied by aria-label; the glyph is hidden from AT. */
export function DialogDismiss({ onDismiss }: DialogDismissProps) {
	return (
		<button
			type="button"
			aria-label="Close dialog"
			onClick={onDismiss}
			className="absolute right-[12px] top-[12px] rounded-full p-[6px] text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#334155]"
		>
			<X className="h-[16px] w-[16px]" aria-hidden="true" />
		</button>
	);
}
