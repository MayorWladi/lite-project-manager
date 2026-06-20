'use client'

import type { Project } from '@/app/types'

interface ProjectItemProps {
  project: Project
  onDeleteProject: (id: number, name: string) => void
  onDeleteActivity: (projectId: number, index: number, activityName: string) => void
}

export default function ProjectItem({
  project,
  onDeleteProject,
  onDeleteActivity,
}: ProjectItemProps) {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '1rem',
        marginBottom: '1rem',
        borderRadius: '8px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>{project.name}</h3>
        <button
          onClick={() => onDeleteProject(project.id, project.name)}
          style={{
            background: 'red',
            color: 'white',
            border: 'none',
            padding: '0.3rem 0.8rem',
            borderRadius: '4px',
          }}
        >
          Eliminar proyecto
        </button>
      </div>
      <ul>
        {project.activities.map((act, idx) => (
          <li
            key={idx}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>{act}</span>
            <button
              onClick={() => onDeleteActivity(project.id, idx, act)}
              style={{
                background: '#ff6b6b',
                color: 'white',
                border: 'none',
                padding: '0.2rem 0.6rem',
                borderRadius: '4px',
              }}
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}