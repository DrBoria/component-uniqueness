import { Inbox } from "lucide-react";

type ZeroStateProps = {
	count: number;
	onStart: () => void;
};

/**
 * Single return, ternary with an `undefined` branch and a nested ternary inside.
 * For every input the rendered tree equals EmptyInbox's (empty state or nothing).
 */
export function ZeroState({ count, onStart }: ZeroStateProps) {
	return count > 0 ? undefined : (
		<div className="flex flex-col items-center gap-[12px] rounded-[12px] border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-[32px] py-[40px] text-center">
			<Inbox className="h-[32px] w-[32px] text-[#94a3b8]" aria-hidden="true" />
			<h3 className="m-[0px] text-[15px] font-semibold text-[#0f172a]">No messages yet</h3>
			<p className="m-[0px] max-w-[320px] text-[13px] leading-[20px] text-[#64748b]">
				{count === 0
					? "When your team starts a conversation it will show up here."
					: "When your team starts a conversation it will show up here."}
			</p>
			<button
				type="button"
				onClick={onStart}
				className="rounded-[6px] bg-[#4f46e5] px-[14px] py-[8px] text-[13px] font-semibold text-[#ffffff] hover:bg-[#4338ca]"
			>
				Start a conversation
			</button>
		</div>
	);
}
