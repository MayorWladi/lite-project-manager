'use client'

import type { Project } from '@/app/types'
import ProjectItem from './ProjectItem'

interface ProjectListProps {
  projects: Project[]
  selectedProjectId: string | null
  onSelectProject: (id: string) => void
  onDeleteProject: (id: string, name: string) => void
  onDeleteActivity: (projectId: string, index: number, activityName: string) => void
}

export default function ProjectList({
  projects,
  selectedProjectId,
  onSelectProject,
  onDeleteProject,
  onDeleteActivity,
}: ProjectListProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
      {projects.map((project) => (
        <ProjectItem
          key={project.id}
          project={project}
          isSelected={project.id === selectedProjectId}
          onSelectProject={onSelectProject}
          onDeleteProject={onDeleteProject}
          onDeleteActivity={onDeleteActivity}
        />
      ))}
    </div>
  )
}