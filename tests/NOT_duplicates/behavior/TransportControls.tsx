import { SkipBack, Play, SkipForward } from "lucide-react";

type TransportControlsProps = {
	playing: boolean;
	position: number;
	duration: number;
	onPlayPause: () => void;
	onPrev: () => void;
	onNext: () => void;
	onSeek: (value: number) => void;
};

/** Media transport: three buttons plus a seek slider inside a labelled group. */
export function TransportControls({
	playing,
	position,
	duration,
	onPlayPause,
	onPrev,
	onNext,
	onSeek,
}: TransportControlsProps) {
	return (
		<div
			role="group"
			aria-label="Playback"
			className="flex items-center gap-[12px] rounded-[10px] border border-[#e2e8f0] bg-[#ffffff] px-[16px] py-[12px]"
		>
			<button
				type="button"
				aria-label="Previous track"
				onClick={onPrev}
				className="inline-flex h-[32px] w-[32px] items-center justify-center rounded-full text-[#475569] hover:bg-[#f1f5f9]"
			>
				<SkipBack className="h-[16px] w-[16px]" aria-hidden="true" />
			</button>
			<button
				type="button"
				aria-label={playing ? "Pause" : "Play"}
				aria-pressed={playing}
				onClick={onPlayPause}
				className="inline-flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#4f46e5] text-[#ffffff] hover:bg-[#4338ca]"
			>
				<Play className="h-[18px] w-[18px]" aria-hidden="true" />
			</button>
			<button
				type="button"
				aria-label="Next track"
				onClick={onNext}
				className="inline-flex h-[32px] w-[32px] items-center justify-center rounded-full text-[#475569] hover:bg-[#f1f5f9]"
			>
				<SkipForward className="h-[16px] w-[16px]" aria-hidden="true" />
			</button>
			<input
				type="range"
				aria-label="Seek"
				min={0}
				max={duration}
				value={position}
				onChange={(event) => onSeek(Number(event.target.value))}
				className="h-[4px] flex-1 accent-[#4f46e5]"
			/>
		</div>
	);
}
