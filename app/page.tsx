'use client'

import { useState } from 'react'
import { ProjectProvider, useProjects } from '@/app/context/ProjectContext'
import type { Project } from '@/app/types'
import { handleAddProject, handleDeleteProject } from './controller/projectController'
import { handleAddActivity, handleDeleteActivity, handleAsyncTask } from './controller/activityController'

function HomeContent() {
  const { projects, addProject, deleteProject, addActivity, deleteActivity } = useProjects()
  const [newProjectName, setNewProjectName] = useState('')
  const [newActivityName, setNewActivityName] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)

  // Wrappers para pasar los parámetros necesarios a los controladores
  const onAddProject = () => {
    handleAddProject(newProjectName, addProject, setNewProjectName)
  }

  const onDeleteProject = (id: number, name: string) => {
    handleDeleteProject(id, name, deleteProject)
  }

  const onAddActivity = () => {
    handleAddActivity(selectedProjectId, newActivityName, addActivity, setNewActivityName)
  }

  const onDeleteActivity = (projectId: number, index: number, activityName: string) => {
    handleDeleteActivity(projectId, index, activityName, deleteActivity)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>📋 Gestor de Proyectos</h1>

      {/* Sección agregar proyecto */}
      <div style={{ marginBottom: '2rem' }}>
        <h2>Nuevo proyecto</h2>
        <input
          type="text"
          placeholder="Nombre del proyecto"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          style={{ marginRight: '0.5rem', padding: '0.5rem' }}
        />
        <button onClick={onAddProject} style={{ padding: '0.5rem 1rem' }}>
          Crear
        </button>
      </div>

      {/* Sección agregar actividad */}
      <div style={{ marginBottom: '2rem' }}>
        <h2>Agregar actividad</h2>
        <select
          value={selectedProjectId ?? ''}
          onChange={(e) => setSelectedProjectId(e.target.value ? Number(e.target.value) : null)}
          style={{ marginRight: '0.5rem', padding: '0.5rem' }}
        >
          <option value="">Selecciona un proyecto</option>
          {projects.map((p: Project) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Nombre de actividad"
          value={newActivityName}
          onChange={(e) => setNewActivityName(e.target.value)}
          style={{ marginRight: '0.5rem', padding: '0.5rem' }}
        />
        <button onClick={onAddActivity} style={{ padding: '0.5rem 1rem' }}>
          Añadir
        </button>
      </div>

      {/* Lista de proyectos */}
      <div>
        {projects.map((project: Project) => (
          <div
            key={project.id}
            style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>{project.name}</h3>
              <button
                onClick={() => onDeleteProject(project.id, project.name)}
                style={{ background: 'red', color: 'white', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '4px' }}
              >
                Eliminar proyecto
              </button>
            </div>
            <ul>
              {project.activities.map((act: string, idx: number) => (
                <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{act}</span>
                  <button
                    onClick={() => onDeleteActivity(project.id, idx, act)}
                    style={{ background: '#ff6b6b', color: 'white', border: 'none', padding: '0.2rem 0.6rem', borderRadius: '4px' }}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Botón para probar promesas */}
      <div style={{ marginTop: '2rem' }}>
        <button onClick={handleAsyncTask} style={{ padding: '0.5rem 1rem' }}>
          Simular tarea asíncrona
        </button>
      </div>
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