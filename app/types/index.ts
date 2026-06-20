export interface Project {
	id: number
	name: string
	activities: string[]
}

export interface ProjectContextType {
	projects: Project[]
	addProject: (name: string) => Project
	deleteProject: (id: number) => void
	addActivity: (projectId: number, activityName: string) => Project | undefined
	deleteActivity: (projectId: number, index: number) => void
}