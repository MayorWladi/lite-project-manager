'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import type { Project, ProjectContextType } from '@/app/types'

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: ReactNode }) {
	const [projects, setProjects] = useState<Project[]>([
		{ id: 1, name: 'Diseño Web', activities: ['Crear wireframes', 'Diseñar UI'] },
		{ id: 2, name: 'Desarrollo Backend', activities: ['Configurar API', 'Implementar autenticación'] },
	])

	const addProject = (name: string): Project => {
		const newProject: Project = { id: Date.now(), name, activities: [] }
		setProjects((prev: Project[]) => [...prev, newProject])
		return newProject
	}

	const deleteProject = (id: number) => {
		setProjects((prev: Project[]) => prev.filter((p) => p.id !== id))
	}

	const addActivity = (projectId: number, activityName: string): Project | undefined => {
		let updatedProject: Project | undefined
		setProjects((prev) =>
			prev.map((p: Project) => {
				if (p.id === projectId) {
					const updated: Project = { ...p, activities: [...p.activities, activityName] }
					updatedProject = updated
					return updated
				}
				return p
			})
		)
		return updatedProject
	}

	const deleteActivity = (projectId: number, index: number) => {
		setProjects((prev) =>
			prev.map((p: Project) => {
				if (p.id === projectId) {
					const newActivities = p.activities.filter((_: string, i: number) => i !== index)
					return { ...p, activities: newActivities }
				}
				return p
			})
		)
	}

	const value: ProjectContextType = {
		projects,
		addProject,
		deleteProject,
		addActivity,
		deleteActivity,
	}

	return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}

export function useProjects(): ProjectContextType {
	const context = useContext(ProjectContext)
	if (context === undefined) {
		throw new Error('useProjects must be used within a ProjectProvider')
	}
	return context
}