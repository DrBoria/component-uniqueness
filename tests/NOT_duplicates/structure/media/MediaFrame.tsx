import Image from "next/image";

type MediaFrameProps = { src: string; alt: string };

export function MediaFrame({ src, alt }: MediaFrameProps) {
	return (
		<div className="relative h-[160px] w-full">
			<Image src={src} alt={alt} width={280} height={160} className="object-cover" />
		</div>
	);
}
