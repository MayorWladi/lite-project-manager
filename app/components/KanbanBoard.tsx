// /app/components/KanbanBoard.tsx
"use client";

import { Sprint, TaskStatus } from "@/app/types";
import TaskCard from "./TaskCard";

// Definición estática de las columnas
const COLUMNS: { id: TaskStatus; title: string }[] = [
	{ id: "todo", title: "To Do" },
	{ id: "working", title: "Working" },
	{ id: "review", title: "Review" },
	{ id: "dropped", title: "Dropped" },
	{ id: "done", title: "Done" },
];

export default function KanbanBoard({ sprint }: { sprint: Sprint }) {
	return (
		<div className="flex gap-4 overflow-x-auto h-full pb-4 items-start scrollbar-hide">
			{COLUMNS.map((col) => {
				// Filtramos estáticamente las tareas correspondientes a esta columna
				const columnTasks = sprint.tasks.filter((task) => task.status === col.id);

				return (
					<div key={col.id} className="w-[280px] shrink-0 flex flex-col h-full">
						{/* Cabecera de la columna */}
						<div className="flex items-center justify-between mb-3 px-1">
							<h3 className="font-editorial text-xl tracking-tight text-[var(--foreground)]">
								{col.title}
							</h3>
							<span className="text-xs font-bold bg-black/5 dark:bg-white/10 text-[var(--color-muted)] px-2 py-0.5 rounded-full">
								{columnTasks.length}
							</span>
						</div>

						{/* Contenedor de la lista (Fondo punteado estético) */}
						<div className="flex-1 rounded-xl border border-dashed border-[var(--color-border)] bg-black/[0.01] dark:bg-white/[0.01] p-2 flex flex-col gap-2 overflow-y-auto">
							{columnTasks.map((task) => (
								<TaskCard key={task.id} task={task} />
							))}
						</div>
					</div>
				);
			})}
		</div>
	);
}