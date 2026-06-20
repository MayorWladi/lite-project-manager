'use client'

import type { Project } from '@/app/types'

interface ProjectItemProps {
  project: Project
  isSelected: boolean
  onSelectProject: (id: string) => void
  onDeleteProject: (id: string, name: string) => void
  onDeleteActivity: (projectId: string, index: number, activityName: string) => void
}

export default function ProjectItem({
  project,
  onSelectProject,
  isSelected,
  onDeleteProject,
  onDeleteActivity,
}: ProjectItemProps) {
  return (
    <div
      style={{
        border: '1px solid var(--color-border)',
        padding: '24px',
        marginBottom: '2rem',
        borderRadius: '12px',
        backgroundColor: 'var(--background)',
        transition: 'box-shadow 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0, color: 'var(--foreground)' }}>{project.name}</h3>
        <button
          onClick={() => onDeleteProject(project.id, project.name)}
          style={{
            backgroundColor: '#FDEBEC',
            color: '#9F2F2D',
            border: 'none',
            padding: '0.4rem 0.8rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fcd5d7')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FDEBEC')}
        >
          Eliminar
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {project.sprints.map((sprint) =>
          (sprint.activities || []).map((act, idx) => (
            <li
              key={act.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 0',
                borderBottom: idx === (sprint.activities || []).length - 1 ? 'none' : '1px solid var(--color-border)'
              }}
            >
              <span style={{ color: 'var(--color-muted)', fontSize: '0.95rem' }}>{act.name}</span>
              <button
                onClick={() => onDeleteActivity(project.id, idx, act.name)}
                style={{
                  background: 'transparent',
                  color: '#9F2F2D',
                  border: 'none',
                  padding: '0.2rem',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
                title="Eliminar actividad"
              >
                ✕
              </button>
            </li>
          )))}
        {project.sprints.every(sprint => (sprint.activities || []).length === 0) && (
          <li style={{ color: 'var(--color-muted)', fontSize: '0.9rem', fontStyle: 'italic', padding: '0.75rem 0' }}>No hay actividades</li>
        )}
      </ul>
    </div>
  )
}