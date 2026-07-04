// /app/components/MobileActivityCard.tsx
"use client";

import { useState, useMemo, useCallback } from "react";
import { Activity, TaskStatus } from "@/app/common/types";
import { ChecklistProgress } from "@/app/common/components/ChecklistProgress";
import { useActivityActions } from "@/app/features/board/hooks/useActivityActions";
import { useLanguage } from "@/app/common/context/LanguageContext";
import { notifyActivityError } from "@/app/utils/helpers/notifications";
import { StatusSelect } from "@/app/common/components/StatusSelect";
import { InlineEditableText } from "@/app/common/components/InlineEditableText";
import TaskItem from "./TaskItem";
import AddTaskForm from "./AddTaskForm";
import DropdownMenu from "@/app/common/components/DropdownMenu";

interface MobileActivityCardProps {
  activity: Activity;
  sprintId: string;
  columns: { id: TaskStatus; title: string }[];
  onStatusChange: (activityId: string, newStatus: TaskStatus) => void;
}

export default function MobileActivityCard({ activity, sprintId, columns, onStatusChange }: MobileActivityCardProps) {
  const { t } = useLanguage();
  
  const {
    handleRenameActivity,
    handleDeleteActivity,
    handleToggleTask,
    handleAddTask,
    handleDeleteTask,
    handleRenameTask,
  } = useActivityActions(sprintId, activity.id);

  const [isRenaming, setIsRenaming] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState<"left" | "right" | null>(null);

  const tasks = useMemo(() => activity.tasks ?? [], [activity.tasks]);
  const completedTasks = useMemo(() => tasks.filter((task) => task.isCompleted).length, [tasks]);

  const handleStatusChange = (newStatusId: TaskStatus) => {
    if (newStatusId === activity.status) {
      return;
    }

    if (newStatusId === "review" || newStatusId === "done") {
      const hasUncompleted = tasks.some((task) => !task.isCompleted);
      if (hasUncompleted) {
        setIsShaking(true);
        window.setTimeout(() => setIsShaking(false), 400);
        notifyActivityError(t);
        return;
      }
    }

    const currentIndex = columns.findIndex((col) => col.id === activity.status);
    const targetIndex = columns.findIndex((col) => col.id === newStatusId);
    const direction = targetIndex > currentIndex ? "right" : "left";

    setIsAnimatingOut(direction);
    window.setTimeout(() => onStatusChange(activity.id, newStatusId), 300);
  };

  return (
    <div
      className={`bg-(--color-card-bg) border border-(--color-border) rounded-xl p-4 flex flex-col gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300 ${
        isShaking ? "animate-shake border-red-500/50" : ""
      } ${
        isAnimatingOut === "right"
          ? "translate-x-[120%] opacity-0"
          : isAnimatingOut === "left"
          ? "translate-x-[-120%] opacity-0"
          : "translate-x-0 opacity-100"
      }`}
    >
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-start gap-2.5">
          <div className="flex-1 min-w-0">
            <InlineEditableText
              value={activity.name}
              onSubmit={handleRenameActivity}
              isEditing={isRenaming}
              onEditingChange={setIsRenaming}
              placeholder={t("rename")}
              textClassName="font-semibold text-sm text-foreground leading-tight line-clamp-2 cursor-default"
              inputClassName="w-full p-0 text-base font-semibold"
              wrapperClassName="flex-1"
            />
            {activity.description && (
              <p className="text-xs text-(--color-muted) mt-1 leading-relaxed line-clamp-2">{activity.description}</p>
            )}
          </div>

          <StatusSelect
            options={columns.map((col) => ({ id: col.id, label: col.title }))}
            selectedId={activity.status}
            onChange={handleStatusChange}
            buttonLabel={t("status")}
          />

          <DropdownMenu
            triggerClassName="p-1 rounded text-(--color-muted) active:text-foreground"
            menuClassName="left-0 top-full mt-0.5 z-50 bg-(--color-card-bg) border border-(--color-border) rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] py-1 min-w-[120px] max-w-[calc(100vw-50%)]"
            ariaLabel={`${t("options")} - ${activity.name}`}
            items={[
              {
                label: t("rename"),
                onClick: () => setIsRenaming(true),
              },
              {
                label: t("delete_item"),
                onClick: handleDeleteActivity,
                isDanger: true,
              },
            ]}
          />
        </div>
      </div>

      {tasks.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <ChecklistProgress completed={completedTasks} total={tasks.length} />
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              variant="mobile"
              onToggle={() => handleToggleTask(task.id)}
              onDelete={() => handleDeleteTask(task.id)}
              onRename={(newTitle: string) => handleRenameTask(task.id, newTitle)}
            />
          ))}
        </div>
      )}

      <div className="mt-1 w-full">
        <AddTaskForm onAdd={handleAddTask} placeholderText={t("new_task_placeholder")} buttonText={t("add_task")} />
      </div>
    </div>
  );
}
