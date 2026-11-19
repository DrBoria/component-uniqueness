import { EmailInput } from "./EmailInput";
import { ActionButton } from "./ActionButton";

type SubscribePanelProps = {
	email: string;
	setEmail: (next: string) => void;
	subscribe: () => void;
	pending: boolean;
};

/**
 * Same form, different plumbing: props are assembled into a spread object in a
 * different order, the change handler is a named arrow, and the leaf components
 * use the conventional `onChange` / `onClick` names instead of `onEdit` / `onPress`.
 */
export function SubscribePanel({ email, setEmail, subscribe, pending }: SubscribePanelProps) {
	const handleChange = (next: string) => {
		setEmail(next);
	};

	const submit = (event: { preventDefault: () => void }) => {
		event.preventDefault();
		subscribe();
	};

	const fieldProps = {
		value: email,
		id: "newsletter-email",
		onChange: handleChange,
	};

	const buttonProps = {
		onClick: subscribe,
		disabled: pending,
		loading: pending,
	};

	return (
		<form
			onSubmit={submit}
			className="flex w-[360px] flex-col gap-[8px] rounded-[10px] border border-[#e2e8f0] bg-[#ffffff] p-[16px]"
		>
			<EmailInput {...fieldProps} />
			<ActionButton {...buttonProps} />
		</form>
	);
}
