import { BannerShell } from "./BannerShell";
import { BannerLead } from "./BannerLead";
import { BannerCopy } from "./BannerCopy";
import { BannerHeadline } from "./BannerHeadline";
import { BannerParagraph } from "./BannerParagraph";
import { BannerInner } from "./BannerInner";

type AlertBannerProps = {
	heading: string;
	detail: string;
	severity?: "info" | "warning";
};

/**
 * Seven differently-named wrappers, different grouping (icon+content split at
 * BannerLead instead of CalloutRow), same expanded HTML as NoticeCallout.
 */
export function AlertBanner({ heading, detail, severity = "info" }: AlertBannerProps) {
	return (
		<BannerShell severity={severity}>
			<BannerLead severity={severity}>
				<BannerInner>
					<BannerCopy>
						<BannerHeadline>{heading}</BannerHeadline>
						<BannerParagraph>{detail}</BannerParagraph>
					</BannerCopy>
				</BannerInner>
			</BannerLead>
		</BannerShell>
	);
}
