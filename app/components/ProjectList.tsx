'use client'

import type { Project } from '@/app/types'
import ProjectItem from './ProjectItem'

interface ProjectListProps {
  projects: Project[]
  onDeleteProject: (id: number, name: string) => void
  onDeleteActivity: (projectId: number, index: number, activityName: string) => void
}

export default function ProjectList({
  projects,
  onDeleteProject,
  onDeleteActivity,
}: ProjectListProps) {
  return (
    <div>
      {projects.map((project) => (
        <ProjectItem
          key={project.id}
          project={project}
          onDeleteProject={onDeleteProject}
          onDeleteActivity={onDeleteActivity}
        />
      ))}
    </div>
  )
}