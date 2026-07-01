// /app/components/MobileActivityCard.tsx
"use client";

import { useState, useCallback } from "react";
import { Activity, TaskStatus } from "@/app/common/types";
import { useProjectsManager } from "@/app/common/context/ProjectContext";
import { useLanguage } from "@/app/common/context/LanguageContext";
import { notifyActivityError } from "@/app/common/helpers/notifications";
import { useDoubleTap, useDoubleTapById } from "@/app/common/hooks/useDoubleTap";
import DropdownMenu from "@/app/common/components/DropdownMenu";

interface MobileActivityCardProps {
	activity: Activity;
	sprintId: string;
	columns: { id: TaskStatus; title: string }[];
	onStatusChange: (activityId: string, newStatus: TaskStatus) => void;
}

export default function MobileActivityCard({ activity, sprintId, columns, onStatusChange }: MobileActivityCardProps) {
	const { selectedProjectId, toggleTaskCompletion, addTaskToActivity, deleteTask, renameActivity, deleteActivity, renameTask } = useProjectsManager();
	const { t } = useLanguage();
	const [newTaskTitle, setNewTaskTitle] = useState("");
	const [isAddingTask, setIsAddingTask] = useState(false);
	const [showStatusPicker, setShowStatusPicker] = useState(false);
	const [isAnimatingOut, setIsAnimatingOut] = useState<"left" | "right" | null>(null);
	// We no longer use showMenu but kept the state hook for structural consistency, 
	// actually we can just remove it if it's unused.
	const [isRenaming, setIsRenaming] = useState(false);
	const [renameValue, setRenameValue] = useState("");
	const [isShaking, setIsShaking] = useState(false);
	const [renamingTaskId, setRenamingTaskId] = useState<string | null>(null);
	const [renameTaskValue, setRenameTaskValue] = useState("");

	const tasks = activity.tasks || [];
	const completedTasks = tasks.filter(t => t.isCompleted).length;

	const currentCol = columns.find(c => c.id === activity.status);

	// Double-tap handlers for mobile
	const handleActivityTitleDoubleTap = useDoubleTap(useCallback((e) => {
		e.stopPropagation();
		setIsRenaming(true);
		setRenameValue(activity.name);
	}, [activity.name]));

	const handleTaskDoubleTap = useDoubleTapById(useCallback((taskId) => {
		const task = (activity.tasks || []).find(t => t.id === taskId);
		if (task) {
			setRenamingTaskId(taskId);
			setRenameTaskValue(task.title);
		}
	}, [activity.tasks]));

	const handleToggle = (taskId: string) => {
		if (selectedProjectId) {
			toggleTaskCompletion(selectedProjectId, sprintId, activity.id, taskId);
		}
	};

	const handleDelete = (taskId: string) => {
		if (selectedProjectId) {
			deleteTask(selectedProjectId, sprintId, activity.id, taskId);
		}
	};

	const handleAddTask = (e: React.FormEvent) => {
		e.preventDefault();
		if (newTaskTitle.trim() && selectedProjectId) {
			addTaskToActivity(selectedProjectId, sprintId, activity.id, newTaskTitle.trim());
			setNewTaskTitle("");
			setIsAddingTask(false);
		}
	};

	const handleStatusChange = (newStatusId: TaskStatus) => {
		if (newStatusId === activity.status) {
			setShowStatusPicker(false);
			return;
		}

		// Verify first
		if (newStatusId === 'review' || newStatusId === 'done') {
			if (activity.tasks && activity.tasks.length > 0) {
				const hasUncompleted = activity.tasks.some(t => !t.isCompleted);
				if (hasUncompleted) {
					setIsShaking(true);
					setTimeout(() => setIsShaking(false), 400);
					setShowStatusPicker(false);
					notifyActivityError();
					return;
				}
			}
		}

		const currentIndex = columns.findIndex(c => c.id === activity.status);
		const targetIndex = columns.findIndex(c => c.id === newStatusId);

		const direction = targetIndex > currentIndex ? "right" : "left";
		setIsAnimatingOut(direction);
		setShowStatusPicker(false);

		setTimeout(() => {
			onStatusChange(activity.id, newStatusId);
		}, 300);
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
	};

	return (
		<div className={`bg-(--color-card-bg) border border-(--color-border) rounded-xl p-4 flex flex-col gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300 animate-fade-in ${isShaking ? 'animate-shake border-red-500/50' : ''} ${isAnimatingOut === "right" ? "translate-x-[120%] opacity-0" : isAnimatingOut === "left" ? "translate-x-[-120%] opacity-0" : "translate-x-0 opacity-100"
			}`}>
			{/* Header: Title + Menu + Status Chip */}
			<div className="flex-1 min-w-0 flex items-center gap-1.5">
				{isRenaming ? (
					<form onSubmit={(e) => { e.preventDefault(); handleRenameSubmit(); }} className="flex-1">
						<input
							autoFocus
							type="text"
							value={renameValue}
							onChange={(e) => setRenameValue(e.target.value)}
							onBlur={handleRenameSubmit}
							onKeyDown={(e) => { if (e.key === 'Escape') setIsRenaming(false); }}
							className="w-full px-2 py-1 bg-transparent border border-(--color-border) rounded-md text-sm outline-none focus:border-(--color-muted) text-foreground"
						/>
					</form>
				) : (
					<div className="flex-1 min-w-0">
						<h4
							onDoubleClick={(e) => { e.stopPropagation(); setIsRenaming(true); setRenameValue(activity.name); }}
							onTouchEnd={handleActivityTitleDoubleTap}
							className="font-semibold text-sm text-foreground leading-tight truncate cursor-default"
						>
							{activity.name}
						</h4>
						{activity.description && (
							<p className="text-xs text-(--color-muted) mt-1 leading-relaxed">
								{activity.description}
							</p>
						)}
					</div>
				)}
				{/* Status Chip / Picker */}
				<div className="relative shrink-0">
					<button
						onClick={() => setShowStatusPicker(!showStatusPicker)}
						className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-(--color-border) bg-black/3 dark:bg-white/5 text-(--color-muted) active:scale-95 transition-transform flex items-center gap-1"
					>
						{currentCol?.title || activity.status}
						<svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
						</svg>
					</button>

					{showStatusPicker && (
						<>
							<div className="fixed inset-0 z-40" onClick={() => setShowStatusPicker(false)} />
							<div className="absolute right-0 top-full mt-1 z-50 bg-(--color-card-bg) border border-(--color-border) rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] py-1 min-w-[130px]">
								{columns.map(col => (
									<button
										key={col.id}
										onClick={() => handleStatusChange(col.id)}
										className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${activity.status === col.id
											? "text-foreground bg-black/5 dark:bg-white/10"
											: "text-(--color-muted) active:bg-black/5 dark:active:bg-white/5"
											}`}
									>
										{col.title}
									</button>
								))}
							</div>
						</>
					)}
				</div>

				{/* ⋯ Menu */}
				<DropdownMenu
					triggerClassName="p-1 rounded text-(--color-muted) active:text-foreground"
					menuClassName="left-0 top-full mt-0.5 z-50 bg-(--color-card-bg) border border-(--color-border) rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] py-1 min-w-[120px] max-w-[calc(100vw-50%)]"
					items={[
						{
							label: t("rename"),
							onClick: () => setIsRenaming(true),
						},
						{
							label: t("delete_item"),
							onClick: handleDeleteActivity,
							isDanger: true,
						},
					]}
				/>
			</div>

			{/* Checklist */}
			{tasks.length > 0 && (
				<div className="flex flex-col gap-1.5">
					<div className="flex items-center justify-between mb-1">
						<span className="text-[10px] font-bold uppercase tracking-wider text-(--color-muted)">{t("checklist")}</span>
						<span className="text-[10px] font-mono text-(--color-muted)">{completedTasks}/{tasks.length}</span>
					</div>

					{tasks.map(task => (
						<div key={task.id} className={`flex items-start gap-2.5 transition-opacity duration-300 ${task.isCompleted ? 'opacity-60' : 'opacity-100'}`}>
							<button
								type="button"
								onClick={() => handleToggle(task.id)}
								className="mt-0.5 shrink-0 text-(--color-muted) active:scale-90 transition-transform"
							>
								{task.isCompleted ? (
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
										<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
										<polyline points="22 4 12 14.01 9 11.01"></polyline>
									</svg>
								) : (
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
										className="w-full text-sm px-1.5 py-0.5 bg-transparent border border-(--color-border) rounded outline-none focus:border-(--color-muted) text-foreground"
									/>
								</form>
							) : (
								<span
									onDoubleClick={(e) => { e.stopPropagation(); setRenamingTaskId(task.id); setRenameTaskValue(task.title); }}
									onTouchEnd={(e) => handleTaskDoubleTap(e, task.id)}
									className={`text-sm flex-1 select-none cursor-default ${task.isCompleted ? 'text-(--color-muted) line-through' : 'text-foreground'}`}
								>
									{task.title}
								</span>
							)}
							<button
								onClick={() => handleDelete(task.id)}
								className="text-(--color-muted) active:text-[#9F2F2D] p-1"
							>
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
							</button>
						</div>
					))}
				</div>
			)}

			{/* Add Task */}
			{isAddingTask ? (
				<form onSubmit={handleAddTask} className="mt-1 w-full">
					<input
						autoFocus
						type="text"
						value={newTaskTitle}
						onChange={e => setNewTaskTitle(e.target.value)}
						onBlur={() => setIsAddingTask(false)}
						placeholder={t("new_task_placeholder")}
						className="w-full text-sm px-3 py-2 bg-transparent border border-(--color-border) rounded-lg text-foreground outline-none focus:border-(--color-muted)"
					/>
				</form>
			) : (
				<button
					type="button"
					onClick={() => setIsAddingTask(true)}
					className="mt-1 flex items-center gap-1.5 text-xs text-(--color-muted) active:text-foreground transition-colors py-1.5 px-2 -ml-1 rounded-lg active:bg-black/5 dark:active:bg-white/5 w-full justify-start"
				>
					<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
					{t("add_task")}
				</button>
			)}
		</div>
	);
}
