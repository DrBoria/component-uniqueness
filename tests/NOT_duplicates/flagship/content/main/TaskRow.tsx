import type { OverviewTask } from "./TaskList";

type TaskRowProps = {
	task: OverviewTask;
	onToggleTask: (id: string) => void;
};

export function TaskRow({ task, onToggleTask }: TaskRowProps) {
	return (
		<li className="flex items-center gap-[12px] border-b border-[#f1f5f9] px-[20px] py-[12px] last:border-b-[0px]">
			<input
				type="checkbox"
				checked={task.done}
				onChange={() => onToggleTask(task.id)}
				aria-label={`Mark ${task.title} done`}
				className="h-[16px] w-[16px] accent-[#4f46e5]"
			/>
			<div className="flex flex-1 flex-col">
				<span className="text-[13px] font-medium text-[#0f172a]">{task.title}</span>
				<span className="text-[11px] text-[#64748b]">
					{task.owner} · {task.due}
				</span>
			</div>
			<span className="rounded-[4px] border border-[#e2e8f0] px-[6px] py-[2px] text-[11px] font-medium text-[#475569]">
				{task.priority}
			</span>
			<span className="rounded-[4px] bg-[#eef2ff] px-[6px] py-[2px] text-[11px] font-medium text-[#4338ca]">
				{task.status}
			</span>
		</li>
	);
}
