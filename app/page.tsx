'use client'

import { useState } from 'react'
import { ProjectProvider, useProjects } from '@/app/context/ProjectContext'
import ProjectForm from '@/app/components/ProjectForm'
import ActivityForm from '@/app/components/ActivityForm'
import ProjectList from '@/app/components/ProjectList'
import AsyncButton from '@/app/components/AsyncButton'
import { handleAddProject, handleDeleteProject } from './controller/projectController'
import { handleAddActivity, handleDeleteActivity, handleAsyncTask } from './controller/activityController'

function HomeContent() {
  const { projects, addProject, deleteProject, addActivity, deleteActivity } = useProjects()
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)

  // Wrappers simples que llaman a los controladores con los parámetros necesarios
  const onAddProject = (name: string) => {
    handleAddProject(name, addProject)
  }

  const onDeleteProject = (id: number, name: string) => {
    handleDeleteProject(id, name, deleteProject)
  }

  const onAddActivity = (projectId: number, activityName: string) => {
    handleAddActivity(selectedProjectId, activityName, addActivity)
  }

  const onDeleteActivity = (projectId: number, index: number, activityName: string) => {
    handleDeleteActivity(projectId, index, activityName, deleteActivity)
  }

  return (
    <div className="animate-scroll-entry" style={{ padding: '6rem 2rem', maxWidth: '56rem', margin: '0 auto' }}>
      <h1 className="font-editorial" style={{ fontSize: '3rem', fontWeight: 400, color: 'var(--foreground)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '3rem' }}>
        Gestor de Proyectos
      </h1>

      <ProjectForm onAddProject={onAddProject} />

      <ActivityForm
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        onAddActivity={onAddActivity}
      />

      <ProjectList
        projects={projects}
        onDeleteProject={onDeleteProject}
        onDeleteActivity={onDeleteActivity}
      />

      <AsyncButton onAsyncTask={handleAsyncTask} />
    </div>
  )
}

export default function Home() {
  return (
    <ProjectProvider>
      <HomeContent />
    </ProjectProvider>
  )
}