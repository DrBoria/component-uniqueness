import { MediaFigure } from "./MediaFigure";
import { MediaFrame } from "./MediaFrame";
import { MediaCaption } from "./MediaCaption";
import { MediaHeading } from "./MediaHeading";
import { MediaNote } from "./MediaNote";

type MediaCardProps = {
	src: string;
	alt: string;
	title: string;
	credit: string;
};

/** Five wrapper levels around a plain figure/img/figcaption. */
export function MediaCard({ src, alt, title, credit }: MediaCardProps) {
	return (
		<MediaFigure>
			<MediaFrame src={src} alt={alt} />
			<MediaCaption>
				<MediaHeading>{title}</MediaHeading>
				<MediaNote>{credit}</MediaNote>
			</MediaCaption>
		</MediaFigure>
	);
}
