// /app/components/ActivityCard.tsx
"use client";

import { useState } from "react";
import { Activity } from "@/app/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useProjectsManager } from "@/app/context/ProjectContext";
import { useLanguage } from "@/app/context/LanguageContext";

export default function ActivityCard({ activity, sprintId, isOverlay }: { activity: Activity; sprintId: string, isOverlay?: boolean }) {
	const { selectedProjectId, toggleTaskCompletion, addTaskToActivity, deleteTask, renameActivity, deleteActivity, renameTask } = useProjectsManager();
	const { t } = useLanguage();
	const [newTaskTitle, setNewTaskTitle] = useState("");
	const [isAddingTask, setIsAddingTask] = useState(false);
	const [showMenu, setShowMenu] = useState(false);
	const [isRenaming, setIsRenaming] = useState(false);
	const [renameValue, setRenameValue] = useState("");
	const [renamingTaskId, setRenamingTaskId] = useState<string | null>(null);
	const [renameTaskValue, setRenameTaskValue] = useState("");

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
		e.stopPropagation();
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

	const handleRenameSubmit = () => {
		if (renameValue.trim() && selectedProjectId) {
			renameActivity(selectedProjectId, sprintId, activity.id, renameValue.trim());
		}
		setIsRenaming(false);
	};

	const handleRenameTaskSubmit = (taskId: string) => {
		if (renameTaskValue.trim() && selectedProjectId) {
			renameTask(selectedProjectId, sprintId, activity.id, taskId, renameTaskValue.trim());
		}
		setRenamingTaskId(null);
	};

	const handleDeleteActivity = () => {
		if (selectedProjectId) {
			deleteActivity(selectedProjectId, sprintId, activity.id);
		}
		setShowMenu(false);
	};

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

			<div className="flex items-start justify-between gap-1" onPointerDown={e => e.stopPropagation()}>
				<div className="flex-1 min-w-0">
					{isRenaming ? (
						<form onSubmit={(e) => { e.preventDefault(); handleRenameSubmit(); }}>
							<input
								autoFocus
								type="text"
								value={renameValue}
								onChange={(e) => setRenameValue(e.target.value)}
								onBlur={handleRenameSubmit}
								onKeyDown={(e) => { if (e.key === 'Escape') setIsRenaming(false); }}
								className="w-full px-1.5 py-0.5 bg-transparent border border-(--color-border) rounded text-sm outline-none focus:border-(--color-muted) text-foreground -ml-1.5"
							/>
						</form>
					) : (
						<>
							<h4 
								onDoubleClick={(e) => { e.stopPropagation(); setIsRenaming(true); setRenameValue(activity.name); }}
								className="font-semibold text-sm text-foreground leading-tight group-hover:text-(--color-muted) transition-colors select-none truncate cursor-default"
							>
								{activity.name}
							</h4>
							{activity.description && (
								<p className="text-xs text-(--color-muted) mt-1.5 leading-relaxed select-none">
									{activity.description}
								</p>
							)}
						</>
					)}
				</div>

				{/* ⋯ Menu Button */}
				{!isOverlay && !isRenaming && (
					<div className="relative shrink-0">
						<button
							onClick={() => setShowMenu(!showMenu)}
							className="p-0.5 rounded text-(--color-muted) hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
						>
							<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" /></svg>
						</button>

						{showMenu && (
							<>
								<div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
								<div className="absolute right-0 top-full mt-0.5 z-50 bg-(--color-card-bg) border border-(--color-border) rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] py-1 min-w-[120px]">
									<button
										onClick={() => { setIsRenaming(true); setRenameValue(activity.name); setShowMenu(false); }}
										className="w-full text-left px-3 py-1.5 text-xs font-medium text-(--color-muted) hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
									>
										{t("rename")}
									</button>
									<button
										onClick={handleDeleteActivity}
										className="w-full text-left px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors"
									>
										{t("delete_item")}
									</button>
								</div>
							</>
						)}
					</div>
				)}
			</div>

			<div className="flex flex-col gap-1.5 cursor-default" onPointerDown={e => e.stopPropagation()}>
				<div className="flex items-center justify-between mb-1 select-none">
					<span className="text-[10px] font-bold uppercase tracking-wider text-(--color-muted)">{t("checklist")}</span>
					<span className="text-[10px] font-mono text-(--color-muted)">{completedTasks}/{tasks.length}</span>
				</div>

				{tasks.map(task => (
					<div key={task.id} className={`flex items-start gap-2 group/task transition-opacity duration-300 ${task.isCompleted ? 'opacity-60' : 'opacity-100'}`}>
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
						{renamingTaskId === task.id ? (
							<form onSubmit={(e) => { e.preventDefault(); handleRenameTaskSubmit(task.id); }} className="flex-1">
								<input
									autoFocus
									type="text"
									value={renameTaskValue}
									onChange={(e) => setRenameTaskValue(e.target.value)}
									onBlur={() => handleRenameTaskSubmit(task.id)}
									onKeyDown={(e) => { if (e.key === 'Escape') setRenamingTaskId(null); }}
									className="w-full text-xs px-1.5 py-0.5 bg-transparent border border-(--color-border) rounded outline-none focus:border-(--color-muted) text-foreground"
								/>
							</form>
						) : (
							<span 
								onDoubleClick={(e) => { e.stopPropagation(); setRenamingTaskId(task.id); setRenameTaskValue(task.title); }}
								className={`text-xs flex-1 select-none cursor-default ${task.isCompleted ? 'text-(--color-muted) line-through' : 'text-foreground'}`}
							>
								{task.title}
							</span>
						)}
						<button
							onClick={(e) => handleDelete(e, task.id)}
							className="opacity-0 group-hover/task:opacity-100 text-(--color-muted) hover:text-[#9F2F2D] transition-opacity"
						>
							<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
						</button>
					</div>
				))}

				{isAddingTask ? (
					<form onSubmit={handleAddTask} className="mt-1 w-full">
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
						className="mt-1 flex items-center gap-1.5 text-xs text-(--color-muted) hover:text-foreground transition-colors py-1 px-1 -ml-1 rounded hover:bg-black/5 dark:hover:bg-white/5 w-full justify-start"
					>
						<svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
						{t("add_task")}
					</button>
				)}
			</div>
		</div>
	);
}
