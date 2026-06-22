// /app/components/ActivityHeader.tsx
"use client";

import { useState } from "react";
import ActivityMenu from "./ActivityMenu";

interface ActivityHeaderProps {
  name: string;
  description?: string;
  isOverlay?: boolean;
  onRenameSubmit: (newName: string) => void;
  onDeleteActivity: () => void;
  t: (key: string) => string;
}

export default function ActivityHeader({ name, description, isOverlay, onRenameSubmit, onDeleteActivity, t }: ActivityHeaderProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(name);

  const handleRenameSubmit = () => {
    if (renameValue.trim() && renameValue.trim() !== name) {
      onRenameSubmit(renameValue.trim());
    } else {
      setRenameValue(name);
    }
    setIsRenaming(false);
  };

  return (
    <div className="flex items-start justify-between gap-1" onPointerDown={e => e.stopPropagation()}>
      <div className="flex-1 min-w-0">
        {isRenaming ? (
          <form onSubmit={(e) => { e.preventDefault(); handleRenameSubmit(); }}>
            <input
              autoFocus
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsRenaming(false);
                  setRenameValue(name);
                }
              }}
              className="w-full px-1.5 py-0.5 bg-transparent border border-(--color-border) rounded text-sm outline-none focus:border-(--color-muted) text-foreground -ml-1.5"
            />
          </form>
        ) : (
          <>
            <h4
              onDoubleClick={(e) => { e.stopPropagation(); setIsRenaming(true); setRenameValue(name); }}
              className="font-semibold text-sm text-foreground leading-tight group-hover:text-(--color-muted) transition-colors select-none truncate cursor-default"
            >
              {name}
            </h4>
            {description && (
              <p className="text-xs text-(--color-muted) mt-1.5 leading-relaxed select-none">
                {description}
              </p>
            )}
          </>
        )}
      </div>

      {!isOverlay && !isRenaming && (
        <ActivityMenu
          onRename={() => { setIsRenaming(true); setRenameValue(name); }}
          onDelete={onDeleteActivity}
          renameText={t("rename")}
          deleteText={t("delete_item")}
        />
      )}
    </div>
  );
}