// /app/components/ActivityCard.tsx
"use client";

import { Activity } from "@/app/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useProjectsManager } from "@/app/context/ProjectContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { useCallback } from "react";
import ActivityTaskItem from "./ActivityTaskItem";
import ActivityHeader from "./ActivityHeader";
import AddTaskForm from "./AddTaskForm";

export default function ActivityCard({ activity, sprintId, isOverlay }: { activity: Activity; sprintId: string, isOverlay?: boolean }) {
	const { selectedProjectId, toggleTaskCompletion, addTaskToActivity, deleteTask, renameActivity, deleteActivity, renameTask } = useProjectsManager();
	const { t } = useLanguage();

	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: activity.id,
		data: { activity, sprintId },
		disabled: isOverlay,
	});

	const style = isOverlay ? undefined : {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.4 : 1,
	};

	// Memoizando funciones para evitar re-renderizados en los hijos
	const handleRenameActivity = useCallback((newName: string) => {
		if (selectedProjectId) renameActivity(selectedProjectId, sprintId, activity.id, newName);
	}, [selectedProjectId, sprintId, activity.id, renameActivity]);

	const handleDeleteActivity = useCallback(() => {
		if (selectedProjectId) deleteActivity(selectedProjectId, sprintId, activity.id);
	}, [selectedProjectId, sprintId, activity.id, deleteActivity]);

	const handleAddTask = useCallback((title: string) => {
		if (selectedProjectId) addTaskToActivity(selectedProjectId, sprintId, activity.id, title);
	}, [selectedProjectId, sprintId, activity.id, addTaskToActivity]);

	const handleToggleTask = useCallback((taskId: string) => {
		if (selectedProjectId) toggleTaskCompletion(selectedProjectId, sprintId, activity.id, taskId);
	}, [selectedProjectId, sprintId, activity.id, toggleTaskCompletion]);

	const handleDeleteTask = useCallback((taskId: string) => {
		if (selectedProjectId) deleteTask(selectedProjectId, sprintId, activity.id, taskId);
	}, [selectedProjectId, sprintId, activity.id, deleteTask]);

	const handleRenameTask = useCallback((taskId: string, newTitle: string) => {
		if (selectedProjectId) renameTask(selectedProjectId, sprintId, activity.id, taskId, newTitle);
	}, [selectedProjectId, sprintId, activity.id, renameTask]);

	const tasks = activity.tasks || [];
	const completedTasks = tasks.filter(t => t.isCompleted).length;

	return (
		<div
			ref={isOverlay ? undefined : setNodeRef}
			style={style}
			{...(isOverlay ? {} : listeners)}
			{...(isOverlay ? {} : attributes)}
			className={`bg-(--color-card-bg) border rounded-xl p-4 pt-3 flex flex-col gap-3 transition-all duration-300 cursor-grab active:cursor-grabbing shadow-[0_2px_8px_rgba(0,0,0,0.02)] group relative animate-fade-in
        ${isOverlay ? 'border-(--color-border) cursor-grabbing shadow-none' : (isDragging ? 'border-dashed border-(--color-muted) opacity-60' : 'border-(--color-border) hover:border-(--color-muted) hover:translate-y-[-2px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)]')}
      `}
		>
			<div className="w-full flex justify-center pb-1">
				<div className="w-8 h-1 rounded-full bg-(--color-border) group-hover:bg-(--color-muted) transition-colors" />
			</div>

			<ActivityHeader
				name={activity.name}
				description={activity.description}
				isOverlay={isOverlay}
				onRenameSubmit={handleRenameActivity}
				onDeleteActivity={handleDeleteActivity}
				t={t}
			/>

			<div className="flex flex-col gap-1.5 cursor-default" onPointerDown={e => e.stopPropagation()}>
				<div className="flex items-center justify-between mb-1 select-none">
					<span className="text-[10px] font-bold uppercase tracking-wider text-(--color-muted)">{t("checklist")}</span>
					<span className="text-[10px] font-mono text-(--color-muted)">{completedTasks}/{tasks.length}</span>
				</div>

				{tasks.map((task) => (
					<ActivityTaskItem
						key={task.id}
						task={task}
						onToggle={(e) => { e.stopPropagation(); handleToggleTask(task.id); }}
						onDelete={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}
						onRename={(newTitle) => handleRenameTask(task.id, newTitle)}
					/>
				))}

				<AddTaskForm
					onAdd={handleAddTask}
					placeholderText={t("new_task_placeholder")}
					buttonText={t("add_task")}
				/>
			</div>
		</div>
	);
}