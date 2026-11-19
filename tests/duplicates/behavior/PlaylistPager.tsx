import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PlaylistPagerProps = {
	page: number;
	pageCount: number;
	pageSize: number;
	onPrev: () => void;
	onNext: () => void;
	onPageSize: (size: number) => void;
};

/**
 * NEGATIVE trap. Same visual bar, same lucide + onClick vocabulary as
 * TransportControls, but it is pagination: anchors instead of buttons, a page
 * counter instead of a play toggle, and a select instead of a range input.
 */
export function PlaylistPager({ page, pageCount, pageSize, onPrev, onNext, onPageSize }: PlaylistPagerProps) {
	return (
		<nav
			aria-label="Pagination"
			className="flex items-center gap-[12px] rounded-[10px] border border-[#e2e8f0] bg-[#ffffff] px-[16px] py-[12px]"
		>
			<Link
				href={`?page=${Math.max(1, page - 1)}`}
				aria-label="Previous page"
				onClick={onPrev}
				className="inline-flex h-[32px] w-[32px] items-center justify-center rounded-full text-[#475569] hover:bg-[#f1f5f9]"
			>
				<ChevronLeft className="h-[16px] w-[16px]" aria-hidden="true" />
			</Link>
			<span className="text-[13px] font-medium text-[#334155]">
				Page {page} of {pageCount}
			</span>
			<Link
				href={`?page=${Math.min(pageCount, page + 1)}`}
				aria-label="Next page"
				onClick={onNext}
				className="inline-flex h-[32px] w-[32px] items-center justify-center rounded-full text-[#475569] hover:bg-[#f1f5f9]"
			>
				<ChevronRight className="h-[16px] w-[16px]" aria-hidden="true" />
			</Link>
			<select
				aria-label="Rows per page"
				value={pageSize}
				onChange={(event) => onPageSize(Number(event.target.value))}
				className="h-[32px] rounded-[6px] border border-[#e2e8f0] px-[8px] text-[12px] text-[#334155]"
			>
				<option value={10}>10 rows</option>
				<option value={25}>25 rows</option>
				<option value={50}>50 rows</option>
			</select>
		</nav>
	);
}
