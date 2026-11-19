import styled from "styled-components";

/**
 * The styled template wins over the tailwind utilities for background / padding /
 * border-radius; the tailwind `border` survives because styled never sets it.
 * Final surface: #ffffff, 24px padding, 12px radius, 1px solid #c7d2fe border.
 */
const Surface = styled.section`
	background: #ffffff;
	padding: 24px;
	border-radius: 12px;
`;

type QuoteCardProps = {
	quote: string;
	author: string;
	jobTitle: string;
};

export function QuoteCard({ quote, author, jobTitle }: QuoteCardProps) {
	return (
		<Surface className="rounded-[4px] border border-[#c7d2fe] bg-[#eef2ff] p-[8px]">
			<blockquote className="m-[0px] text-[15px] italic leading-[24px] text-[#1e1b4b]">
				{quote}
			</blockquote>
			<footer className="mt-[12px] text-[12px] font-medium text-[#4338ca]">
				{author} · <span className="font-normal text-[#6366f1]">{jobTitle}</span>
			</footer>
		</Surface>
	);
}
