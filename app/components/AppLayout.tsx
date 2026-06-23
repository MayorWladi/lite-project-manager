// /app/components/AppLayout.tsx
"use client";

import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import { Toaster } from "sileo";
import "sileo/styles.css";
import { useSettings } from "@/app/context/SettingsContext";
import ActivityDetailsSidebar from "./ActivityDetailsSidebar";
import { useProjectsManager } from "@/app/context/ProjectContext";
import { TaskStatus } from "../types";

export default function AppLayout({ children }: { children: ReactNode }) {
	const { theme } = useSettings();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(true);

	// Contexto Global
	const {
		selectedProjectId,
		selectedSprintId,
		selectedActivity,
		closeActivityDetails,
		updateActivityDescription,
		updateActivityStatus,
		addTaskToActivity,
		toggleTaskCompletion,
		deleteTask,
		renameTask
	} = useProjectsManager();

	// Handlers dinámicos
	const handleUpdateDescription = (id: string, newDesc: string) => {
		if (selectedProjectId && selectedSprintId) {
			updateActivityDescription(selectedProjectId, selectedSprintId, id, newDesc);
		}
	};

	const handleToggleActivityStatus = (id: string, currentStatus: TaskStatus) => {
		if (selectedProjectId && selectedSprintId) {
			const newStatus: TaskStatus = currentStatus === 'done' ? 'todo' : 'done';
			updateActivityStatus(selectedProjectId, selectedSprintId, id, newStatus);
		}
	};

	const handleAddTask = (id: string, taskTitle: string) => {
		if (selectedProjectId && selectedSprintId) {
			addTaskToActivity(selectedProjectId, selectedSprintId, id, taskTitle);
		}
	};

	const handleToggleTask = (id: string, taskId: string, isCompleted: boolean) => {
		if (selectedProjectId && selectedSprintId) {
			toggleTaskCompletion(selectedProjectId, selectedSprintId, id, taskId);
		}
	};

	const handleDeleteTask = (id: string, taskId: string) => {
		if (selectedProjectId && selectedSprintId) {
			deleteTask(selectedProjectId, selectedSprintId, id, taskId);
		}
	};

	const handleRenameTask = (id: string, taskId: string, newTitle: string) => {
		if (selectedProjectId && selectedSprintId) {
			renameTask(selectedProjectId, selectedSprintId, id, taskId, newTitle);
		}
	};

	return (
		<div className="flex flex-col md:flex-row h-screen w-full bg-background text-foreground overflow-hidden">
			{/* Mobile Header */}
			<div className="md:hidden flex items-center gap-3 p-4 border-b border-(--color-border) bg-background z-20 shrink-0 shadow-sm">
				<button
					onClick={() => setIsMobileMenuOpen(true)}
					className="p-2 -ml-2 text-(--color-muted) hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
				>
					<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>
				<h2 className="text-base font-bold tracking-tight">Lite Project Manager</h2>
			</div>

			<Sidebar
				isOpen={isMobileMenuOpen}
				onClose={() => setIsMobileMenuOpen(false)}
				isDesktopOpen={isDesktopMenuOpen}
				onDesktopToggle={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
			/>

			{/* Contenido Principal */}
			<main className="flex-1 h-full overflow-hidden relative">
				<div className={`h-full w-full transition-all duration-300 ${!isDesktopMenuOpen ? 'md:pl-16' : ''}`}>
					{!isDesktopMenuOpen && (
						<button
							onClick={() => setIsDesktopMenuOpen(true)}
							className="hidden md:flex absolute top-8 left-6 z-30 p-2 text-(--color-muted) hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors border border-(--color-border) bg-background shadow-sm"
						>
							<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						</button>
					)}
					{children}
				</div>
			</main>

			{/* Panel Lateral Derecho Conectado */}
			<ActivityDetailsSidebar
				isOpen={selectedActivity !== null}
				onClose={closeActivityDetails}
				activity={selectedActivity}
				onUpdateDescription={handleUpdateDescription}
				onToggleActivityStatus={handleToggleActivityStatus}
				onAddTask={handleAddTask}
				onToggleTask={handleToggleTask}
				onDeleteTask={handleDeleteTask}
				onRenameTask={handleRenameTask}
			/>

			{/* Tostadora */}
			<Toaster
				theme={theme}
				options={{
					fill: 'var(--color-card-bg)',
					roundness: 8,
					styles: {
						title: 'text-foreground! font-medium! tracking-tight!',
						description: 'text-(--color-muted)! text-sm!',
						badge: 'bg-black/5! dark:bg-white/10! text-foreground!',
						button: 'bg-foreground! hover:bg-black/80! dark:hover:bg-white/80! text-background! rounded-md!',
					},
				}}
			/>
		</div>
	);
}