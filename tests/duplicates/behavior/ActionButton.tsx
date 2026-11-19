import { Loader2 } from "lucide-react";

type ActionButtonProps = {
	loading: boolean;
	disabled: boolean;
	onClick: () => void;
};

export function ActionButton({ loading, disabled, onClick }: ActionButtonProps) {
	return (
		<button
			type="submit"
			disabled={disabled}
			onClick={onClick}
			className="mt-[4px] inline-flex items-center justify-center gap-[6px] rounded-[6px] bg-[#4f46e5] px-[14px] py-[8px] text-[13px] font-semibold text-[#ffffff] hover:bg-[#4338ca] disabled:opacity-60"
		>
			{loading ? <Loader2 className="h-[14px] w-[14px] animate-spin" aria-hidden="true" /> : null}
			<span>Subscribe</span>
		</button>
	);
}
