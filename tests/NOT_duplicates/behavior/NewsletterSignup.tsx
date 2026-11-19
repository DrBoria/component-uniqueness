import { SignupField } from "./SignupField";
import { SubmitControl } from "./SubmitControl";

type NewsletterSignupProps = {
	value: string;
	onValueChange: (next: string) => void;
	onSubscribe: () => void;
	busy: boolean;
};

/**
 * Handler plumbing, canon flavour: the field takes `onEdit`, the button takes
 * `onPress`, and the form submit is an inline arrow that prevents default.
 */
export function NewsletterSignup({ value, onValueChange, onSubscribe, busy }: NewsletterSignupProps) {
	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				onSubscribe();
			}}
			className="flex w-[360px] flex-col gap-[8px] rounded-[10px] border border-[#e2e8f0] bg-[#ffffff] p-[16px]"
		>
			<SignupField id="newsletter-email" value={value} onEdit={onValueChange} />
			<SubmitControl busy={busy} onPress={onSubscribe} />
		</form>
	);
}
