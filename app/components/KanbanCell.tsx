// /app/components/KanbanCell.tsx
"use client";

import { Task, TaskStatus } from "@/app/types";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

interface KanbanCellProps {
	activityId: string;
	statusId: TaskStatus;
	tasks: Task[];
}

export default function KanbanCell({ activityId, statusId, tasks }: KanbanCellProps) {
	// El ID debe ser único combinando Actividad + Estado
	const { setNodeRef, isOver } = useDroppable({
		id: `${activityId}::${statusId}`,
	});

	return (
		<div
			ref={setNodeRef}
			className={`w-[280px] shrink-0 min-h-[120px] rounded-xl border p-2 flex flex-col gap-2 transition-colors duration-200
        ${isOver ? 'border-solid border-[var(--color-muted)] bg-black/5 dark:bg-white/5' : 'border-dashed border-[var(--color-border)] bg-black/[0.01] dark:bg-white/[0.01]'}
      `}
		>
			{tasks.map((task) => (
				<TaskCard key={task.id} task={task} activityId={activityId} />
			))}
		</div>
	);
}