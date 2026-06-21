// /app/components/SprintSelector.tsx
"use client";

import { useState, useCallback } from "react";
import { Sprint } from "@/app/types";
import { useSprintMetrics, useProjectsManager } from "@/app/context/ProjectContext";
import { useLanguage } from "@/app/context/LanguageContext";
import ProgressBar from "./ProgressBar";
import { useDoubleTapById } from "@/app/hooks/useDoubleTap";

interface SprintSelectorProps {
	sprints: Sprint[];
	activeSprint: Sprint | undefined;
	onSelectSprint: (id: string) => void;
	onAddSprint: (name: string) => void;
}

export default function SprintSelector({ sprints, activeSprint, onSelectSprint, onAddSprint }: SprintSelectorProps) {
	const [isAdding, setIsAdding] = useState(false);
	const [newSprintName, setNewSprintName] = useState("");
	const { t } = useLanguage();
	const { selectedProjectId, renameSprint, deleteSprint } = useProjectsManager();
	const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
	const [renamingId, setRenamingId] = useState<string | null>(null);
	const [renameValue, setRenameValue] = useState("");

	const metrics = useSprintMetrics(activeSprint);

	const handleSprintDoubleTap = useDoubleTapById(useCallback((sprintId) => {
		const sprint = sprints.find(s => s.id === sprintId);
		if (sprint) { setRenamingId(sprint.id); setRenameValue(sprint.name); setMenuOpenId(null); }
	}, [sprints]));

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (newSprintName.trim()) {
			onAddSprint(newSprintName.trim());
			setNewSprintName("");
			setIsAdding(false);
		}
	};

	const handleRenameSubmit = (sprintId: string) => {
		if (renameValue.trim() && selectedProjectId) {
			renameSprint(selectedProjectId, sprintId, renameValue.trim());
		}
		setRenamingId(null);
	};

	const handleDelete = (sprintId: string) => {
		if (selectedProjectId) {
			deleteSprint(selectedProjectId, sprintId);
			const remaining = sprints.filter(s => s.id !== sprintId);
			if (remaining.length > 0) {
				onSelectSprint(remaining[0].id);
			}
		}
		setMenuOpenId(null);
	};

	return (
		<div className="flex items-center border-b border-(--color-border) pb-2 md:pb-3 mb-3 md:mb-6 relative">
			<div className="hidden md:block flex-1" />
			<div className="flex flex-wrap items-center gap-2 shrink-0 md:justify-center md:max-w-[calc(100%-100px)] px-0 md:px-2 relative">
				{sprints.map((sprint) => (
					<div key={sprint.id} className="relative shrink-0 flex items-center">
						{renamingId === sprint.id ? (
							<form onSubmit={(e) => { e.preventDefault(); handleRenameSubmit(sprint.id); }}>
								<input
									autoFocus
									type="text"
									value={renameValue}
									onChange={(e) => setRenameValue(e.target.value)}
									onBlur={() => handleRenameSubmit(sprint.id)}
									onKeyDown={(e) => { if (e.key === 'Escape') setRenamingId(null); }}
									className="px-3 py-1.5 bg-transparent border border-(--color-border) rounded-md text-sm outline-none focus:border-(--color-muted) text-foreground w-36"
								/>
							</form>
						) : (
							<button
								onClick={() => onSelectSprint(sprint.id)}
								onDoubleClick={(e) => { e.stopPropagation(); setRenamingId(sprint.id); setRenameValue(sprint.name); setMenuOpenId(null); }}
								onTouchEnd={(e) => handleSprintDoubleTap(e, sprint.id)}
								className={`px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1 border ${activeSprint?.id === sprint.id
									? "bg-foreground text-background border-foreground shadow-sm"
									: "bg-background text-(--color-muted) border-(--color-border) hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground hover:border-(--color-muted)"
									}`}
							>
								{sprint.name}
								{activeSprint?.id === sprint.id && (
									<span
										onClick={(e) => {
											e.stopPropagation();
											setMenuOpenId(menuOpenId === sprint.id ? null : sprint.id);
										}}
										className="ml-0.5 opacity-70 hover:opacity-100 p-0.5"
									>
										<svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" /></svg>
									</span>
								)}
							</button>
						)}

						{/* Sprint Context Menu */}
						{menuOpenId === sprint.id && (
							<>
								<div className="fixed inset-0 z-40 cursor-default" onClick={(e) => {
									e.stopPropagation();
									setMenuOpenId(null);
								}} />
								<div
									className="absolute left-0 md:left-auto md:right-0 top-full mt-1 z-50 bg-(--color-card-bg) border border-(--color-border) rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] py-1 min-w-[120px] animate-fade-in"
								>
									<button
										onClick={(e) => { e.stopPropagation(); setRenamingId(sprint.id); setRenameValue(sprint.name); setMenuOpenId(null); }}
										className="w-full text-left px-3 py-1.5 text-xs font-medium text-(--color-muted) hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
									>
										{t("rename")}
									</button>
									<button
										onClick={(e) => { e.stopPropagation(); handleDelete(sprint.id); }}
										className="w-full text-left px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors"
									>
										{t("delete_item")}
									</button>
								</div>
							</>
						)}
					</div>
				))}

				{isAdding ? (
					<form onSubmit={handleSubmit} className="flex items-center gap-2 ml-1">
						<input
							type="text"
							autoFocus
							placeholder={t("sprint_placeholder")}
							value={newSprintName}
							onChange={(e) => setNewSprintName(e.target.value)}
							className="px-3 py-1.5 bg-transparent border border-(--color-border) rounded-md text-sm outline-none transition-colors focus:border-(--color-muted) text-foreground w-36 md:w-48"
							onBlur={() => setIsAdding(false)}
						/>
					</form>
				) : (
					<button
						onClick={() => setIsAdding(true)}
						className="px-3 py-1.5 rounded-md text-xs md:text-sm font-medium text-(--color-muted) border border-dashed border-(--color-border) hover:border-(--color-muted) hover:text-foreground transition-colors flex items-center gap-1.5 whitespace-nowrap bg-background"
					>
						<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
						</svg>
						<span>{t("new_sprint")}</span>
					</button>
				)}
			</div>

			{/* Componente unificado: Progreso del Sprint */}
			<div className="hidden md:flex justify-end flex-1 shrink-0">
				{activeSprint && (
					<ProgressBar
						percentage={metrics.percentage}
						variant="inline"
						className="w-48"
						tooltipPosition="bottom"
						tooltipTitle="Progreso del Sprint"
						tooltipStats={
							metrics.total !== undefined && metrics.done !== undefined ? [
								{ label: "Completadas", value: metrics.done },
								{ label: "Pendientes", value: metrics.total - metrics.done },
								'divider',
								{ label: "Total", value: `${metrics.total} actividades` },
							] : []
						}
					/>
				)}
			</div>
		</div>
	);
}