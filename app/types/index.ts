export interface ProjectContextType {
	projects: Project[]
	addProject: (name: string) => Project
	deleteProject: (id: number) => void
	addActivity: (projectId: number, activityName: string) => Project | undefined
	deleteActivity: (projectId: number, index: number) => void
}

// /app/types/index.ts

export type TaskStatus = 'todo' | 'working' | 'review' | 'dropped' | 'done';

export interface Task {
	id: string;
	title: string;
	description: string;
	status: TaskStatus;
	createdAt: number;
}

export interface Sprint {
	id: string;
	name: string;
	tasks: Task[];
	startDate: number;
}

export interface Project {
	id: string;
	name: string;
	sprints: Sprint[];
	createdAt: number;
}