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

	const getReorderedActivities = (activities: Activity[], activeId: string, overId: string): Activity[] => {
		const activeItem = activities.find(a => a.id === activeId);
		if (!activeItem) return activities;

		const isOverColumn = COLUMNS.some(c => c.id === overId);
		const overItem = activities.find(a => a.id === overId);
		const targetStatus = isOverColumn ? overId : overItem?.status;

		if (!targetStatus) return activities;

		const columnsData: Record<string, Activity[]> = {};
		COLUMNS.forEach(c => { columnsData[c.id] = []; });
		
		activities.forEach(a => {
			if (columnsData[a.status]) {
				columnsData[a.status].push({ ...a }); // Clone to avoid mutation
			}
		});

		const sourceStatus = activeItem.status;
		const activeItemClone = { ...activeItem, status: targetStatus as TaskStatus };

		if (sourceStatus === targetStatus) {
			const colItems = columnsData[sourceStatus];
			const oldIndex = colItems.findIndex(a => a.id === activeId);
			
			if (isOverColumn) {
				// Mover al final de la columna si se suelta en el contenedor
				colItems.splice(oldIndex, 1);
				colItems.push(activeItemClone);
			} else {
				const newIndex = colItems.findIndex(a => a.id === overId);
				if (newIndex !== -1) {
					columnsData[sourceStatus] = arrayMove(colItems, oldIndex, newIndex);
				}
			}
		} else {
			const sourceItems = columnsData[sourceStatus];
			const targetItems = columnsData[targetStatus as string];

			const oldIndex = sourceItems.findIndex(a => a.id === activeId);
			if (oldIndex !== -1) sourceItems.splice(oldIndex, 1);

			if (isOverColumn) {
				targetItems.push(activeItemClone);
			} else {
				const newIndex = targetItems.findIndex(a => a.id === overId);
				// En dnd-kit, al arrastrar hacia otra columna, queremos insertarlo en el índice objetivo
				// Pero si estamos arrastrando hacia abajo o arriba, dnd-kit a veces da el over.id de la tarjeta a desplazar
				// Para simplificar, lo insertamos justo en el newIndex
				if (newIndex !== -1) {
					targetItems.splice(newIndex, 0, activeItemClone);
				} else {
					targetItems.push(activeItemClone);
				}
			}
		}

		const result: Activity[] = [];
		COLUMNS.forEach(c => {
			result.push(...columnsData[c.id]);
		});
		
		return result;
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event;
		if (!over) return;

		const activeId = active.id as string;
		const overId = over.id as string;

		if (activeId === overId) return;

		setLocalActivities((prev) => {
			const activeItem = prev.find(a => a.id === activeId);
			const overItem = prev.find(a => a.id === overId);
			const isOverColumn = COLUMNS.some(c => c.id === overId);
			const targetStatus = isOverColumn ? overId : overItem?.status;

			// Solo actuamos en onDragOver si se cambia de columna
			if (!activeItem || !targetStatus || activeItem.status === targetStatus) {
				return prev;
			}

			return getReorderedActivities(prev, activeId, overId);
		});
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveActivity(null);

		if (!over || !selectedProjectId) {
			setLocalActivities(sprint.activities || []);
			return;
		}

		const activeId = active.id as string;
		const overId = over.id as string;

		// Reordenamos finalmente en el drop
		const finalActivities = getReorderedActivities(localActivities, activeId, overId);
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