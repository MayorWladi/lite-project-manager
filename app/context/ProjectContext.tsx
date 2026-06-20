// /app/context/ProjectContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Project, Sprint, TaskStatus, Task, Activity } from "@/app/types";

interface ProjectContextType {
	projects: Project[];
	selectedProjectId: string | null;
	setSelectedProjectId: (id: string | null) => void;
	addProject: (name: string) => void;
	addSprint: (projectId: string, name: string) => void;
	addActivity: (projectId: string, sprintId: string, name: string) => void;
	addTaskToActivity: (projectId: string, sprintId: string, activityId: string, title: string, description: string) => void;
	moveTask: (projectId: string, sprintId: string, activityId: string, taskId: string, newStatus: TaskStatus) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
	const [projects, setProjects] = useState<Project[]>([]);
	const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
	const [isHydrated, setIsHydrated] = useState(false);

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

	useEffect(() => {
		if (isHydrated) {
			localStorage.setItem("kanban-projects", JSON.stringify(projects));
		}
	}, [projects, isHydrated]);

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
		// 1. Crear Tareas de prueba
		const mockTasks: Task[] = [
			{ id: `t1-${Date.now()}`, title: "Diseñar wireframes", description: "Esbozos en papel de la arquitectura", status: "todo", createdAt: Date.now() },
			{ id: `t2-${Date.now()}`, title: "Configurar Next.js", description: "Setup base con Tailwind y tipografías", status: "working", createdAt: Date.now() },
			{ id: `t3-${Date.now()}`, title: "Revisar Context API", description: "Asegurar que el estado no re-renderice todo", status: "review", createdAt: Date.now() },
			{ id: `t4-${Date.now()}`, title: "Prueba técnica inicial", description: "Subir a Vercel el MVP", status: "done", createdAt: Date.now() },
		];

		// 2. Agruparlas en una Actividad de prueba
		const mockActivities: Activity[] = [
			{
				id: `act1-${Date.now()}`,
				name: "Configuración Inicial e Interfaz",
				tasks: mockTasks,
				createdAt: Date.now()
			}
		];

		// 3. Crear el Proyecto con el Sprint y la Actividad anidada
		const newProject: Project = {
			id: Date.now().toString(),
			name,
			sprints: [{ id: `s1-${Date.now()}`, name: "Sprint 1", activities: mockActivities, startDate: Date.now() }],
			createdAt: Date.now(),
		};

		setProjects((prev) => [...prev, newProject]);
		setSelectedProjectId(newProject.id);
	};

	const addSprint = (projectId: string, name: string) => {
		setProjects((prevProjects) =>
			prevProjects.map((project) => {
				if (project.id !== projectId) return project;
				return {
					...project,
					sprints: [
						...project.sprints,
						{
							id: `s-${Date.now()}`,
							name,
							activities: [], // Inicializa sin actividades
							startDate: Date.now()
						},
					],
				};
			})
		);
	};

	const addActivity = (projectId: string, sprintId: string, name: string) => {
		setProjects((prev) =>
			prev.map((project) => {
				if (project.id !== projectId) return project;
				return {
					...project,
					sprints: project.sprints.map((sprint) => {
						if (sprint.id !== sprintId) return sprint;
						return {
							...sprint,
							activities: [
								...sprint.activities,
								{ id: `act-${Date.now()}`, name, tasks: [], createdAt: Date.now() },
							],
						};
					}),
				};
			})
		);
	};

	const addTaskToActivity = (projectId: string, sprintId: string, activityId: string, title: string, description: string) => {
		// TODO: Implementar lógica de agregar tarea a una actividad específica
	};

	// Ahora recibe sourceActivityId y targetActivityId
	const moveTask = (
		projectId: string,
		sprintId: string,
		sourceActivityId: string,
		targetActivityId: string,
		taskId: string,
		newStatus: TaskStatus
	) => {
		setProjects((prevProjects) =>
			prevProjects.map((project) => {
				if (project.id !== projectId) return project;
				return {
					...project,
					sprints: project.sprints.map((sprint) => {
						if (sprint.id !== sprintId) return sprint;

						let taskToMove: Task | undefined;

						// 1. Encontrar y extraer la tarea de la actividad original
						const activitiesAfterRemoval = sprint.activities.map((act) => {
							if (act.id === sourceActivityId) {
								taskToMove = act.tasks.find((t) => t.id === taskId);
								return { ...act, tasks: act.tasks.filter((t) => t.id !== taskId) };
							}
							return act;
						});

						if (!taskToMove) return sprint; // Si no existe, no hacemos nada

						// Actualizamos su estado
						const updatedTask = { ...taskToMove, status: newStatus };

						// 2. Inyectar la tarea en la actividad destino
						const finalActivities = activitiesAfterRemoval.map((act) => {
							if (act.id === targetActivityId) {
								return { ...act, tasks: [...act.tasks, updatedTask] };
							}
							return act;
						});

						return { ...sprint, activities: finalActivities };
					}),
				};
			})
		);
	};

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
				addSprint,
				addActivity,
				addTaskToActivity,
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