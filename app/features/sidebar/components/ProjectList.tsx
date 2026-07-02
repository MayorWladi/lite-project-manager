// /app/components/ProjectList.tsx
'use client'

import type { Project } from "@/app/common/types"
import ProjectItem from "@/app/features/sidebar/components/ProjectItem"

interface ProjectListProps {
  projects: Project[]
  selectedProjectId: string | null
  onSelectProject: (id: string) => void
  onDeleteProject: (id: string, name: string) => void
}

export default function ProjectList({
  projects,
  selectedProjectId,
  onSelectProject,
  onDeleteProject,
}: ProjectListProps) {
  return (
    // Usamos flex-col con un gap pequeño para una lista compacta en el sidebar
    <div className="flex flex-col gap-1 mt-2 overflow-y-auto overflow-x-hidden">
      {projects.map((project) => (
        <ProjectItem
          key={project.id}
          project={project}
          isSelected={project.id === selectedProjectId}
          onSelectProject={onSelectProject}
          onDeleteProject={onDeleteProject}
        />
      ))}
    </div>
  )
}