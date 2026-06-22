// /app/components/SprintTab.tsx
"use client";

import { useState, useCallback } from "react";
import { Sprint } from "@/app/types";
import { useDoubleTapById } from "@/app/hooks/useDoubleTap";

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
  const [showMenu, setShowMenu] = useState(false);

  // Mantenemos el hook de doble toque original pero manejando solo el estado local
  const handleDoubleTap = useDoubleTapById(useCallback(() => {
    setIsRenaming(true);
    setRenameValue(sprint.name);
    setShowMenu(false);
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

  return (
    <div className="relative shrink-0 flex items-center">
      {isRenaming ? (
        <form onSubmit={(e) => { e.preventDefault(); handleRenameSubmit(); }}>
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
      ) : (
        <button
          onClick={onSelect}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setIsRenaming(true);
            setRenameValue(sprint.name);
            setShowMenu(false);
          }}
          onTouchEnd={(e) => handleDoubleTap(e, sprint.id)}
          className={`px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1 border ${isActive
            ? "bg-foreground text-background border-foreground shadow-sm"
            : "bg-background text-(--color-muted) border-(--color-border) hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground hover:border-(--color-muted)"
            }`}
        >
          {sprint.name}
          {isActive && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="ml-0.5 opacity-70 hover:opacity-100 p-0.5 rounded"
            >
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" /></svg>
            </span>
          )}
        </button>
      )}

      {/* Menú Contextual Integrado */}
      {showMenu && (
        <>
          <div className="fixed inset-0 z-40 cursor-default" onClick={(e) => { e.stopPropagation(); setShowMenu(false); }} />
          <div className="absolute left-0 md:left-auto md:right-0 top-full mt-1 z-50 bg-(--color-card-bg) border border-(--color-border) rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] py-1 min-w-[120px] animate-fade-in">
            <button
              onClick={(e) => { e.stopPropagation(); setIsRenaming(true); setRenameValue(sprint.name); setShowMenu(false); }}
              className="w-full text-left px-3 py-1.5 text-xs font-medium text-(--color-muted) hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              {t("rename")}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete(sprint.id); }}
              className="w-full text-left px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors"
            >
              {t("delete_item")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}