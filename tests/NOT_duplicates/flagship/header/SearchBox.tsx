import { Search } from "lucide-react";

type SearchBoxProps = {
	query: string;
	onQueryChange: (next: string) => void;
	onSearch: () => void;
};

export function SearchBox({ query, onQueryChange, onSearch }: SearchBoxProps) {
	return (
		<form
			role="search"
			onSubmit={(event) => {
				event.preventDefault();
				onSearch();
			}}
			className="ml-auto flex items-center gap-[8px]"
		>
			<label htmlFor="overview-search" className="sr-only">
				Search projects
			</label>
			<input
				id="overview-search"
				type="search"
				value={query}
				placeholder="Search projects"
				onChange={(event) => onQueryChange(event.target.value)}
				className="h-[34px] w-[240px] rounded-[6px] border border-[#e2e8f0] px-[10px] text-[13px] text-[#0f172a]"
			/>
			<button
				type="submit"
				aria-label="Search"
				className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[6px] bg-[#4f46e5] text-[#ffffff] hover:bg-[#4338ca]"
			>
				<Search className="h-[16px] w-[16px]" aria-hidden="true" />
			</button>
		</form>
	);
}
