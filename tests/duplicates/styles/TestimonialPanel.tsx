type TestimonialPanelProps = {
	text: string;
	name: string;
	position: string;
};

/** Route 3: the already-resolved CSS written straight into an inline style object. */
export function TestimonialPanel({ text, name, position }: TestimonialPanelProps) {
	return (
		<section
			style={{
				background: "#ffffff",
				padding: "24px",
				borderRadius: "12px",
				border: "1px solid #c7d2fe",
			}}
		>
			<blockquote className="m-[0px] text-[15px] italic leading-[24px] text-[#1e1b4b]">
				{text}
			</blockquote>
			<footer className="mt-[12px] text-[12px] font-medium text-[#4338ca]">
				{name} · <span className="font-normal text-[#6366f1]">{position}</span>
			</footer>
		</section>
	);
}
