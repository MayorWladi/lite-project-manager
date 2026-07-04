// /app/components/ActivityHeader.tsx
"use client";

import { useState } from "react";
import DropdownMenu from "@/app/common/components/DropdownMenu";
import { Input } from "@/app/common/components/Input";

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

  const menuItems = [
    {
      label: t("rename"),
      onClick: () => {
        setIsRenaming(true);
        setRenameValue(name);
      },
    },
    {
      label: t("delete_item"),
      onClick: onDeleteActivity,
      isDanger: true,
    },
  ];

  return (
    <div className="flex items-start justify-between gap-1" onPointerDown={e => e.stopPropagation()}>
      <div className="flex-1 min-w-0">
        {isRenaming ? (
          <form onSubmit={(e) => { e.preventDefault(); handleRenameSubmit(); }}>
            <Input
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
              variant="ghost"
              className="w-full p-0 text-sm"
            />
          </form>
        ) : (
          <>
            <h4
              onDoubleClick={(e) => { e.stopPropagation(); setIsRenaming(true); setRenameValue(name); }}
              className="font-semibold text-foreground text-sm leading-tight tracking-tight mt-0.5 wrap-break-word group-hover:text-foreground transition-colors"
            >
              {name}
            </h4>
            {description && !isRenaming && (
              <p className="text-xs text-(--color-muted) line-clamp-2 leading-relaxed mt-1 hidden md:block group-hover:text-foreground/80 transition-colors">
                {description}
              </p>
            )}
          </>
        )}
      </div>

      {!isOverlay && (
        <DropdownMenu
          items={menuItems}
          triggerClassName="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
          ariaLabel={`${t("options")} - ${name}`}
        />
      )}
    </div>
  );
}