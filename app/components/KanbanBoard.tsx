// /app/components/KanbanBoard.tsx
"use client";

import { useState } from "react";
import { Sprint, TaskStatus, Task } from "@/app/types";
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, closestCorners } from "@dnd-kit/core";
import { useProjectsManager, getActivityMetrics } from "@/app/context/ProjectContext";
import KanbanCell from "./KanbanCell";
import TaskCard from "./TaskCard";

const COLUMNS: { id: TaskStatus; title: string }[] = [
	{ id: "todo", title: "To Do" },
	{ id: "working", title: "Working" },
	{ id: "review", title: "Review" },
	{ id: "dropped", title: "Dropped" },
	{ id: "done", title: "Done" },
];

export default function KanbanBoard({ sprint }: { sprint: Sprint }) {
	const { selectedProjectId, moveTask, addActivity } = useProjectsManager();
	const [activeTask, setActiveTask] = useState<{ task: Task; activityId: string } | null>(null);

	const [isAdding, setIsAdding] = useState(false);
	const [newActivityName, setNewActivityName] = useState("");

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		const task = active.data.current?.task as Task;
		const activityId = active.data.current?.activityId as string;
		if (task && activityId) setActiveTask({ task, activityId });
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveTask(null);

		if (!over || !selectedProjectId) return;

		const taskId = active.id as string;
		const dropZoneId = over.id as string; // Ej: "act-123::working"

		// Decodificamos el ID de la zona de soltado
		const [targetActivityId, targetStatus] = dropZoneId.split("::") as [string, TaskStatus];
		const sourceActivityId = active.data.current?.activityId;

		if (!sourceActivityId || !targetActivityId || !targetStatus) return;

		moveTask(selectedProjectId, sprint.id, sourceActivityId, targetActivityId, taskId, targetStatus);
	};

	const handleAddActivity = (e: React.FormEvent) => {
		e.preventDefault();
		if (newActivityName.trim() && selectedProjectId) {
			addActivity(selectedProjectId, sprint.id, newActivityName.trim());
			setNewActivityName("");
			setIsAdding(false);
		}
	};

	return (
		<DndContext collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
			<div className="h-full overflow-auto scrollbar-hide pb-12">
				<div className="flex flex-col min-w-max">

					{/* Fila de Cabeceras Globales */}
					<div className="flex gap-4 mb-4 sticky top-0 bg-[var(--background)] z-10 py-2 border-b border-[var(--color-border)]">
						<div className="w-64 shrink-0 px-2 flex items-end pb-1">
							<h3 className="font-editorial text-[var(--color-muted)] text-sm uppercase tracking-widest">Actividades</h3>
						</div>
						{COLUMNS.map((col) => (
							<div key={col.id} className="w-[280px] shrink-0 px-1">
								<h3 className="font-editorial text-xl tracking-tight text-[var(--foreground)]">{col.title}</h3>
							</div>
						))}
					</div>

					{/* Carriles (Swimlanes) por Actividad */}
					<div className="flex flex-col gap-6">
						{sprint.activities.map((act) => {
							const { total, done } = getActivityMetrics(act);

							return (
								<div key={act.id} className="flex gap-4 group">
									{/* Nombre de la Actividad (Columna Izquierda fija) */}
									<div className="w-64 shrink-0 py-2 px-2 flex flex-col gap-1 border-r border-[var(--color-border)]">
										<h4 className="font-bold text-[var(--foreground)] text-sm leading-snug">{act.name}</h4>

										{/* Contador tipográfico de tareas */}
										<div className="flex items-center gap-1.5 mt-1">
											<span className="text-[10px] font-mono font-medium text-[var(--color-muted)] bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded border border-[var(--color-border)]">
												{done}/{total}
											</span>
											<span className="text-xs text-[var(--color-muted)]">tareas</span>
										</div>
									</div>

									{/* Celdas de estados */}
									{COLUMNS.map((col) => {
										const tasks = act.tasks.filter((t) => t.status === col.id);
										return <KanbanCell key={col.id} activityId={act.id} statusId={col.id} tasks={tasks} />;
									})}
								</div>
							);
						})}
					</div>

					{/* Fila inferior para añadir nueva Actividad */}
					<div className="mt-8 px-2">
						{isAdding ? (
							<form onSubmit={handleAddActivity} className="flex items-center gap-2">
								<input
									type="text"
									autoFocus
									placeholder="Nombre de la nueva actividad..."
									value={newActivityName}
									onChange={(e) => setNewActivityName(e.target.value)}
									className="w-64 px-3 py-2 bg-transparent border border-[var(--color-border)] rounded-md text-sm outline-none transition-colors focus:border-[var(--color-muted)] text-[var(--foreground)]"
									onBlur={() => setIsAdding(false)}
								/>
							</form>
						) : (
							<button
								onClick={() => setIsAdding(true)}
								className="w-64 px-4 py-3 rounded-xl border border-dashed border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--foreground)] hover:border-[var(--color-muted)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm font-medium flex items-center justify-center gap-2"
							>
								<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
								</svg>
								Añadir Actividad
							</button>
						)}
					</div>

				</div>
			</div>

			<DragOverlay>
				{activeTask ? (
					<div className="rotate-2 scale-105 shadow-[0_8px_30px_rgb(0,0,0,0.15)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.05)] cursor-grabbing w-[280px]">
						<TaskCard task={activeTask.task} activityId={activeTask.activityId} />
					</div>
				) : null}
			</DragOverlay>
		</DndContext>
	);
}