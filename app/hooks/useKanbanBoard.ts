import { useState, useEffect } from "react";
import { Sprint, TaskStatus, Activity } from "@/app/types";
import { DragEndEvent, DragOverEvent, DragStartEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useProjectsManager } from "@/app/context/ProjectContext";
import { notifyActivityError } from "@/app/helpers/notifications";
import { getColumns } from "@/app/components/KanbanBoard";

export function useKanbanBoard(sprint: Sprint, t: (k: string) => string) {
	const { selectedProjectId, updateSprintActivities } = useProjectsManager();
	const COLUMNS = getColumns(t);
	
	const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
	const [localActivities, setLocalActivities] = useState<Activity[]>(sprint.activities || []);
	
	// Mobile: active column tab
	const [mobileActiveColumn, setMobileActiveColumn] = useState<TaskStatus>("todo");

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

	return {
		localActivities,
		activeActivity,
		mobileActiveColumn,
		setMobileActiveColumn,
		sensors,
		handleDragStart,
		handleDragOver,
		handleDragEnd,
		handleMobileStatusChange,
		COLUMNS,
	};
}
