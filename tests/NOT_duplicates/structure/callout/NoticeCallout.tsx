import { CalloutFrame } from "./CalloutFrame";
import { CalloutRow } from "./CalloutRow";
import { CalloutBody } from "./CalloutBody";
import { CalloutTitle } from "./CalloutTitle";
import { CalloutText } from "./CalloutText";

type NoticeCalloutProps = {
	title: string;
	message: string;
	tone?: "info" | "warning";
};

/**
 * Six-level local wrapper chain. The expanded tree is:
 * div[role=alert] > div > svg + div > strong + p
 */
export function NoticeCallout({ title, message, tone = "info" }: NoticeCalloutProps) {
	return (
		<CalloutFrame tone={tone}>
			<CalloutRow tone={tone}>
				<CalloutBody>
					<CalloutTitle>{title}</CalloutTitle>
					<CalloutText>{message}</CalloutText>
				</CalloutBody>
			</CalloutRow>
		</CalloutFrame>
	);
}
