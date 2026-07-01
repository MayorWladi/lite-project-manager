// /app/components/ProjectItem.tsx
'use client'

import { useState } from 'react'
import type { Project } from "@/app/common/types"
import DropdownMenu from "@/app/common/components/DropdownMenu"
import { useProjectsManager } from "@/app/common/context/ProjectContext"
import { useLanguage } from "@/app/common/context/LanguageContext"

interface ProjectItemProps {
  project: Project
  isSelected: boolean
  onSelectProject: (id: string) => void
  onDeleteProject: (id: string, name: string) => void
}

export default function ProjectItem({
  project,
  isSelected,
  onSelectProject,
  onDeleteProject,
}: ProjectItemProps) {
  const { renameProject } = useProjectsManager();
  const { t } = useLanguage();
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(project.name);

  const handleRenameSubmit = () => {
    if (renameValue.trim() && renameValue.trim() !== project.name) {
      renameProject(project.id, renameValue.trim());
    } else {
      setRenameValue(project.name);
    }
    setIsRenaming(false);
  };

  return (
    <div 
      onClick={() => {
        if (!isRenaming) {
          onSelectProject(project.id);
        }
      }}
      className={`group w-full text-left px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center justify-between cursor-pointer ${isSelected
      ? "bg-black/5 dark:bg-white/10 text-foreground font-medium"
      : "text-(--color-muted) hover:bg-black/3 dark:hover:bg-white/5 hover:text-foreground"
      }`}>

      {isRenaming ? (
        <form onSubmit={(e) => { e.preventDefault(); handleRenameSubmit(); }} className="flex-1">
          <input
            autoFocus
            type="text"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={(e) => { if (e.key === 'Escape') setIsRenaming(false); }}
            onClick={(e) => e.stopPropagation()}
            className="w-full px-1.5 py-0.5 bg-transparent border border-(--color-border) rounded text-sm outline-none focus:border-(--color-muted) text-foreground"
          />
        </form>
      ) : (
        <>
          <div
            className="flex-1 truncate text-sm select-none"
            onDoubleClick={(e) => { e.stopPropagation(); setIsRenaming(true); }}
          >
            {project.name}
          </div>

          <DropdownMenu
            items={[
              { label: t("rename"), onClick: () => setIsRenaming(true) },
              { label: t("delete_item"), onClick: () => onDeleteProject(project.id, project.name), isDanger: true }
            ]}
            triggerClassName={`
              ${isSelected ? 'opacity-100' : 'opacity-0'} 
              group-hover:opacity-100 p-1 rounded hover:bg-black/5
              dark:hover:bg-white/10 transition-opacity
              text-(--color-muted) hover:text-foreground
              cursor-pointer
            `}
          />
        </>
      )}
    </div>
  )
}