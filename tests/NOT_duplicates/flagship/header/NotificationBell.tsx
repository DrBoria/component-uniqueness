import { Bell } from "lucide-react";

export function NotificationBell({ onOpen }: { onOpen: () => void }) {
	return (
		<button
			type="button"
			aria-label="Notifications"
			onClick={onOpen}
			className="relative inline-flex h-[36px] w-[36px] items-center justify-center rounded-full text-[#475569] hover:bg-[#f1f5f9]"
		>
			<Bell className="h-[18px] w-[18px]" aria-hidden="true" />
			<span className="absolute right-[6px] top-[6px] h-[8px] w-[8px] rounded-full bg-[#ef4444]" />
		</button>
	);
}
