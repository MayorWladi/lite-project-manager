// /app/components/KanbanBoard.tsx
"use client";

import { useState, useEffect } from "react";
import { Sprint, TaskStatus, Activity } from "@/app/types";
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, DragOverlay, pointerWithin } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
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
	const { selectedProjectId, updateSprintActivities, addActivity } = useProjectsManager();
	const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
	const [localActivities, setLocalActivities] = useState<Activity[]>(sprint.activities || []);

	const [isAdding, setIsAdding] = useState(false);
	const [newActivityName, setNewActivityName] = useState("");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		setLocalActivities(sprint.activities || []);
	}, [sprint.activities]);

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		const activity = active.data.current?.activity as Activity;
		if (activity) setActiveActivity(activity);
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event;
		if (!over) return;

		const activeId = active.id as string;
		const overId = over.id as string;

		if (activeId === overId) return;

		setLocalActivities((prev) => {
			const activeIndex = prev.findIndex((t) => t.id === activeId);
			const overIndex = prev.findIndex((t) => t.id === overId);
			const isOverColumn = COLUMNS.some(c => c.id === overId);

			if (activeIndex === -1) return prev;

			const activeItem = prev[activeIndex];
			const overItem = overIndex !== -1 ? prev[overIndex] : null;

			// Moviendo a una columna vacía o área de columna
			if (isOverColumn) {
				if (activeItem.status !== overId) {
					const newItems = [...prev];
					newItems[activeIndex] = { ...activeItem, status: overId as TaskStatus };
					return newItems;
				}
			} 
			// Moviendo sobre otro item en distinta columna
			else if (overItem && activeItem.status !== overItem.status) {
				const newItems = [...prev];
				newItems[activeIndex] = { ...activeItem, status: overItem.status };
				return arrayMove(newItems, activeIndex, overIndex);
			}

			return prev;
		});
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveActivity(null);

		if (!over || !selectedProjectId) {
			// Revert si se cancela
			setLocalActivities(sprint.activities || []);
			return;
		}

		const activeId = active.id as string;
		const overId = over.id as string;
		const isOverColumn = COLUMNS.some(c => c.id === overId);

		let finalActivities = [...localActivities];
		const activeIndex = finalActivities.findIndex((t) => t.id === activeId);
		const overIndex = finalActivities.findIndex((t) => t.id === overId);

		if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex && !isOverColumn) {
			finalActivities = arrayMove(finalActivities, activeIndex, overIndex);
		}

		setLocalActivities(finalActivities);
		updateSprintActivities(selectedProjectId, sprint.id, finalActivities);
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
		<DndContext collisionDetection={pointerWithin} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
			<div className="h-full flex flex-col">
				<div className="flex gap-4 mb-4 sticky top-0 bg-[var(--background)] z-10 py-2 border-b border-[var(--color-border)]">
					{COLUMNS.map((col) => {
						const colActivities = localActivities.filter(a => a.status === col.id);
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
							const activities = localActivities.filter((a) => a.status === col.id);
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