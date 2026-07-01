// /app/components/ActivityCard.tsx
"use client";

import { Activity } from "@/app/common/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useProjectsManager } from "@/app/common/context/ProjectContext";
import { useLanguage } from "@/app/common/context/LanguageContext";
import { useCallback } from "react";
import ActivityTaskItem from "@/app/features/activity-details/components/ActivityTaskItem";
import ActivityHeader from "@/app/features/activity-details/components/ActivityHeader";
import AddTaskForm from "@/app/features/activity-details/components/AddTaskForm";

export default function ActivityCard({ activity, sprintId, isOverlay }: { activity: Activity; sprintId: string, isOverlay?: boolean }) {
	const {
		selectedProjectId,
		toggleTaskCompletion,
		addTaskToActivity,
		deleteTask,
		renameActivity,
		deleteActivity,
		renameTask,
		openActivityDetails // <- Nuevo handler del Sidebar
	} = useProjectsManager();

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
			className={`w-[264px] mb-3 break-inside-avoid ${isOverlay ? 'cursor-grabbing' : 'cursor-grab active:cursor-grabbing'}`}
		>
			<div
				className={`bg-(--color-card-bg) border rounded-xl p-4 pt-3 flex flex-col gap-3 transition-all duration-200 ease-out shadow-[0_2px_8px_rgba(0,0,0,0.02)] group relative animate-fade-in
				${isOverlay ? 'border-(--color-border) shadow-none' : (isDragging ? 'border-dashed border-(--color-muted)' : 'border-(--color-border) hover:border-(--color-muted) hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]')}
			  `}
			>
				<div className="w-full flex justify-center pb-1">
					<div className="w-8 h-1 rounded-full bg-(--color-border) group-hover:bg-(--color-muted) transition-colors" />
				</div>

				{/* Envoltura Flex para el Título y el Botón Plátano */}
				<div className="flex items-start justify-between gap-2 w-full">
					<div className="flex-1 min-w-0">
						<ActivityHeader
							name={activity.name}
							description={activity.description}
							isOverlay={isOverlay}
							onRenameSubmit={handleRenameActivity}
							onDeleteActivity={handleDeleteActivity}
							t={t}
						/>
					</div>

					{/* Botón Plátano para Detalles */}
					<button
						onClick={(e) => {
							e.stopPropagation(); // Previene que arrastres la tarjeta
							openActivityDetails(sprintId, activity.id);
						}}
						className="p-1.5 text-lg hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-all active:scale-95 shrink-0 select-none opacity-0 group-hover:opacity-100 focus:opacity-100"
						title="Ver detalles de la actividad"
					>
						🍌
					</button>
				</div>

				<div className="flex flex-col gap-1.5 cursor-default" onPointerDown={e => e.stopPropagation()}>
					<div className="flex items-center justify-between mb-1 select-none">
						<span className="text-[10px] font-bold uppercase tracking-wider text-(--color-muted)">{t("checklist")}</span>
						<span className="text-[10px] font-mono text-(--color-muted)">{completedTasks}/{tasks.length}</span>
					</div>

					<div className="flex flex-col gap-1.5 group/tasklist transition-opacity duration-300">
						{tasks.map((task) => (
							<ActivityTaskItem
								key={task.id}
								task={task}
								onToggle={(e) => { e.stopPropagation(); handleToggleTask(task.id); }}
								onDelete={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}
								onRename={(newTitle) => handleRenameTask(task.id, newTitle)}
							/>
						))}
					</div>

					<AddTaskForm
						onAdd={handleAddTask}
						placeholderText={t("new_task_placeholder")}
						buttonText={t("add_task")}
					/>
				</div>
			</div>
		</div>
	);
}