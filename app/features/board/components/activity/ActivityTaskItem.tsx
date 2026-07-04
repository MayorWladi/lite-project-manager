"use client";

import { memo } from "react";
import { Task } from "@/app/common/types";
import { Button } from "@/app/common/components/Button";
import { InlineEditableText } from "@/app/common/components/InlineEditableText";
import { CheckCircleIcon, CircleIcon, TrashIcon } from "@/app/common/components/Icons";

interface ActivityTaskItemProps {
  task: Task;
  onToggle: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onRename: (newTitle: string) => void;
}

const ActivityTaskItem = memo(function ActivityTaskItem({ task, onToggle, onDelete, onRename }: ActivityTaskItemProps) {
  return (
    <div className="flex items-start gap-2 group/task transition-opacity duration-300 group-hover/tasklist:opacity-50 hover:opacity-100">
      <Button
        variant="icon"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(e);
        }}
        className="mt-0.5 shrink-0 p-0"
      >
        {task.isCompleted ? <CheckCircleIcon /> : <CircleIcon />}
      </Button>

      <InlineEditableText
        value={task.title}
        onSubmit={(newTitle) => {
          if (!task.isCompleted) onRename(newTitle);
        }}
        disabled={task.isCompleted}
        placeholder="Nueva tarea"
        textClassName={`text-xs flex-1 min-w-0 select-none cursor-default transition-all duration-300 ease-in-out whitespace-pre-wrap ${
          task.isCompleted ? "text-(--color-muted) line-through decoration-current decoration-1 underline-offset-2" : "text-foreground"
        }`}
        inputClassName="text-xs flex-1 border-b border-(--color-border) bg-transparent py-0 focus:border-(--color-muted) rounded-none"
        wrapperClassName="flex-1"
      />

      <Button
        variant="icon"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(e);
        }}
        className="opacity-0 group-hover/task:opacity-100 hover:text-red-500 p-0"
      >
        <TrashIcon width="12" height="12" />
      </Button>
    </div>
  );
});

export default ActivityTaskItem;
