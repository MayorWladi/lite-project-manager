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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
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