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
			className={`w-[280px] shrink-0 h-full min-h-0 rounded-xl border p-2 flex flex-col gap-3 transition-all duration-300 overflow-y-auto
        ${isOver ? 'border-solid border-(--color-muted) bg-black/4 dark:bg-white/5 shadow-inner' : 'border-dashed border-(--color-border) bg-black/2 dark:bg-white/2'}
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