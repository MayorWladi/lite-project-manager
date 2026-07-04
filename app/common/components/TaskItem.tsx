"use client";

import { useState, useEffect } from "react";
import { Task } from "@/app/common/types";
import { Button } from "@/app/common/components/Button";
import { Input } from "@/app/common/components/Input";
import { CheckIcon, TrashIcon } from "@/app/common/components/Icons";

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onRename: (newTitle: string) => void;
  isEditing?: boolean;
  onEditingChange?: (isEditing: boolean) => void;
}

export function TaskItem({ task, onToggle, onDelete, onRename, isEditing: controlledEditing, onEditingChange }: TaskItemProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const isEditing = controlledEditing ?? isRenaming;

  useEffect(() => {
    setDraft(task.title);
  }, [task.title]);

  const handleSubmit = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== task.title) {
      onRename(trimmed);
    }
    setIsRenaming(false);
    onEditingChange?.(false);
  };

  const handleCancel = () => {
    setDraft(task.title);
    setIsRenaming(false);
    onEditingChange?.(false);
  };

  return (
    <div className="flex items-start gap-2.5 transition-opacity duration-300">
      <Button variant="icon" type="button" onClick={onToggle} className="shrink-0 p-1">
        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${task.isCompleted ? "bg-foreground border-foreground text-background" : "border-(--color-muted)"}`}>
          {task.isCompleted && <CheckIcon />}
        </div>
      </Button>

      {isEditing ? (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex-1">
          <Input
            autoFocus
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
              if (e.key === "Escape") {
                e.preventDefault();
                handleCancel();
              }
            }}
            className="w-full text-sm px-1.5 py-0.5"
            variant="ghost"
          />
        </form>
      ) : (
        <span
          onDoubleClick={() => {
            if (task.isCompleted) return;
            setIsRenaming(true);
            onEditingChange?.(true);
          }}
          className={`text-sm flex-1 select-none cursor-default ${task.isCompleted ? "text-(--color-muted) line-through" : "text-foreground"}`}
        >
          {task.title}
        </span>
      )}

      <Button variant="icon" type="button" onClick={onDelete} className="hover:text-red-500">
        <TrashIcon width="12" height="12" />
      </Button>
    </div>
  );
}
