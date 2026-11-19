import { SprintMetrics } from "./SprintMetrics";
import { TaskList } from "./TaskList";
import { MilestoneBoard } from "./MilestoneBoard";

type OverviewMainProps = {
	onNewTask: () => void;
	onToggleTask: (id: string) => void;
};

export function OverviewMain({ onNewTask, onToggleTask }: OverviewMainProps) {
	return (
		<main className="flex flex-1 flex-col gap-[24px]">
			<SprintMetrics onNewTask={onNewTask} />
			<TaskList onToggleTask={onToggleTask} />
			<MilestoneBoard />
		</main>
	);
}
