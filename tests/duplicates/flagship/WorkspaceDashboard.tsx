import { DashboardMasthead } from "./DashboardMasthead";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardColophon } from "./DashboardColophon";
import { MetricTiles } from "./MetricTiles";
import { WorkQueue } from "./WorkQueue";
import { DeliveryTracks } from "./DeliveryTracks";
import {
	Shell,
	Body,
	Primary,
	Secondary,
	Panel,
	PanelHead,
	PanelTitle,
	PrimaryAction,
	CountPill,
	MutedNote,
} from "./primitives";

type WorkspaceDashboardProps = {
	term: string;
	onTermChange: (next: string) => void;
	onRunSearch: () => void;
	onCreateTask: () => void;
	onToggleWorkItem: (id: string) => void;
	inviteAddress: string;
	onInviteAddressChange: (next: string) => void;
	onSendInvite: () => void;
};

/**
 * FLAGSHIP app twin. Same page as ProjectOverview, but decomposed by element kind
 * (styled primitives) with flat, data-driven sections instead of a 6-level
 * feature tree. ~9 files vs the canon's 34, no shared component names.
 */
export function WorkspaceDashboard({
	term,
	onTermChange,
	onRunSearch,
	onCreateTask,
	onToggleWorkItem,
	inviteAddress,
	onInviteAddressChange,
	onSendInvite,
}: WorkspaceDashboardProps) {
	return (
		<Shell>
			<DashboardMasthead term={term} onTerm={onTermChange} onRunSearch={onRunSearch} />
			<Body>
				<Primary>
					<Panel>
						<PanelHead>
							<PanelTitle>This sprint</PanelTitle>
							<PrimaryAction type="button" onClick={onCreateTask}>
								New task
							</PrimaryAction>
						</PanelHead>
						<MetricTiles />
					</Panel>

					<Panel>
						<PanelHead>
							<PanelTitle>Active tasks</PanelTitle>
							<CountPill>8 tasks</CountPill>
						</PanelHead>
						<WorkQueue onToggle={onToggleWorkItem} />
					</Panel>

					<Panel>
						<PanelHead>
							<PanelTitle>Milestones</PanelTitle>
							<MutedNote>3 in flight</MutedNote>
						</PanelHead>
						<DeliveryTracks />
					</Panel>
				</Primary>
				<Secondary>
					<DashboardSidebar
						email={inviteAddress}
						onEmail={onInviteAddressChange}
						onSendInvite={onSendInvite}
					/>
				</Secondary>
			</Body>
			<DashboardColophon />
		</Shell>
	);
}
