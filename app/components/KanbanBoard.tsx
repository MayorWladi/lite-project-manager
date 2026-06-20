// /app/components/KanbanBoard.tsx
"use client";

import { useState, useEffect } from "react";
import { Sprint, TaskStatus, Activity } from "@/app/types";
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, DragOverlay, pointerWithin, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useProjectsManager } from "@/app/context/ProjectContext";
import { useLanguage } from "@/app/context/LanguageContext";
import KanbanCell from "./KanbanCell";
import ActivityCard from "./ActivityCard";
import MobileActivityCard from "./MobileActivityCard"
import { createPortal } from "react-dom";
import { notifyActivityError } from "@/app/helpers/notifications";

export const getColumns = (t: (k: string) => string): { id: TaskStatus; title: string }[] => [
	{ id: "todo", title: t("col_todo") },
	{ id: "working", title: t("col_working") },
	{ id: "review", title: t("col_review") },
	{ id: "dropped", title: t("col_dropped") },
	{ id: "done", title: t("col_done") },
];

export default function KanbanBoard({ sprint }: { sprint: Sprint }) {
	const { selectedProjectId, updateSprintActivities, addActivity } = useProjectsManager();
	const { t } = useLanguage();
	const COLUMNS = getColumns(t);
	const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
	const [localActivities, setLocalActivities] = useState<Activity[]>(sprint.activities || []);

	const [isAdding, setIsAdding] = useState(false);
	const [newActivityName, setNewActivityName] = useState("");
	const [mounted, setMounted] = useState(false);

	// Mobile: active column tab
	const [mobileActiveColumn, setMobileActiveColumn] = useState<TaskStatus>("todo");

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		setLocalActivities(sprint.activities || []);
	}, [sprint.activities]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		})
	);

	// --- Drag handlers (desktop only) ---
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

		if (targetStatus === 'review' || targetStatus === 'done') {
			if (activeItem.tasks && activeItem.tasks.length > 0) {
				const hasUncompleted = activeItem.tasks.some(t => !t.isCompleted);
				if (hasUncompleted) {
					return activities;
				}
			}
		}

		const columnsData: Record<string, Activity[]> = {};
		COLUMNS.forEach(c => { columnsData[c.id] = []; });

		activities.forEach(a => {
			if (columnsData[a.status]) {
				columnsData[a.status].push({ ...a });
			}
		});

		const sourceStatus = activeItem.status;
		const activeItemClone = { ...activeItem, status: targetStatus as TaskStatus };

		if (sourceStatus === targetStatus) {
			const colItems = columnsData[sourceStatus];
			const oldIndex = colItems.findIndex(a => a.id === activeId);

			if (isOverColumn) {
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

		const activeItem = localActivities.find(a => a.id === activeId);
		const isOverColumn = COLUMNS.some(c => c.id === overId);
		const overItem = localActivities.find(a => a.id === overId);
		const targetStatus = isOverColumn ? overId : overItem?.status;

		if (activeItem && targetStatus && (targetStatus === 'review' || targetStatus === 'done') && activeItem.status !== targetStatus) {
			if (activeItem.tasks && activeItem.tasks.some(t => !t.isCompleted)) {
				notifyActivityError();
				setLocalActivities(sprint.activities || []);
				return;
			}
		}

		const finalActivities = getReorderedActivities(localActivities, activeId, overId);
		setLocalActivities(finalActivities);
		updateSprintActivities(selectedProjectId, sprint.id, finalActivities);
	};

	// --- Mobile: change activity status ---
	const handleMobileStatusChange = (activityId: string, newStatus: TaskStatus) => {
		if (!selectedProjectId) return;
		
		const activity = localActivities.find(a => a.id === activityId);
		if (!activity) return;

		if (newStatus === 'review' || newStatus === 'done') {
			if (activity.tasks && activity.tasks.length > 0) {
				const hasUncompleted = activity.tasks.some(t => !t.isCompleted);
				if (hasUncompleted) {
					notifyActivityError();
					return;
				}
			}
		}

		const updated = localActivities.map(a =>
			a.id === activityId ? { ...a, status: newStatus } : a
		);
		setLocalActivities(updated);
		updateSprintActivities(selectedProjectId, sprint.id, updated);
	};

	const handleAddActivity = (e: React.FormEvent) => {
		e.preventDefault();
		if (newActivityName.trim() && selectedProjectId) {
			addActivity(selectedProjectId, sprint.id, newActivityName.trim());
			setNewActivityName("");
			setIsAdding(false);
		}
	};

	const mobileActivities = localActivities.filter(a => a.status === mobileActiveColumn);

	return (
		<>
			{/* ===== MOBILE VIEW ===== */}
			<div className="md:hidden h-full flex flex-col">
				{/* Column Tabs */}
				<div className="flex overflow-x-auto scrollbar-hide border-b border-(--color-border) shrink-0 bg-background">
					{COLUMNS.map(col => {
						const count = localActivities.filter(a => a.status === col.id).length;
						return (
							<button
								key={col.id}
								onClick={() => setMobileActiveColumn(col.id)}
								className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${mobileActiveColumn === col.id
									? "border-foreground text-foreground"
									: "border-transparent text-(--color-muted)"
									}`}
							>
								{col.title}
								<span key={count} className={`animate-pop-count text-[10px] font-bold px-1.5 py-0.5 rounded-full ${mobileActiveColumn === col.id
									? "bg-foreground text-background"
									: "bg-black/5 dark:bg-white/10 text-(--color-muted)"
									}`}>
									{count}
								</span>
							</button>
						);
					})}
				</div>

				{/* Active Column Cards */}
				<div key={mobileActiveColumn} className="flex-1 overflow-y-auto p-3 space-y-3 pb-24 animate-column-enter">
					{mobileActivities.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-16 text-(--color-muted)">
							<svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="mb-3 opacity-40">
								<path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7m16 0v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5m16 0h-2.586a1 1 0 0 0-.707.293l-2.414 2.414a1 1 0 0 1-.707.293h-3.172a1 1 0 0 1-.707-.293l-2.414-2.414A1 1 0 0 0 6.586 13H4" />
							</svg>
							<p className="text-sm">{t("no_activities_here")}</p>
						</div>
					) : (
						mobileActivities.map(activity => (
							<MobileActivityCard
								key={activity.id}
								activity={activity}
								sprintId={sprint.id}
								columns={COLUMNS}
								onStatusChange={handleMobileStatusChange}
							/>
						))
					)}
				</div>

				{/* Mobile Add Activity FAB */}
				<div className="fixed bottom-6 right-6 z-50">
					{isAdding ? (
						<form onSubmit={handleAddActivity} className="flex gap-2 bg-(--color-card-bg) p-2 rounded-xl shadow-xl border border-(--color-border) animate-pop-count origin-bottom-right">
							<input
								type="text"
								autoFocus
								placeholder={t("new_activity_placeholder")}
								value={newActivityName}
								onChange={(e) => setNewActivityName(e.target.value)}
								className="w-48 px-3 py-2 bg-transparent border-none rounded-lg text-sm outline-none focus:ring-0 text-foreground"
								onBlur={() => { if (!newActivityName.trim()) setIsAdding(false); }}
							/>
							<button type="submit" className="px-3 py-2 bg-foreground text-background rounded-lg text-sm font-medium shrink-0">
								{t("add")}
							</button>
						</form>
					) : (
						<button
							onClick={() => setIsAdding(true)}
							className="w-14 h-14 bg-foreground text-background rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
						>
							<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
							</svg>
						</button>
					)}
				</div>
			</div>

			{/* ===== DESKTOP VIEW ===== */}
			<DndContext sensors={sensors} collisionDetection={pointerWithin} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
				<div className="hidden md:flex h-full flex-col">
					{/* Desktop Add Activity Header */}
					<div className="mb-4 px-2 lg:px-6">
						{isAdding ? (
							<form onSubmit={handleAddActivity} className="flex items-center gap-2">
								<input
									type="text"
									autoFocus
									placeholder={t("new_activity_placeholder")}
									value={newActivityName}
									onChange={(e) => setNewActivityName(e.target.value)}
									className="w-[280px] px-3 py-2 bg-transparent border border-(--color-border) rounded-md text-sm outline-none transition-colors focus:border-(--color-muted) text-foreground shadow-sm"
									onBlur={() => setIsAdding(false)}
								/>
							</form>
						) : (
							<button
								onClick={() => setIsAdding(true)}
								className="px-4 py-2.5 rounded-lg border border-(--color-border) text-(--color-muted) hover:text-foreground hover:border-(--color-muted) bg-background hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm font-medium flex items-center gap-2 shadow-sm"
							>
								<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
								</svg>
								{t("add_activity")}
							</button>
						)}
					</div>

					<div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide pb-4 flex">
						<div className="flex flex-col min-w-max h-full mx-auto px-2 lg:px-6">
							{/* Headers */}
							<div className="flex gap-4 mb-4 sticky top-0 bg-background z-10 py-2 border-b border-(--color-border)">
								{COLUMNS.map((col) => {
									const colActivities = localActivities.filter(a => a.status === col.id);
									return (
										<div key={col.id} className="w-[280px] shrink-0 px-2 flex justify-between items-end pb-1">
											<h3 className="font-bold text-(--color-muted) text-sm uppercase tracking-widest">{col.title}</h3>
											<span className="text-[10px] font-bold bg-black/5 dark:bg-white/10 text-(--color-muted) px-1.5 py-0.5 rounded border border-(--color-border)">
												{colActivities.length}
											</span>
										</div>
									);
								})}
							</div>

							{/* Columns */}
							<div className="flex gap-4 flex-1 min-h-0">
								{COLUMNS.map((col) => {
									const activities = localActivities.filter((a) => a.status === col.id);
									return <KanbanCell key={col.id} sprintId={sprint.id} statusId={col.id} activities={activities} />;
								})}
							</div>
						</div>
					</div>
				</div>

				{mounted && createPortal(
					<DragOverlay>
						{activeActivity ? (
							<div className="rotate-3 scale-105 shadow-[0_12px_40px_rgba(58,54,50,0.15)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] cursor-grabbing w-[264px]">
								<ActivityCard activity={activeActivity} sprintId={sprint.id} isOverlay />
							</div>
						) : null}
					</DragOverlay>,
					document.body
				)}
			</DndContext>
		</>
	);
}