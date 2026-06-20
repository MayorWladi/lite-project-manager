// /app/components/KanbanBoard.tsx
"use client";

import { useState, useEffect } from "react";
import { Sprint, TaskStatus, Activity } from "@/app/types";
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, closestCorners } from "@dnd-kit/core";
import { useProjectsManager } from "@/app/context/ProjectContext";
import KanbanCell from "./KanbanCell";
import ActivityCard from "./ActivityCard";
import { createPortal } from "react-dom";

const COLUMNS: { id: TaskStatus; title: string }[] = [
	{ id: "todo", title: "To Do" },
	{ id: "working", title: "Working" },
	{ id: "review", title: "Review" },
	{ id: "dropped", title: "Dropped" },
	{ id: "done", title: "Done" },
];

export default function KanbanBoard({ sprint }: { sprint: Sprint }) {
	const { selectedProjectId, moveActivity, addActivity } = useProjectsManager();
	const [activeActivity, setActiveActivity] = useState<Activity | null>(null);

	const [isAdding, setIsAdding] = useState(false);
	const [newActivityName, setNewActivityName] = useState("");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		const activity = active.data.current?.activity as Activity;
		if (activity) setActiveActivity(activity);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveActivity(null);

		if (!over || !selectedProjectId) return;

		const activityId = active.id as string;
		const targetStatus = over.id as TaskStatus;

		if (!targetStatus) return;

		moveActivity(selectedProjectId, sprint.id, activityId, targetStatus);
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
			<div className="h-full flex flex-col">
				<div className="flex gap-4 mb-4 sticky top-0 bg-[var(--background)] z-10 py-2 border-b border-[var(--color-border)]">
					{COLUMNS.map((col) => {
						const colActivities = (sprint.activities || []).filter(a => a.status === col.id);
						return (
							<div key={col.id} className="w-[280px] shrink-0 px-2 flex justify-between items-end pb-1">
								<h3 className="font-editorial text-[var(--color-muted)] text-sm uppercase tracking-widest">{col.title}</h3>
								<span className="text-[10px] font-bold bg-black/5 dark:bg-white/10 text-[var(--color-muted)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">
									{colActivities.length}
								</span>
							</div>
						);
					})}
				</div>

				<div className="flex-1 overflow-x-auto overflow-y-auto scrollbar-hide pb-4">
					<div className="flex gap-4 min-w-max h-full">
						{COLUMNS.map((col) => {
							const activities = (sprint.activities || []).filter((a) => a.status === col.id);
							return <KanbanCell key={col.id} sprintId={sprint.id} statusId={col.id} activities={activities} />;
						})}
					</div>
				</div>

				<div className="mt-4 shrink-0 pb-8">
					{isAdding ? (
						<form onSubmit={handleAddActivity} className="flex items-center gap-2">
							<input
								type="text"
								autoFocus
								placeholder="Nombre de la nueva actividad..."
								value={newActivityName}
								onChange={(e) => setNewActivityName(e.target.value)}
								className="w-[280px] px-3 py-2 bg-transparent border border-[var(--color-border)] rounded-md text-sm outline-none transition-colors focus:border-[var(--color-muted)] text-[var(--foreground)]"
								onBlur={() => setIsAdding(false)}
							/>
						</form>
					) : (
						<button
							onClick={() => setIsAdding(true)}
							className="w-[280px] px-4 py-3 rounded-xl border border-dashed border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--foreground)] hover:border-[var(--color-muted)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm font-medium flex items-center justify-center gap-2"
						>
							<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
							</svg>
							Añadir Actividad
						</button>
					)}
				</div>
			</div>

			{mounted && createPortal(
				<DragOverlay>
					{activeActivity ? (
						<div className="rotate-2 scale-105 shadow-[0_8px_30px_rgb(0,0,0,0.15)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.05)] cursor-grabbing w-[264px]">
							<ActivityCard activity={activeActivity} sprintId={sprint.id} isOverlay />
						</div>
					) : null}
				</DragOverlay>,
				document.body
			)}
		</DndContext>
	);
}