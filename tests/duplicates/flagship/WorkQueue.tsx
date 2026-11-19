import {
	RowList,
	Row,
	RowCheck,
	RowMain,
	RowTitle,
	RowMeta,
	OutlinePill,
	StatusPill,
} from "./primitives";

export type WorkItem = {
	id: string;
	title: string;
	owner: string;
	due: string;
	status: string;
	priority: string;
	done: boolean;
};

const WORK_ITEMS: readonly WorkItem[] = [
	{ id: "t1", title: "Ship onboarding checklist", owner: "Ada", due: "Due Fri", status: "In review", priority: "P1", done: false },
	{ id: "t2", title: "Fix invoice rounding", owner: "Grace", due: "Due Mon", status: "In progress", priority: "P0", done: false },
	{ id: "t3", title: "Audit color contrast", owner: "Linus", due: "Due Wed", status: "Blocked", priority: "P2", done: false },
	{ id: "t4", title: "Update API docs", owner: "Margaret", due: "Done", status: "Shipped", priority: "P3", done: true },
	{ id: "t5", title: "Migrate billing webhooks", owner: "Ada", due: "Due Tue", status: "In progress", priority: "P1", done: false },
	{ id: "t6", title: "Trim bundle size", owner: "Grace", due: "Due Thu", status: "In review", priority: "P2", done: false },
	{ id: "t7", title: "Add empty states", owner: "Linus", due: "Due Fri", status: "To do", priority: "P3", done: false },
	{ id: "t8", title: "Rotate signing keys", owner: "Margaret", due: "Done", status: "Shipped", priority: "P0", done: true },
];

/** Inline row markup — no per-row component, unlike the canon's TaskRow. */
export function WorkQueue({ onToggle }: { onToggle: (id: string) => void }) {
	return (
		<RowList>
			{WORK_ITEMS.map((item) => (
				<Row key={item.id}>
					<RowCheck
						type="checkbox"
						checked={item.done}
						onChange={() => onToggle(item.id)}
						aria-label={`Mark ${item.title} done`}
					/>
					<RowMain>
						<RowTitle>{item.title}</RowTitle>
						<RowMeta>
							{item.owner} · {item.due}
						</RowMeta>
					</RowMain>
					<OutlinePill>{item.priority}</OutlinePill>
					<StatusPill>{item.status}</StatusPill>
				</Row>
			))}
		</RowList>
	);
}
