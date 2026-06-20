// /app/components/ActivityCard.tsx
"use client";

import { useState } from "react";
import { Activity } from "@/app/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useProjectsManager } from "@/app/context/ProjectContext";
import { useLanguage } from "@/app/context/LanguageContext";

export default function ActivityCard({ activity, sprintId, isOverlay }: { activity: Activity; sprintId: string, isOverlay?: boolean }) {
	const { selectedProjectId, toggleTaskCompletion, addTaskToActivity, deleteTask } = useProjectsManager();
	const { t } = useLanguage();
	const [newTaskTitle, setNewTaskTitle] = useState("");
	const [isAddingTask, setIsAddingTask] = useState(false);

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

	const handleToggle = (e: React.MouseEvent, taskId: string) => {
		e.stopPropagation(); // Evitar interferir con el drag
		if (selectedProjectId) {
			toggleTaskCompletion(selectedProjectId, sprintId, activity.id, taskId);
		}
	};

	const handleDelete = (e: React.MouseEvent, taskId: string) => {
		e.stopPropagation();
		if (selectedProjectId) {
			deleteTask(selectedProjectId, sprintId, activity.id, taskId);
		}
	};

	const handleAddTask = (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (newTaskTitle.trim() && selectedProjectId) {
			addTaskToActivity(selectedProjectId, sprintId, activity.id, newTaskTitle.trim());
			setNewTaskTitle("");
			setIsAddingTask(false);
		}
	};

	const tasks = activity.tasks || [];
	const completedTasks = tasks.filter(t => t.isCompleted).length;

	return (
		<div
			ref={isOverlay ? undefined : setNodeRef}
			style={style}
			{...(isOverlay ? {} : listeners)}
			{...(isOverlay ? {} : attributes)}
			className={`bg-(--color-card-bg) border rounded-xl p-4 pt-3 flex flex-col gap-3 transition-all duration-300 cursor-grab active:cursor-grabbing shadow-[0_2px_8px_rgba(0,0,0,0.02)] group relative
        ${isOverlay ? 'border-(--color-border) cursor-grabbing shadow-none' : (isDragging ? 'border-dashed border-(--color-muted) opacity-60' : 'border-(--color-border) hover:border-(--color-muted) hover:translate-y-[-2px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)]')}
      `}
		>
			<div className="w-full flex justify-center pb-1">
				<div className="w-8 h-1 rounded-full bg-(--color-border) group-hover:bg-(--color-muted) transition-colors" />
			</div>

			<div>
				<h4 className="font-semibold text-sm text-foreground leading-tight group-hover:text-(--color-muted) transition-colors select-none">
					{activity.name}
				</h4>
				{activity.description && (
					<p className="text-xs text-(--color-muted) mt-1.5 leading-relaxed select-none">
						{activity.description}
					</p>
				)}
			</div>

			<div className="flex flex-col gap-1.5 cursor-default" onPointerDown={e => e.stopPropagation()}>
				<div className="flex items-center justify-between mb-1 select-none">
					<span className="text-[10px] font-bold uppercase tracking-wider text-(--color-muted)">{t("checklist")}</span>
					<span className="text-[10px] font-mono text-(--color-muted)">{completedTasks}/{tasks.length}</span>
				</div>

				{tasks.map(task => (
					<div key={task.id} className="flex items-start gap-2 group/task">
						<button
							type="button"
							onClick={(e) => handleToggle(e, task.id)}
							className="mt-0.5 shrink-0 text-(--color-muted) hover:text-foreground"
						>
							{task.isCompleted ? (
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
									<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
									<polyline points="22 4 12 14.01 9 11.01"></polyline>
								</svg>
							) : (
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<circle cx="12" cy="12" r="10"></circle>
								</svg>
							)}
						</button>
						<span className={`text-xs flex-1 select-none ${task.isCompleted ? 'text-(--color-muted) line-through' : 'text-foreground'}`}>
							{task.title}
						</span>
						<button
							onClick={(e) => handleDelete(e, task.id)}
							className="opacity-0 group-hover/task:opacity-100 text-(--color-muted) hover:text-[#9F2F2D] transition-opacity"
						>
							<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
						</button>
					</div>
				))}

				{isAddingTask ? (
					<form onSubmit={handleAddTask} className="mt-1">
						<input
							autoFocus
							type="text"
							value={newTaskTitle}
							onChange={e => setNewTaskTitle(e.target.value)}
							onKeyDown={e => {
								if (e.key === 'Enter') {
									e.stopPropagation();
								}
							}}
							onBlur={() => setIsAddingTask(false)}
							placeholder={t("new_task_placeholder")}
							className="w-full text-xs px-2 py-1.5 bg-transparent border border-(--color-border) rounded text-foreground outline-none focus:border-(--color-muted)"
						/>
					</form>
				) : (
					<button
						type="button"
						onClick={(e) => { e.stopPropagation(); setIsAddingTask(true); }}
						className="mt-1 flex items-center gap-1.5 text-xs text-(--color-muted) hover:text-foreground transition-colors py-1 px-1 -ml-1 rounded hover:bg-black/5 dark:hover:bg-white/5 w-fit"
					>
						<svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
						{t("add_task")}
					</button>
				)}
			</div>
		</div>
	);
}
