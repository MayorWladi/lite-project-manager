// /app/components/KanbanCell.tsx
"use client";

import { Activity, TaskStatus } from "@/app/types";
import { useDroppable } from "@dnd-kit/core";
import ActivityCard from "./ActivityCard";

interface KanbanCellProps {
	sprintId: string;
	statusId: TaskStatus;
	activities: Activity[];
}

export default function KanbanCell({ sprintId, statusId, activities }: KanbanCellProps) {
	const { setNodeRef, isOver } = useDroppable({
		id: statusId,
	});

	return (
		<div
			ref={setNodeRef}
			className={`w-[280px] shrink-0 min-h-[500px] h-full rounded-xl border p-2 flex flex-col gap-4 transition-colors duration-200
        ${isOver ? 'border-solid border-[var(--color-muted)] bg-black/5 dark:bg-white/5' : 'border-dashed border-[var(--color-border)] bg-black/[0.01] dark:bg-white/[0.01]'}
      `}
		>
			{activities.map((act) => (
				<ActivityCard key={act.id} activity={act} sprintId={sprintId} />
			))}
		</div>
	);
}