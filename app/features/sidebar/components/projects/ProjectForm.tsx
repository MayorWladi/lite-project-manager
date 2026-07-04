'use client'

import { useState } from 'react'
import { useLanguage } from '@/app/common/context/LanguageContext'
import { Input } from "@/app/common/components/Input"
import { Button } from "@/app/common/components/Button"
import { Label } from "@/app/common/components/Label"

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
      <Label htmlFor="projectName" className="mb-2">
        {t("new_project")}
      </Label>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Input
          id="projectName"
          type="text"
          placeholder={t("type_name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-4 py-3 text-base shadow-sm"
          autoFocus
        />
        <Button
          type="submit"
          variant="primary"
          className="shrink-0 font-bold px-6"
        >
          {t("add_action")}
        </Button>
      </div>
    </form>
  )
}