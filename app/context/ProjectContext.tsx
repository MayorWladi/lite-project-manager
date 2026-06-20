// /app/context/ProjectContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Project, TaskStatus, Task } from "@/app/types";

interface ProjectContextType {
	projects: Project[];
	selectedProjectId: string | null;
	setSelectedProjectId: (id: string | null) => void;
	addProject: (name: string) => void;
	moveTask: (projectId: string, sprintId: string, taskId: string, newStatus: TaskStatus) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
	const [projects, setProjects] = useState<Project[]>([]);
	const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
	const [isHydrated, setIsHydrated] = useState(false);

	// 1. Cargar desde localStorage al montar el componente (Hidratación)
	useEffect(() => {
		const savedProjects = localStorage.getItem("kanban-projects");
		const savedSelectedId = localStorage.getItem("kanban-selected-id");

		if (savedProjects) {
			try {
				setProjects(JSON.parse(savedProjects));
			} catch (error) {
				console.error("Error al parsear proyectos desde localStorage", error);
			}
		}

		if (savedSelectedId) {
			setSelectedProjectId(savedSelectedId);
		}

		setIsHydrated(true);
	}, []);

	// 2. Guardar en localStorage cada vez que el estado de 'projects' cambie
	useEffect(() => {
		if (isHydrated) {
			localStorage.setItem("kanban-projects", JSON.stringify(projects));
		}
	}, [projects, isHydrated]);

	// 3. Persistir el proyecto seleccionado
	useEffect(() => {
		if (isHydrated) {
			if (selectedProjectId) {
				localStorage.setItem("kanban-selected-id", selectedProjectId);
			} else {
				localStorage.removeItem("kanban-selected-id");
			}
		}
	}, [selectedProjectId, isHydrated]);

	const addProject = (name: string) => {
		const newProject: Project = {
			id: Date.now().toString(),
			name,
			// Creamos un Sprint vacío. Si prefieres mantener las tareas de prueba de la Fase 3, puedes inyectarlas aquí.
			sprints: [{ id: `s1-${Date.now()}`, name: "Sprint 1", tasks: [], startDate: Date.now() }],
			createdAt: Date.now(),
		};

		setProjects((prev) => [...prev, newProject]);
		setSelectedProjectId(newProject.id);
	};

	const moveTask = (projectId: string, sprintId: string, taskId: string, newStatus: TaskStatus) => {
		setProjects((prevProjects) =>
			prevProjects.map((project) => {
				if (project.id !== projectId) return project;
				return {
					...project,
					sprints: project.sprints.map((sprint) => {
						if (sprint.id !== sprintId) return sprint;
						return {
							...sprint,
							tasks: sprint.tasks.map((task) => {
								if (task.id !== taskId) return task;
								return { ...task, status: newStatus };
							}),
						};
					}),
				};
			})
		);
	};

	// Previene el renderizado del árbol de componentes hasta que localStorage haya sido leído
	// Esto elimina el parpadeo y los errores de hidratación en Next.js
	if (!isHydrated) {
		return null;
	}

	return (
		<ProjectContext.Provider
			value={{
				projects,
				selectedProjectId,
				setSelectedProjectId,
				addProject,
				moveTask,
			}}
		>
			{children}
		</ProjectContext.Provider>
	);
}

export function useProjectsManager() {
	const context = useContext(ProjectContext);
	if (context === undefined) {
		throw new Error("useProjectsManager debe ser utilizado dentro de un ProjectProvider");
	}
	return context;
}