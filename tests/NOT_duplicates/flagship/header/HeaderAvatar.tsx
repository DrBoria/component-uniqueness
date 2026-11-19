import Image from "next/image";

export function HeaderAvatar({ src }: { src: string }) {
	return (
		<Image
			src={src}
			alt=""
			width={32}
			height={32}
			className="h-[32px] w-[32px] rounded-full object-cover"
		/>
	);
}
