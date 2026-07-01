'use client'

import { useState } from 'react'
import { useLanguage } from '@/app/common/context/LanguageContext'

interface ProjectFormProps {
  onAddProject: (name: string) => void
}

export default function ProjectForm({ onAddProject }: ProjectFormProps) {
  const [name, setName] = useState('')
  const { t } = useLanguage()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onAddProject(name.trim())
      setName('')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '3rem' }}>
      <label htmlFor="projectName" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-muted)', marginBottom: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {t("new_project")}
      </label>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <input
          id="projectName"
          type="text"
          placeholder={t("type_name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          {t("create")}
        </button>
      </div>
    </form>
  )
}