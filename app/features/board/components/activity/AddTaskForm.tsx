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

  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const trimmed = newTaskTitle.trim();
    if (!trimmed) return;

    onAdd(trimmed);
    setNewTaskTitle("");
    setIsAddingTask(false);
  };

  return isAddingTask ? (
    <form onSubmit={handleAddTask} className="mt-1 w-full">
      <Input
        autoFocus
        type="text"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setIsAddingTask(false);
          }
        }}
        onBlur={() => setIsAddingTask(false)}
        placeholder={placeholderText}
        className="w-full text-xs px-2 py-1.5"
      />
    </form>
  ) : (
    <Button
      variant="custom"
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setIsAddingTask(true);
      }}
      className="mt-1 flex w-full items-center gap-1.5 rounded px-1 py-1 text-xs text-(--color-muted) transition-colors hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
    >
      <PlusIcon width="12" height="12" strokeWidth="2" />
      {buttonText}
    </Button>
  );
}
