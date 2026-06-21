// /app/context/ProjectContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Project, Sprint, TaskStatus, Task, Activity } from "@/app/types";
import { notifyTaskAdded, notifyTaskCompleted, notifyTaskDeleted } from "@/app/helpers/notifications";

interface ProjectContextType {
	projects: Project[];
	selectedProjectId: string | null;
	setSelectedProjectId: (id: string | null) => void;
	addProject: (name: string) => void;
	renameProject: (projectId: string, newName: string) => void;
	deleteProject: (projectId: string) => void;
	addSprint: (projectId: string, name: string) => void;
	renameSprint: (projectId: string, sprintId: string, newName: string) => void;
	deleteSprint: (projectId: string, sprintId: string) => void;
	addActivity: (projectId: string, sprintId: string, name: string) => void;
	renameActivity: (projectId: string, sprintId: string, activityId: string, newName: string) => void;
	deleteActivity: (projectId: string, sprintId: string, activityId: string) => void;
	updateSprintActivities: (projectId: string, sprintId: string, newActivities: Activity[]) => void;
	addTaskToActivity: (projectId: string, sprintId: string, activityId: string, title: string) => void;
	renameTask: (projectId: string, sprintId: string, activityId: string, taskId: string, newTitle: string) => void;
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
		const mockTasks: Task[] = [
			{ id: `t1-${Date.now()}`, title: "Diseñar wireframes", isCompleted: true, createdAt: Date.now() },
			{ id: `t2-${Date.now()}`, title: "Configurar Next.js", isCompleted: true, createdAt: Date.now() },
			{ id: `t3-${Date.now()}`, title: "Revisar Context API", isCompleted: false, createdAt: Date.now() },
		];

		const mockActivities: Activity[] = [
			{
				id: `act1-${Date.now()}`,
				name: "Configuración Inicial e Interfaz",
				description: "Setup base y diseño inicial",
				status: "todo",
				tasks: mockTasks,
				createdAt: Date.now()
			}
		];

		const newProject: Project = {
			id: Date.now().toString(),
			name,
			sprints: [{ id: `s1-${Date.now()}`, name: "Sprint 1", activities: mockActivities, startDate: Date.now() }],
			createdAt: Date.now(),
		};

		setProjects((prev) => [...prev, newProject]);
		setSelectedProjectId(newProject.id);
	};

	const renameProject = (projectId: string, newName: string) => {
		setProjects(prev => prev.map(p => p.id === projectId ? { ...p, name: newName } : p));
	};

	const deleteProject = (projectId: string) => {
		setProjects(prev => prev.filter(p => p.id !== projectId));
		if (selectedProjectId === projectId) {
			setSelectedProjectId(null);
		}
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
							activities: [],
							startDate: Date.now()
						},
					],
				};
			})
		);
	};

	const renameSprint = (projectId: string, sprintId: string, newName: string) => {
		setProjects(prev => prev.map(p => {
			if (p.id !== projectId) return p;
			return {
				...p,
				sprints: p.sprints.map(s => s.id === sprintId ? { ...s, name: newName } : s)
			};
		}));
	};

	const deleteSprint = (projectId: string, sprintId: string) => {
		setProjects(prev => prev.map(p => {
			if (p.id !== projectId) return p;
			return {
				...p,
				sprints: p.sprints.filter(s => s.id !== sprintId)
			};
		}));
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

	const renameActivity = (projectId: string, sprintId: string, activityId: string, newName: string) => {
		setProjects(prev => prev.map(p => {
			if (p.id !== projectId) return p;
			return {
				...p,
				sprints: p.sprints.map(s => {
					if (s.id !== sprintId) return s;
					return {
						...s,
						activities: (s.activities || []).map(a => a.id === activityId ? { ...a, name: newName } : a)
					};
				})
			};
		}));
	};

	const deleteActivity = (projectId: string, sprintId: string, activityId: string) => {
		setProjects(prev => prev.map(p => {
			if (p.id !== projectId) return p;
			return {
				...p,
				sprints: p.sprints.map(s => {
					if (s.id !== sprintId) return s;
					return {
						...s,
						activities: (s.activities || []).filter(a => a.id !== activityId)
					};
				})
			};
		}));
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
		notifyTaskAdded(title);
	};

	const renameTask = (projectId: string, sprintId: string, activityId: string, taskId: string, newTitle: string) => {
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
								tasks: (act.tasks || []).map(t => t.id === taskId ? { ...t, title: newTitle } : t)
							};
						})
					};
				})
			};
		}));
	};

	const toggleTaskCompletion = (projectId: string, sprintId: string, activityId: string, taskId: string) => {
		let taskName = "";
		let isNowCompleted = false;

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
								tasks: (act.tasks || []).map(t => {
									if (t.id === taskId) {
										taskName = t.title;
										isNowCompleted = !t.isCompleted;
										return { ...t, isCompleted: isNowCompleted };
									}
									return t;
								})
							};
						})
					};
				})
			};
		}));

		if (taskName) {
			notifyTaskCompleted(taskName, isNowCompleted);
		}
	};

	const deleteTask = (projectId: string, sprintId: string, activityId: string, taskId: string) => {
		let deletedTaskName = "";
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
							const task = act.tasks?.find(t => t.id === taskId);
							if (task) deletedTaskName = task.title;
							return {
								...act,
								tasks: (act.tasks || []).filter(t => t.id !== taskId)
							};
						})
					};
				})
			};
		}));

		if (deletedTaskName) {
			notifyTaskDeleted(deletedTaskName);
		}
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
				renameProject,
				deleteProject,
				addSprint,
				renameSprint,
				deleteSprint,
				addActivity,
				renameActivity,
				deleteActivity,
				updateSprintActivities,
				addTaskToActivity,
				renameTask,
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