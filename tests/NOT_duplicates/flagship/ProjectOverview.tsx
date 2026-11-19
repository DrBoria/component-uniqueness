import { OverviewHeader } from "./header/OverviewHeader";
import { OverviewContent } from "./content/OverviewContent";
import { OverviewFooter } from "./content/OverviewFooter";

type ProjectOverviewProps = {
	query: string;
	onQueryChange: (next: string) => void;
	onSearch: () => void;
	onNewTask: () => void;
	onToggleTask: (id: string) => void;
	inviteEmail: string;
	onInviteEmailChange: (next: string) => void;
	onInvite: () => void;
};

/**
 * FLAGSHIP canon. A realistic project-overview page assembled from a deep,
 * fine-grained decomposition: page → header/content/footer → main/aside →
 * panels → rows → glyph/label/value leaves (33 local component files).
 */
export function ProjectOverview({
	query,
	onQueryChange,
	onSearch,
	onNewTask,
	onToggleTask,
	inviteEmail,
	onInviteEmailChange,
	onInvite,
}: ProjectOverviewProps) {
	return (
		<div className="flex min-h-screen flex-col bg-[#f8fafc]">
			<OverviewHeader query={query} onQueryChange={onQueryChange} onSearch={onSearch} />
			<OverviewContent
				onNewTask={onNewTask}
				onToggleTask={onToggleTask}
				inviteEmail={inviteEmail}
				onInviteEmailChange={onInviteEmailChange}
				onInvite={onInvite}
			/>
			<OverviewFooter />
		</div>
	);
}
