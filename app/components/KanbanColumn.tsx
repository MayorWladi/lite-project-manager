// /app/components/KanbanColumn.tsx
"use client";

import { Task, TaskStatus } from "@/app/types";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

interface KanbanColumnProps {
	id: TaskStatus;
	title: string;
	tasks: Task[];
}

export default function KanbanColumn({ id, title, tasks }: KanbanColumnProps) {
	const { setNodeRef, isOver } = useDroppable({
		id: id,
	});

	return (
		<div className="w-[280px] shrink-0 flex flex-col h-full">
			<div className="flex items-center justify-between mb-3 px-1">
				<h3 className="font-editorial text-xl tracking-tight text-[var(--foreground)]">
					{title}
				</h3>
				<span className="text-xs font-bold bg-black/5 dark:bg-white/10 text-[var(--color-muted)] px-2 py-0.5 rounded-full">
					{tasks.length}
				</span>
			</div>

			<div
				ref={setNodeRef}
				className={`flex-1 rounded-xl border p-2 flex flex-col gap-2 overflow-y-auto transition-colors duration-200
          ${isOver ? 'border-solid border-[var(--color-muted)] bg-black/5 dark:bg-white/5' : 'border-dashed border-[var(--color-border)] bg-black/[0.01] dark:bg-white/[0.01]'}
        `}
			>
				{tasks.map((task) => (
					<TaskCard key={task.id} task={task} />
				))}
			</div>
		</div>
	);
}