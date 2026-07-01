// /app/types/index.ts

export type TaskStatus = 'todo' | 'working' | 'review' | 'dropped' | 'done';

export interface Task {
	id: string;
	title: string;
	isCompleted: boolean;
	createdAt: number;
}

export interface Activity {
	id: string;
	name: string;
	description?: string;
	status: TaskStatus;
	tasks: Task[];
	createdAt: number;
}

export interface Sprint {
	id: string;
	name: string;
	activities: Activity[];
	startDate: number;
}

export interface Project {
	id: string;
	name: string;
	sprints: Sprint[];
	createdAt: number;
}