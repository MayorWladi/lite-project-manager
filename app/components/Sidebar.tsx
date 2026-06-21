// /app/components/Sidebar.tsx
"use client";

import React, { useState, useCallback } from "react";
import { useProjectsManager } from "@/app/context/ProjectContext";
import { useLanguage } from "@/app/context/LanguageContext";
import SettingsModal from "./SettingsModal";
import ProgressBar from "./ProgressBar";
import { useDoubleTapById } from "@/app/hooks/useDoubleTap";

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
	isDesktopOpen?: boolean;
	onDesktopToggle?: () => void;
}

export default function Sidebar({ isOpen, onClose, isDesktopOpen = true, onDesktopToggle }: SidebarProps) {
	const { projects, selectedProjectId, setSelectedProjectId, addProject, renameProject, deleteProject } = useProjectsManager();
	const { t } = useLanguage();
	const [newProjectName, setNewProjectName] = useState("");
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
	const [renamingId, setRenamingId] = useState<string | null>(null);
	const [renameValue, setRenameValue] = useState("");
	const [storageUsage, setStorageUsage] = useState(0);

	const handleProjectDoubleTap = useDoubleTapById(useCallback((projectId) => {
		const project = projects.find(p => p.id === projectId);
		if (project) startRename(project);
	}, [projects]));

	React.useEffect(() => {
		const calculateStorage = () => {
			let total = 0;
			for (let x in localStorage) {
				if (!localStorage.hasOwnProperty(x)) continue;
				total += ((localStorage[x].length + x.length) * 2);
			}
			setStorageUsage(Math.min((total / 5242880) * 100, 100));
		};
		calculateStorage();
		const interval = setInterval(calculateStorage, 5000);
		return () => clearInterval(interval);
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (newProjectName.trim()) {
			addProject(newProjectName.trim());
			setNewProjectName("");
		}
	};

	const handleRenameSubmit = (projectId: string) => {
		if (renameValue.trim()) {
			renameProject(projectId, renameValue.trim());
		}
		setRenamingId(null);
	};

	const startRename = (project: { id: string; name: string }) => {
		setRenamingId(project.id);
		setRenameValue(project.name);
		setMenuOpenId(null);
	};

	return (
		<>
			{isOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-sm md:hidden transition-opacity"
					onClick={onClose}
				/>
			)}

			<aside className={`fixed inset-y-0 left-0 z-50 bg-(--color-card-bg) border-r border-(--color-border) flex flex-col transition-all duration-300 ease-in-out md:static ${isOpen ? 'translate-x-0 shadow-[20px_0_40px_rgba(0,0,0,0.05)] w-[260px]' : '-translate-x-full md:translate-x-0'} ${isDesktopOpen ? 'md:w-[260px]' : 'md:w-0 md:border-r-0 overflow-hidden w-[260px]'}`}>
				<div className="w-[260px] min-w-[260px] h-full flex flex-col">
					{/* Encabezado */}
					<div className="h-16 flex justify-between items-center px-6 border-b border-(--color-border) shrink-0">
						<h1 className="text-lg font-medium text-foreground tracking-tight truncate">
							Lite Project Manager
						</h1>
						<button className="md:hidden p-1 -mr-2 text-(--color-muted) hover:text-foreground transition-colors" onClick={onClose}>
							<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
						</button>
						{onDesktopToggle && (
							<button className="hidden md:block p-1 -mr-2 text-(--color-muted) hover:text-foreground transition-colors" onClick={onDesktopToggle}>
								<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
							</button>
						)}
					</div>

					{/* Lista de Proyectos */}
					<div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
						<div className="px-3 py-2 mb-2">
							<h2 className="text-[10px] font-bold text-(--color-muted) uppercase tracking-wider">{t("projects")}</h2>
						</div>

						{projects.length === 0 ? (
							<p className="text-sm text-(--color-muted) px-3 italic">{t("no_projects")}</p>
						) : (
							<div className="space-y-0.5">
								{projects.map(project => (
									<div key={project.id} className="relative group">
										{renamingId === project.id ? (
											<form onSubmit={(e) => { e.preventDefault(); handleRenameSubmit(project.id); }} className="px-1">
												<input
													autoFocus
													type="text"
													value={renameValue}
													onChange={(e) => setRenameValue(e.target.value)}
													onBlur={() => handleRenameSubmit(project.id)}
													onKeyDown={(e) => { if (e.key === 'Escape') setRenamingId(null); }}
													className="w-full px-2 py-1.5 bg-transparent border border-(--color-border) rounded-md text-sm outline-none focus:border-(--color-muted) text-foreground"
												/>
											</form>
										) : (
											<button
												onClick={() => setSelectedProjectId(project.id)}
												onDoubleClick={(e) => { e.stopPropagation(); startRename(project); }}
												onTouchEnd={(e) => handleProjectDoubleTap(e, project.id)}
												className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center justify-between ${selectedProjectId === project.id
													? "bg-black/4 dark:bg-white/10 text-foreground font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
													: "text-(--color-muted) font-medium hover:bg-black/3 dark:hover:bg-white/5 hover:text-foreground hover:translate-x-0.5"
													}`}
											>
												<span className="truncate">{project.name}</span>
												<span
													onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === project.id ? null : project.id); }}
													className={`shrink-0 p-0.5 rounded text-(--color-muted) hover:text-foreground transition-opacity ${selectedProjectId === project.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
												>
													<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" /></svg>
												</span>
											</button>
										)}

										{/* Context Menu */}
										{menuOpenId === project.id && (
											<>
												<div className="fixed inset-0 z-40" onClick={() => setMenuOpenId(null)} />
												<div className="absolute right-2 top-full mt-0.5 z-50 bg-(--color-card-bg) border border-(--color-border) rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] py-1 min-w-[120px]">
													<button
														onClick={() => startRename(project)}
														className="w-full text-left px-3 py-1.5 text-xs font-medium text-(--color-muted) hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
													>
														{t("rename")}
													</button>
													<button
														onClick={() => { deleteProject(project.id); setMenuOpenId(null); }}
														className="w-full text-left px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors"
													>
														{t("delete_item")}
													</button>
												</div>
											</>
										)}
									</div>
								))}
							</div>
						)}
					</div>

					{/* Formulario para Nuevo Proyecto */}
					<div className="p-4 border-t border-(--color-border)">
						<form onSubmit={handleSubmit} className="flex flex-col gap-2">
							<label className="text-[10px] font-medium text-(--color-muted) uppercase tracking-wider">
								{t("new_project")}
							</label>
							<input
								type="text"
								placeholder={t("project_placeholder")}
								value={newProjectName}
								onChange={(e) => setNewProjectName(e.target.value)}
								className="w-full px-3 py-2 bg-transparent border border-(--color-border) rounded-md text-sm outline-none transition-colors focus:border-(--color-muted) text-foreground"
							/>
						</form>
					</div>

					{/* Componente unificado: Almacenamiento Local */}
					<div className="px-4 py-3 border-t border-(--color-border)">
						<ProgressBar
							percentage={storageUsage}
							label="Storage"
							displayValue={`${storageUsage.toFixed(1)}%`}
							variant="stacked"
							tooltipPosition="top"
							tooltipTitle="Almacenamiento Local"
							tooltipStats={[
								{ label: "Usado", value: `${(storageUsage * 5 / 100).toFixed(2)} MB` },
								{ label: "Libre", value: `${(5 - (storageUsage * 5 / 100)).toFixed(2)} MB` },
								'divider',
								{ label: "Total Estimado", value: "5.00 MB" },
							]}
						/>
					</div>

					{/* Botón de Ajustes */}
					<div className="p-3 border-t border-(--color-border)">
						<button
							onClick={() => setIsSettingsOpen(true)}
							className="w-full text-left px-3 py-2 rounded-lg text-sm text-(--color-muted) font-medium hover:bg-black/3 dark:hover:bg-white/5 hover:text-foreground hover:translate-x-0.5 transition-all duration-200 flex items-center gap-2.5"
						>
							<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
								<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
							</svg>
							<span>{t("settings")}</span>
						</button>
					</div>
				</div>
			</aside>
			<SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
		</>
	);
}