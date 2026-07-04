"use client";

import { useMemo, useCallback } from "react";
import { Activity } from "@/app/common/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/app/common/components/Button";
import { ChecklistProgress } from "@/app/common/components/ChecklistProgress";
import { BananaIcon } from "@/app/common/components/Icons";
import { useProjectsManager } from "@/app/common/context/ProjectContext";
import { useLanguage } from "@/app/common/context/LanguageContext";
import { useConfirmation } from "@/app/common/context/ConfirmationContext";
import ActivityTaskItem from "./ActivityTaskItem";
import ActivityHeader from "./ActivityHeader";
import AddTaskForm from "./AddTaskForm";

interface ActivityCardProps {
  activity: Activity;
  sprintId: string;
  isOverlay?: boolean;
}

export default function ActivityCard({ activity, sprintId, isOverlay }: ActivityCardProps) {
  const {
    selectedProjectId,
    toggleTaskCompletion,
    addTaskToActivity,
    deleteTask,
    renameActivity,
    deleteActivity,
    renameTask,
    openActivityDetails,
  } = useProjectsManager();

  const { t } = useLanguage();
  const { confirmAction } = useConfirmation();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: activity.id,
    data: { activity, sprintId },
    disabled: isOverlay,
  });

  const tasks = useMemo(() => activity.tasks ?? [], [activity.tasks]);
  const completedTasks = useMemo(() => tasks.filter((task) => task.isCompleted).length, [tasks]);

  const style = isOverlay
    ? undefined
    : {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      };

  const confirmDelete = useCallback(
    async (description: string, action: () => void) => {
      if (!selectedProjectId) return;

      const confirmed = await confirmAction({
        title: t("delete_item"),
        description,
        level: "normal",
      });

      if (confirmed) action();
    },
    [selectedProjectId, confirmAction, t]
  );

  const handleRenameActivity = useCallback(
    (newName: string) => {
      if (!selectedProjectId) return;
      renameActivity(selectedProjectId, sprintId, activity.id, newName);
    },
    [selectedProjectId, sprintId, activity.id, renameActivity]
  );

  const handleDeleteActivity = useCallback(async () => {
    await confirmDelete(t("confirm_delete_activity_desc"), () => {
      if (selectedProjectId) deleteActivity(selectedProjectId, sprintId, activity.id);
    });
  }, [selectedProjectId, sprintId, activity.id, deleteActivity, confirmDelete, t]);

  const handleAddTask = useCallback(
    (title: string) => {
      if (!selectedProjectId) return;
      addTaskToActivity(selectedProjectId, sprintId, activity.id, title);
    },
    [selectedProjectId, sprintId, activity.id, addTaskToActivity]
  );

  const handleToggleTask = useCallback(
    (taskId: string) => {
      if (!selectedProjectId) return;
      toggleTaskCompletion(selectedProjectId, sprintId, activity.id, taskId);
    },
    [selectedProjectId, sprintId, activity.id, toggleTaskCompletion]
  );

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      await confirmDelete(t("confirm_delete_task_desc"), () => {
        if (selectedProjectId) deleteTask(selectedProjectId, sprintId, activity.id, taskId);
      });
    },
    [selectedProjectId, sprintId, activity.id, deleteTask, confirmDelete, t]
  );

  const handleRenameTask = useCallback(
    (taskId: string, newTitle: string) => {
      if (!selectedProjectId) return;
      renameTask(selectedProjectId, sprintId, activity.id, taskId, newTitle);
    },
    [selectedProjectId, sprintId, activity.id, renameTask]
  );

  const containerClassName = `w-[264px] mb-3 break-inside-avoid ${isOverlay ? "cursor-grabbing" : "cursor-grab active:cursor-grabbing"}`;
  const cardClassName = `bg-(--color-card-bg) border rounded-xl p-4 pt-3 flex flex-col gap-3 transition-all duration-200 ease-out shadow-[0_2px_8px_rgba(0,0,0,0.02)] group relative animate-fade-in ${
    isOverlay
      ? "border-(--color-border) shadow-none"
      : isDragging
      ? "border-dashed border-(--color-muted)"
      : "border-(--color-border) hover:border-(--color-muted) hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
  }`;

  return (
    <div ref={isOverlay ? undefined : setNodeRef} style={style} className={containerClassName} {...(isOverlay ? {} : { ...listeners, ...attributes })}>
      <div className={cardClassName}>
        <div className="w-full flex justify-center pb-1">
          <div className="w-8 h-1 rounded-full bg-(--color-border) group-hover:bg-(--color-muted) transition-colors" />
        </div>

        <div className="flex items-start justify-between gap-2 w-full">
          <div className="flex-1 min-w-0">
            <ActivityHeader
              name={activity.name}
              description={activity.description}
              isOverlay={isOverlay}
              onRenameSubmit={handleRenameActivity}
              onDeleteActivity={handleDeleteActivity}
            />
          </div>

          <Button
            variant="custom"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openActivityDetails(sprintId, activity.id);
            }}
            className="p-1.5 text-lg hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-all active:scale-95 shrink-0 select-none opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Ver detalles de la actividad"
          >
            <BananaIcon />
          </Button>
        </div>

        <div className="flex flex-col gap-1.5 cursor-default" onPointerDown={(e) => e.stopPropagation()}>
          <ChecklistProgress completed={completedTasks} total={tasks.length} />

          <div className="flex flex-col gap-1.5 group/tasklist transition-opacity duration-300">
            {tasks.map((task) => (
              <ActivityTaskItem
                key={task.id}
                task={task}
                onToggle={(e) => {
                  e.stopPropagation();
                  handleToggleTask(task.id);
                }}
                onDelete={(e) => {
                  e.stopPropagation();
                  handleDeleteTask(task.id);
                }}
                onRename={(newTitle) => handleRenameTask(task.id, newTitle)}
              />
            ))}
          </div>

          <AddTaskForm onAdd={handleAddTask} placeholderText={t("new_task_placeholder")} buttonText={t("add_task")} />
        </div>
      </div>
    </div>
  );
}
