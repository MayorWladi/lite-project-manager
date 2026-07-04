// /app/components/AddTaskForm.tsx
"use client";

import { useState } from "react";
import { Input } from "@/app/common/components/Input";
import { Button } from "@/app/common/components/Button";
import { PlusIcon } from "@/app/common/components/Icons";

interface AddTaskFormProps {
  onAdd: (title: string) => void;
  placeholderText: string;
  buttonText: string;
}

export default function AddTaskForm({ onAdd, placeholderText, buttonText }: AddTaskFormProps) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (newTaskTitle.trim()) {
      onAdd(newTaskTitle.trim());
      setNewTaskTitle("");
      setIsAddingTask(false);
    }
  };

  if (isAddingTask) {
    return (
      <form onSubmit={handleAddTask} className="mt-1 w-full">
        <Input
          autoFocus
          type="text"
          value={newTaskTitle}
          onChange={e => setNewTaskTitle(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') e.stopPropagation();
            if (e.key === 'Escape') setIsAddingTask(false);
          }}
          onBlur={() => setIsAddingTask(false)}
          placeholder={placeholderText}
          className="w-full text-xs px-2 py-1.5"
        />
      </form>
    );
  }

  return (
    <Button
      variant="custom"
      type="button"
      onClick={(e) => { e.stopPropagation(); setIsAddingTask(true); }}
      className="mt-1 flex items-center gap-1.5 text-xs text-(--color-muted) hover:text-foreground transition-colors py-1 px-1 -ml-1 rounded hover:bg-black/5 dark:hover:bg-white/5 w-full justify-start"
    >
      <PlusIcon width="12" height="12" strokeWidth="2" />
      {buttonText}
    </Button>
  );
}