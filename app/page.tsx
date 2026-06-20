'use client'

import { useState } from 'react'
import { sileo } from 'sileo'
import { ProjectProvider, useProjects } from '@/app/context/ProjectContext'
import ProjectForm from '@/app/components/ProjectForm'
import ActivityForm from '@/app/components/ActivityForm'
import ProjectList from '@/app/components/ProjectList'
import AsyncButton from '@/app/components/AsyncButton'

function HomeContent() {
  const { projects, addProject, deleteProject, addActivity, deleteActivity } = useProjects()
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)

  // Handlers con notificaciones
  const handleAddProject = (name: string) => {
    const project = addProject(name)
    sileo.success({ title: 'Proyecto creado', description: `"${project.name}" agregado.` })
  }

  const handleDeleteProject = (id: number, name: string) => {
    sileo.action({
      title: `¿Eliminar "${name}"?`,
      description: 'Esta acción no se puede deshacer.',
      button: {
        title: 'Eliminar',
        onClick: () => {
          deleteProject(id)
          sileo.error({ title: 'Eliminado', description: `Proyecto "${name}" eliminado.` })
        },
      },
    })
  }

  const handleAddActivity = (projectId: number, activityName: string) => {
    const project = addActivity(projectId, activityName)
    if (project) {
      sileo.success({ title: 'Actividad agregada', description: `"${activityName}" añadida a "${project.name}".` })
    }
  }

  const handleDeleteActivity = (projectId: number, index: number, activityName: string) => {
    deleteActivity(projectId, index)
    sileo.info({ title: 'Actividad eliminada', description: `"${activityName}" removida.` })
  }

  const handleAsyncTask = () => {
    const promise = new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.3) {
          resolve('Tarea completada con éxito')
        } else {
          reject(new Error('Algo salió mal'))
        }
      }, 2000)
    })

    sileo.promise(promise, {
      loading: { title: 'Procesando...', description: 'Espera un momento.' },
      success: (data) => ({ title: '¡Éxito!', description: data }),
      error: (err) => ({ title: 'Error', description: err instanceof Error ? err.message : 'Error desconocido' }),
    })
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>📋 Gestor de Proyectos</h1>

      <ProjectForm onAddProject={handleAddProject} />

      <ActivityForm
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        onAddActivity={handleAddActivity}
      />

      <ProjectList
        projects={projects}
        onDeleteProject={handleDeleteProject}
        onDeleteActivity={handleDeleteActivity}
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