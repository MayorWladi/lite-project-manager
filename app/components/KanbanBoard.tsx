// /app/components/KanbanBoard.tsx
"use client";

import { useState } from "react";
import { Sprint, TaskStatus, Task } from "@/app/types";
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, closestCorners } from "@dnd-kit/core";
import { useProjectsManager } from "@/app/context/ProjectContext";
import KanbanColumn from "./KanbanColumn";
import TaskCard from "./TaskCard";

const COLUMNS: { id: TaskStatus; title: string }[] = [
	{ id: "todo", title: "To Do" },
	{ id: "working", title: "Working" },
	{ id: "review", title: "Review" },
	{ id: "dropped", title: "Dropped" },
	{ id: "done", title: "Done" },
];

export default function KanbanBoard({ sprint }: { sprint: Sprint }) {
	const { selectedProjectId, moveTask } = useProjectsManager();
	const [activeTask, setActiveTask] = useState<Task | null>(null);

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		const task = active.data.current?.task as Task;
		if (task) setActiveTask(task);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveTask(null);

		if (!over || !selectedProjectId) return;

		const taskId = active.id as string;
		const newStatus = over.id as TaskStatus;

		// Si no cambió de columna, no hacemos nada
		if (activeTask?.status === newStatus) return;

		moveTask(selectedProjectId, sprint.id, taskId, newStatus);
	};

	return (
		<DndContext
			collisionDetection={closestCorners}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<div className="flex gap-4 overflow-x-auto h-full pb-4 items-start scrollbar-hide">
				{COLUMNS.map((col) => {
					const columnTasks = sprint.tasks.filter((task) => task.status === col.id);
					return <KanbanColumn key={col.id} id={col.id} title={col.title} tasks={columnTasks} />;
				})}
			</div>

			<DragOverlay>
				{activeTask ? (
					<div className="rotate-2 scale-105 shadow-[0_8px_30px_rgb(0,0,0,0.15)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.05)] cursor-grabbing">
						<TaskCard task={activeTask} />
					</div>
				) : null}
			</DragOverlay>
		</DndContext>
	);
}