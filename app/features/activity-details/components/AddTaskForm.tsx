// /app/components/AddTaskForm.tsx
"use client";

import { useState } from "react";

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
        <input
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
          className="w-full text-xs px-2 py-1.5 bg-transparent border border-(--color-border) rounded text-foreground outline-none focus:border-(--color-muted)"
        />
      </form>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); setIsAddingTask(true); }}
      className="mt-1 flex items-center gap-1.5 text-xs text-(--color-muted) hover:text-foreground transition-colors py-1 px-1 -ml-1 rounded hover:bg-black/5 dark:hover:bg-white/5 w-full justify-start"
    >
      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
      {buttonText}
    </button>
  );
}