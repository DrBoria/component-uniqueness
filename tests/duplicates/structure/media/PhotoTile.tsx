type PhotoTileProps = {
	imageUrl: string;
	imageAlt: string;
	caption: string;
	attribution: string;
};

/**
 * Zero wrappers: raw HTML elements producing exactly the tree MediaCard's
 * five-level chain expands into (next/image → img included).
 */
export function PhotoTile({ imageUrl, imageAlt, caption, attribution }: PhotoTileProps) {
	return (
		<figure className="m-[0px] w-[280px] overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-[#ffffff]">
			<div className="relative h-[160px] w-full">
				<img src={imageUrl} alt={imageAlt} width={280} height={160} className="object-cover" />
			</div>
			<figcaption className="flex flex-col gap-[4px] p-[12px]">
				<h3 className="m-[0px] text-[14px] font-semibold text-[#0f172a]">{caption}</h3>
				<p className="m-[0px] text-[12px] text-[#64748b]">{attribution}</p>
			</figcaption>
		</figure>
	);
}
