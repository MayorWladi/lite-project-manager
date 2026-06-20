'use client'

import { useState } from 'react'
import type { Project } from '@/app/types'

interface ActivityFormProps {
  projects: Project[]
  selectedProjectId: number | null
  onSelectProject: (id: number | null) => void
  onAddActivity: (projectId: number, activityName: string) => void
}

export default function ActivityForm({
  projects,
  selectedProjectId,
  onSelectProject,
  onAddActivity,
}: ActivityFormProps) {
  const [activityName, setActivityName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProjectId) {
      // La notificación se maneja en el controlador (padre)
      return
    }
    if (activityName.trim()) {
      onAddActivity(selectedProjectId, activityName.trim())
      setActivityName('')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <h2>Agregar actividad</h2>
      <div>
        <select
          value={selectedProjectId ?? ''}
          onChange={(e) => onSelectProject(e.target.value ? Number(e.target.value) : null)}
          style={{ marginRight: '0.5rem', padding: '0.5rem' }}
        >
          <option value="">Selecciona un proyecto</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Nombre de actividad"
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
          style={{ marginRight: '0.5rem', padding: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          Añadir
        </button>
      </div>
    </form>
  )
}