// /app/components/KanbanCell.tsx
"use client";

import { Activity, TaskStatus } from "@/app/types";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
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
        ${isOver ? 'border-solid border-(--color-muted) bg-black/5 dark:bg-white/5' : 'border-dashed border-(--color-border) bg-black/1 dark:bg-white/1'}
      `}
		>
			<SortableContext items={activities.map(a => a.id)} strategy={verticalListSortingStrategy}>
				{activities.map((act) => (
					<ActivityCard key={act.id} activity={act} sprintId={sprintId} />
				))}
			</SortableContext>
		</div>
	);
}