'use client'

import { useState } from 'react'

interface ProjectFormProps {
  onAddProject: (name: string) => void
}

export default function ProjectForm({ onAddProject }: ProjectFormProps) {
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onAddProject(name.trim())
      setName('')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <h2>Nuevo proyecto</h2>
      <div>
        <input
          type="text"
          placeholder="Nombre del proyecto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: '0.5rem', padding: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          Crear
        </button>
      </div>
    </form>
  )
}