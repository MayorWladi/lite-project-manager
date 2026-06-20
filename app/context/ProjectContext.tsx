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
	updateSprintActivities: (projectId: string, sprintId: string, newActivities: Activity[]) => void;
	addTaskToActivity: (projectId: string, sprintId: string, activityId: string, title: string) => void;
	toggleTaskCompletion: (projectId: string, sprintId: string, activityId: string, taskId: string) => void;
	deleteTask: (projectId: string, sprintId: string, activityId: string, taskId: string) => void;
	useSprintMetrics: (sprint: Sprint | null | undefined) => { total: number; done: number; percentage: number };
	getActivityMetrics: (activity: Activity) => { total: number; done: number };
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
			{ id: `t1-${Date.now()}`, title: "Diseñar wireframes", isCompleted: true, createdAt: Date.now() },
			{ id: `t2-${Date.now()}`, title: "Configurar Next.js", isCompleted: true, createdAt: Date.now() },
			{ id: `t3-${Date.now()}`, title: "Revisar Context API", isCompleted: false, createdAt: Date.now() },
		];

		// 2. Agruparlas en una Actividad de prueba
		const mockActivities: Activity[] = [
			{
				id: `act1-${Date.now()}`,
				name: "Configuración Inicial e Interfaz",
				description: "Setup base y diseño inicial",
				status: "working",
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
								...(sprint.activities || []),
								{ id: `act-${Date.now()}`, name, status: 'todo', tasks: [], createdAt: Date.now() },
							],
						};
					}),
				};
			})
		);
	};

	const updateSprintActivities = (projectId: string, sprintId: string, newActivities: Activity[]) => {
		setProjects((prevProjects) =>
			prevProjects.map((project) => {
				if (project.id !== projectId) return project;
				return {
					...project,
					sprints: project.sprints.map((sprint) => {
						if (sprint.id !== sprintId) return sprint;
						return { ...sprint, activities: newActivities };
					}),
				};
			})
		);
	};

	const addTaskToActivity = (projectId: string, sprintId: string, activityId: string, title: string) => {
		setProjects(prev => prev.map(project => {
			if (project.id !== projectId) return project;
			return {
				...project,
				sprints: project.sprints.map(sprint => {
					if (sprint.id !== sprintId) return sprint;
					return {
						...sprint,
						activities: (sprint.activities || []).map(act => {
							if (act.id !== activityId) return act;
							return {
								...act,
								tasks: [...(act.tasks || []), { id: `task-${Date.now()}`, title, isCompleted: false, createdAt: Date.now() }]
							};
						})
					};
				})
			};
		}));
	};

	const toggleTaskCompletion = (projectId: string, sprintId: string, activityId: string, taskId: string) => {
		setProjects(prev => prev.map(project => {
			if (project.id !== projectId) return project;
			return {
				...project,
				sprints: project.sprints.map(sprint => {
					if (sprint.id !== sprintId) return sprint;
					return {
						...sprint,
						activities: (sprint.activities || []).map(act => {
							if (act.id !== activityId) return act;
							return {
								...act,
								tasks: (act.tasks || []).map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t)
							};
						})
					};
				})
			};
		}));
	};

	const deleteTask = (projectId: string, sprintId: string, activityId: string, taskId: string) => {
		setProjects(prev => prev.map(project => {
			if (project.id !== projectId) return project;
			return {
				...project,
				sprints: project.sprints.map(sprint => {
					if (sprint.id !== sprintId) return sprint;
					return {
						...sprint,
						activities: (sprint.activities || []).map(act => {
							if (act.id !== activityId) return act;
							return {
								...act,
								tasks: (act.tasks || []).filter(t => t.id !== taskId)
							};
						})
					};
				})
			};
		}));
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
				updateSprintActivities,
				addTaskToActivity,
				toggleTaskCompletion,
				deleteTask,
				useSprintMetrics,
				getActivityMetrics,
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

export function useSprintMetrics(sprint: Sprint | null | undefined) {
	if (!sprint || !sprint.activities) return { total: 0, done: 0, percentage: 0 };

	const total = sprint.activities.length;
	const done = sprint.activities.filter(act => act.status === 'done').length;

	const percentage = total === 0 ? 0 : Math.round((done / total) * 100);
	return { total, done, percentage };
}

export function getActivityMetrics(activity: Activity) {
	const total = activity.tasks ? activity.tasks.length : 0;
	const done = activity.tasks ? activity.tasks.filter(t => t.isCompleted).length : 0;
	return { total, done };
}