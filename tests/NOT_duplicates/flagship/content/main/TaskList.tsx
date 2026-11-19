import { TaskRow } from "./TaskRow";

export type OverviewTask = {
	id: string;
	title: string;
	owner: string;
	due: string;
	status: string;
	priority: string;
	done: boolean;
};

const TASKS: readonly OverviewTask[] = [
	{ id: "t1", title: "Ship onboarding checklist", owner: "Ada", due: "Due Fri", status: "In review", priority: "P1", done: false },
	{ id: "t2", title: "Fix invoice rounding", owner: "Grace", due: "Due Mon", status: "In progress", priority: "P0", done: false },
	{ id: "t3", title: "Audit color contrast", owner: "Linus", due: "Due Wed", status: "Blocked", priority: "P2", done: false },
	{ id: "t4", title: "Update API docs", owner: "Margaret", due: "Done", status: "Shipped", priority: "P3", done: true },
	{ id: "t5", title: "Migrate billing webhooks", owner: "Ada", due: "Due Tue", status: "In progress", priority: "P1", done: false },
	{ id: "t6", title: "Trim bundle size", owner: "Grace", due: "Due Thu", status: "In review", priority: "P2", done: false },
	{ id: "t7", title: "Add empty states", owner: "Linus", due: "Due Fri", status: "To do", priority: "P3", done: false },
	{ id: "t8", title: "Rotate signing keys", owner: "Margaret", due: "Done", status: "Shipped", priority: "P0", done: true },
];

export function TaskList({ onToggleTask }: { onToggleTask: (id: string) => void }) {
	return (
		<section className="rounded-[12px] border border-[#e2e8f0] bg-[#ffffff]">
			<header className="flex items-center justify-between border-b border-[#e2e8f0] px-[20px] py-[16px]">
				<h2 className="m-[0px] text-[15px] font-semibold text-[#0f172a]">Active tasks</h2>
				<span className="rounded-full bg-[#f1f5f9] px-[8px] py-[2px] text-[11px] font-medium text-[#475569]">
					8 tasks
				</span>
			</header>
			<ul className="m-[0px] flex list-none flex-col p-[0px]">
				{TASKS.map((task) => (
					<TaskRow key={task.id} task={task} onToggleTask={onToggleTask} />
				))}
			</ul>
		</section>
	);
}
