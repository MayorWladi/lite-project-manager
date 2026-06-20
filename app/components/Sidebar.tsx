// /app/components/Sidebar.tsx
"use client";

import { useState } from "react";
import { useProjectsManager } from "@/app/context/ProjectContext";

export default function Sidebar() {
	const { projects, selectedProjectId, setSelectedProjectId, addProject } = useProjectsManager();
	const [newProjectName, setNewProjectName] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (newProjectName.trim()) {
			addProject(newProjectName.trim());
			setNewProjectName("");
		}
	};

	return (
		<aside className="w-64 border-r border-[var(--color-border)] bg-[var(--background)] flex flex-col h-full shrink-0">
			{/* Cabecera del Sidebar */}
			<div className="p-5 border-b border-[var(--color-border)]">
				<h2 className="font-editorial text-xl font-medium tracking-tight">Proyectos</h2>
			</div>

			{/* Lista de Proyectos */}
			<div className="flex-1 overflow-y-auto p-3 space-y-1">
				{projects.length === 0 ? (
					<p className="text-sm text-[var(--color-muted)] p-2 italic select-none">
						No hay proyectos aún.
					</p>
				) : (
					projects.map((project) => (
						<button
							key={project.id}
							onClick={() => setSelectedProjectId(project.id)}
							className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedProjectId === project.id
								? "bg-black/5 dark:bg-white/10 text-[var(--foreground)]"
								: "text-[var(--color-muted)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--foreground)]"
								}`}
						>
							{project.name}
						</button>
					))
				)}
			</div>

			{/* Formulario para Nuevo Proyecto */}
			<div className="p-4 border-t border-[var(--color-border)]">
				<form onSubmit={handleSubmit} className="flex flex-col gap-2">
					<label className="text-[10px] font-medium text-[var(--color-muted)] uppercase tracking-wider">
						Nuevo Proyecto
					</label>
					<input
						type="text"
						placeholder="Ej: Rediseño Web..."
						value={newProjectName}
						onChange={(e) => setNewProjectName(e.target.value)}
						className="w-full px-3 py-2 bg-transparent border border-[var(--color-border)] rounded-md text-sm outline-none transition-colors focus:border-[var(--color-muted)] text-[var(--foreground)]"
					/>
				</form>
			</div>
		</aside>
	);
}