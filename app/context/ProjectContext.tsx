// /app/context/ProjectContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Project, Task, TaskStatus } from "@/app/types";

interface ProjectContextType {
	projects: Project[];
	selectedProjectId: string | null;
	setSelectedProjectId: (id: string | null) => void;
	addProject: (name: string) => void;
	addSprint: (projectId: string, name: string) => void;
	addTask: (projectId: string, sprintId: string, title: string, description: string) => void;
	moveTask: (projectId: string, sprintId: string, taskId: string, newStatus: TaskStatus) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
	// Estado inicial vacío, preparado para ser hidratado desde localStorage en la Fase 5
	const [projects, setProjects] = useState<Project[]>([]);
	const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

	// Lógica funcional temporal para ver los cambios en la UI
	const addProject = (name: string) => {
		// Tareas de prueba para visualizar el KanbanBoard
		const mockTasks: Task[] = [
			{ id: `t1-${Date.now()}`, title: "Diseñar wireframes", description: "Esbozos en papel de la arquitectura", status: "todo", createdAt: Date.now() },
			{ id: `t2-${Date.now()}`, title: "Configurar Next.js", description: "Setup base con Tailwind y tipografías", status: "working", createdAt: Date.now() },
			{ id: `t3-${Date.now()}`, title: "Revisar Context API", description: "Asegurar que el estado no re-renderice todo", status: "review", createdAt: Date.now() },
			{ id: `t4-${Date.now()}`, title: "Prueba técnica inicial", description: "Subir a Vercel el MVP", status: "done", createdAt: Date.now() },
		];

		const newProject: Project = {
			id: Date.now().toString(),
			name,
			// Creamos un Sprint por defecto con las tareas de prueba
			sprints: [{ id: `s1-${Date.now()}`, name: "Sprint 1", tasks: mockTasks, startDate: Date.now() }],
			createdAt: Date.now(),
		};

		setProjects([...projects, newProject]);
		setSelectedProjectId(newProject.id);
	};

	const addSprint = (projectId: string, name: string) => {
		// TODO: Implementar lógica de agregar sprint
	};

	const addTask = (projectId: string, sprintId: string, title: string, description: string) => {
		// TODO: Implementar lógica de agregar tarea
	};

	const moveTask = (projectId: string, sprintId: string, taskId: string, newStatus: TaskStatus) => {
		// TODO: Implementar lógica de drag and drop para cambiar estado
	};

	return (
		<ProjectContext.Provider
			value={{
				projects,
				selectedProjectId,
				setSelectedProjectId,
				addProject,
				addSprint,
				addTask,
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