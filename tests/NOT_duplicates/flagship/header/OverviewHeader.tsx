import { BrandMark } from "./BrandMark";
import { PrimaryNav } from "./PrimaryNav";
import { SearchBox } from "./SearchBox";
import { NotificationBell } from "./NotificationBell";
import { HeaderAvatar } from "./HeaderAvatar";

type OverviewHeaderProps = {
	query: string;
	onQueryChange: (next: string) => void;
	onSearch: () => void;
};

export function OverviewHeader({ query, onQueryChange, onSearch }: OverviewHeaderProps) {
	return (
		<header className="sticky top-[0px] z-10 flex h-[64px] items-center gap-[24px] border-b border-[#e2e8f0] bg-[#ffffff] px-[24px]">
			<BrandMark />
			<PrimaryNav />
			<SearchBox query={query} onQueryChange={onQueryChange} onSearch={onSearch} />
			<NotificationBell onOpen={onSearch} />
			<HeaderAvatar src="/avatars/ada.png" />
		</header>
	);
}
