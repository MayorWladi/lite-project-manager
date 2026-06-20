// /app/components/Sidebar.tsx
"use client";

import { useState } from "react";
import { useProjectsManager } from "@/app/context/ProjectContext";
import SettingsModal from "./SettingsModal";

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
	const { projects, selectedProjectId, setSelectedProjectId, addProject } = useProjectsManager();
	const [newProjectName, setNewProjectName] = useState("");

	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (newProjectName.trim()) {
			addProject(newProjectName.trim());
			setNewProjectName("");
		}
	};

	return (
		<>
			{/* Backdrop móvil */}
			{isOpen && (
				<div 
					className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-sm md:hidden transition-opacity"
					onClick={onClose}
				/>
			)}

			<aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-(--color-border) bg-background flex flex-col h-full shrink-0 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
				{/* Cabecera del Sidebar */}
				<div className="p-5 border-b border-(--color-border) flex justify-between items-center">
					<h2 className="text-xl font-bold tracking-tight">Proyectos</h2>
					<button className="md:hidden p-1 text-(--color-muted) hover:text-foreground" onClick={onClose}>
						<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
					</button>
				</div>

				{/* Lista de Proyectos */}
				<div className="flex-1 overflow-y-auto p-3 space-y-1">
					{projects.length === 0 ? (
						<p className="text-sm text-(--color-muted) p-2 italic select-none">
							No hay proyectos aún.
						</p>
					) : (
						projects.map((project) => (
							<button
								key={project.id}
								onClick={() => setSelectedProjectId(project.id)}
								className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${selectedProjectId === project.id
									? "bg-black/4 dark:bg-white/10 text-foreground font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
									: "text-(--color-muted) font-medium hover:bg-black/3 dark:hover:bg-white/5 hover:text-foreground hover:translate-x-0.5"
									}`}
							>
								{project.name}
							</button>
						))
					)}
				</div>

				{/* Formulario para Nuevo Proyecto */}
				<div className="p-4 border-t border-(--color-border)">
					<form onSubmit={handleSubmit} className="flex flex-col gap-2">
						<label className="text-[10px] font-medium text-(--color-muted) uppercase tracking-wider">
							Nuevo Proyecto
						</label>
						<input
							type="text"
							placeholder="Ej: Rediseño Web..."
							value={newProjectName}
							onChange={(e) => setNewProjectName(e.target.value)}
							className="w-full px-3 py-2 bg-transparent border border-(--color-border) rounded-md text-sm outline-none transition-colors focus:border-(--color-muted) text-foreground"
						/>
					</form>
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
						<span>Ajustes</span>
					</button>
				</div>
			</aside>
			<SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
		</>
	);
}