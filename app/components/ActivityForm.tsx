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
    <form onSubmit={handleSubmit} style={{ marginBottom: '4rem' }}>
      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-muted)', marginBottom: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Agregar actividad
      </label>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <select
          value={selectedProjectId ?? ''}
          onChange={(e) => onSelectProject(e.target.value ? Number(e.target.value) : null)}
          style={{
            flex: '0 0 30%',
            padding: '0.75rem 1rem',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
            fontSize: '1rem',
            backgroundColor: 'transparent',
            outline: 'none',
            color: 'var(--foreground)',
            cursor: 'pointer'
          }}
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
          placeholder="Nombre de la actividad..."
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
            fontSize: '1rem',
            backgroundColor: 'transparent',
            transition: 'border-color 0.2s',
            outline: 'none',
            color: 'var(--foreground)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-muted)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--color-border)'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#111111',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background-color 0.2s, transform 0.1s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#333333')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#111111')}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Añadir
        </button>
      </div>
    </form>
  )
}