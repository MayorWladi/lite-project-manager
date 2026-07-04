"use client";

import { memo, useCallback } from "react";
import { Task } from "@/app/common/types";
import { Button } from "@/app/common/components/Button";
import { InlineEditableText } from "@/app/common/components/InlineEditableText";
import { CheckCircleIcon, CircleIcon, TrashIcon } from "@/app/common/components/Icons";
import { TASK_COMPLETE_SOUNDS, TASK_COMPLETE_VOLUMES } from "@/app/common/constants/sounds";

const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onRename: (newTitle: string) => void;
  variant?: "board" | "mobile";
}

const TaskItem = memo(function TaskItem({
  task,
  onToggle,
  onDelete,
  onRename,
  variant = "board",
}: TaskItemProps) {
  const isMobile = variant === "mobile";

  const handleToggle = useCallback(() => {
    const audio = new Audio(pickRandom(TASK_COMPLETE_SOUNDS));
    audio.volume = pickRandom(TASK_COMPLETE_VOLUMES);
    audio.play().catch(() => { /* silenciar errores */ });
    onToggle();
  }, [onToggle]);

  return (
    <div
      className={`flex group/task transition-opacity duration-300 ${
        isMobile
          ? "items-start gap-2.5"
          : "items-center gap-2 group-hover/tasklist:opacity-50 hover:opacity-100"
      }`}
    >
      <Button
        variant="icon"
        type="button"
        onClick={(e) => { e.stopPropagation(); handleToggle(); }}
        className={`shrink-0 p-0 ${!isMobile ? "mt-0.5" : ""}`}
      >
        {task.isCompleted ? <CheckCircleIcon /> : <CircleIcon />}
      </Button>

      <InlineEditableText
        value={task.title}
        onSubmit={(newTitle) => { if (!task.isCompleted) onRename(newTitle); }}
        disabled={task.isCompleted}
        placeholder="Nueva tarea"
        textClassName={`flex-1 min-w-0 select-none cursor-default transition-all duration-300 ease-in-out wrap-break-word whitespace-pre-wrap ${
          isMobile ? "text-sm" : "text-xs"
        } ${
          task.isCompleted
            ? "text-(--color-muted) line-through decoration-current decoration-1 underline-offset-2"
            : "text-foreground"
        }`}
        inputClassName={`flex-1 border-b border-(--color-border) bg-transparent py-0 focus:border-(--color-muted) rounded-none ${
          isMobile ? "text-sm" : "text-xs"
        }`}
        wrapperClassName="flex-1"
      />

      <Button
        variant="icon"
        type="button"
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className={`p-0 hover:text-red-500 ${!isMobile ? "opacity-0 group-hover/task:opacity-100" : ""}`}
      >
        <TrashIcon width="12" height="12" />
      </Button>
    </div>
  );
});

export default TaskItem;
