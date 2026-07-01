// /app/components/SprintTab.tsx
"use client";

import { useState, useCallback } from "react";
import { Sprint } from "@/app/common/types";
import { useDoubleTapById } from "@/app/common/hooks/useDoubleTap";
import DropdownMenu from "@/app/common/components/DropdownMenu";

interface SprintTabProps {
  sprint: Sprint;
  isActive: boolean;
  onSelect: () => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  t: (key: string) => string;
}

export default function SprintTab({ sprint, isActive, onSelect, onRename, onDelete, t }: SprintTabProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(sprint.name);

  const handleDoubleTap = useDoubleTapById(useCallback(() => {
    setIsRenaming(true);
    setRenameValue(sprint.name);
  }, [sprint.name]));

  const handleRenameSubmit = () => {
    const trimmed = renameValue.trim();
    if (trimmed && trimmed !== sprint.name) {
      onRename(sprint.id, trimmed);
    } else {
      setRenameValue(sprint.name);
    }
    setIsRenaming(false);
  };

  if (isRenaming) {
    return (
      <form onSubmit={(e) => { e.preventDefault(); handleRenameSubmit(); }} className="shrink-0 flex items-center">
        <input
          autoFocus
          type="text"
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onBlur={handleRenameSubmit}
          onKeyDown={(e) => { if (e.key === 'Escape') setIsRenaming(false); }}
          className="px-3 py-1.5 bg-transparent border border-(--color-border) rounded-md text-sm outline-none focus:border-(--color-muted) text-foreground w-36"
        />
      </form>
    );
  }

  const menuItems = [
    {
      label: t("rename"),
      onClick: () => {
        setIsRenaming(true);
        setRenameValue(sprint.name);
      },
    },
    {
      label: t("delete_item"),
      onClick: () => onDelete(sprint.id),
      isDanger: true,
    },
  ];

  return (
    <div
      className={`shrink-0 flex items-center rounded-md border text-xs md:text-sm font-medium transition-all duration-300 ease-in-out whitespace-nowrap ${isActive
        ? "bg-foreground text-background border-foreground shadow-sm"
        : "bg-background text-(--color-muted) border-(--color-border) hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground hover:border-(--color-muted)"
        }`}
    >
      <button
        type="button"
        onClick={onSelect}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setIsRenaming(true);
          setRenameValue(sprint.name);
        }}
        onTouchEnd={(e) => handleDoubleTap(e, sprint.id)}
        className="pl-3 pr-2 py-1.5 text-left outline-none rounded-l-md cursor-pointer select-none truncate max-w-[120px] md:max-w-[200px]"
      >
        {sprint.name}
      </button>

      <div 
        className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${
          isActive ? 'w-6 opacity-100 pr-1.5' : 'w-0 opacity-0 pr-0'
        }`}
      >
        <DropdownMenu
          items={menuItems}
          triggerClassName="opacity-70 hover:cursor-pointer"
        />
      </div>
    </div>
  );
}