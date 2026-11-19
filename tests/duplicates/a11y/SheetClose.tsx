import { X } from "lucide-react";

type SheetCloseProps = {
	onClose: () => void;
};

/** Same accessible name, but delivered by visually-hidden text instead of aria-label. */
export function SheetClose({ onClose }: SheetCloseProps) {
	return (
		<button
			type="button"
			onClick={onClose}
			className="absolute right-[12px] top-[12px] rounded-full p-[6px] text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#334155]"
		>
			<X className="h-[16px] w-[16px]" aria-hidden="true" />
			<span className="sr-only">Close dialog</span>
		</button>
	);
}
