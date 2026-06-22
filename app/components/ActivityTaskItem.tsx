// /app/components/ActivityTaskItem.tsx
"use client";

import { useState, memo } from "react";
import { Task } from "@/app/types";

interface ActivityTaskItemProps {
  task: Task;
  onToggle: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onRename: (newTitle: string) => void;
}

const ActivityTaskItem = memo(function ActivityTaskItem({
  task,
  onToggle,
  onDelete,
  onRename,
}: ActivityTaskItemProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(task.title);

  const handleRenameSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedValue = renameValue.trim();
    if (trimmedValue && trimmedValue !== task.title) {
      onRename(trimmedValue);
    } else {
      setRenameValue(task.title);
    }
    setIsRenaming(false);
  };

  return (
    <div
      className={`flex items-start gap-2 group/task transition-opacity duration-300 ${task.isCompleted ? "opacity-60" : "opacity-100"
        }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="mt-0.5 shrink-0 text-(--color-muted) hover:text-foreground"
      >
        {task.isCompleted ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        )}
      </button>

      {isRenaming ? (
        <form onSubmit={handleRenameSubmit} className="flex-1">
          <input
            autoFocus
            type="text"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={() => handleRenameSubmit()}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsRenaming(false);
                setRenameValue(task.title);
              }
            }}
            className="w-full text-xs px-1.5 py-0.5 bg-transparent border border-(--color-border) rounded outline-none focus:border-(--color-muted) text-foreground"
          />
        </form>
      ) : (
        <span
          onDoubleClick={(e) => {
            e.stopPropagation();
            setIsRenaming(true);
          }}
          className={`text-xs flex-1 select-none cursor-default ${task.isCompleted ? "text-(--color-muted) line-through" : "text-foreground"
            }`}
        >
          {task.title}
        </span>
      )}

      <button
        onClick={onDelete}
        className="opacity-0 group-hover/task:opacity-100 text-(--color-muted) hover:text-[#9F2F2D] transition-opacity"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  );
});

export default ActivityTaskItem;