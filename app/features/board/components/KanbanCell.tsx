// /app/components/KanbanCell.tsx
"use client";

import { Activity, TaskStatus } from "@/app/common/types";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, rectSortingStrategy } from "@dnd-kit/sortable";
import ActivityCard from "@/app/features/activity/ActivityCard";

interface KanbanCellProps {
	sprintId: string;
	statusId: TaskStatus;
	activities: Activity[];
	gridMode?: number;
}

export default function KanbanCell({ sprintId, statusId, activities, gridMode = 1 }: KanbanCellProps) {
	const { setNodeRef, isOver } = useDroppable({
		id: statusId,
	});

	const widthClass = gridMode === 1 ? "w-[280px]" : "w-[560px]";
	const layoutClass = gridMode === 1 ? "flex flex-col" : "columns-2 gap-4 block";

	return (
		<div
			ref={setNodeRef}
			className={`${widthClass} shrink-0 h-full min-h-0 rounded-xl border p-2 transition-all duration-300 overflow-y-auto ${layoutClass}
        ${isOver ? 'border-solid border-(--color-muted) bg-black/4 dark:bg-white/5 shadow-inner' : 'border-dashed border-(--color-border) bg-black/2 dark:bg-white/2'}
      `}
		>
			<SortableContext items={activities.map(a => a.id)} strategy={gridMode > 1 ? rectSortingStrategy : verticalListSortingStrategy}>
				{activities.map((act) => (
					<ActivityCard key={act.id} activity={act} sprintId={sprintId} />
				))}
			</SortableContext>
		</div>
	);
}