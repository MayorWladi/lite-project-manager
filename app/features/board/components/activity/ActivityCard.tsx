"use client";

import { useMemo } from "react";
import { Activity } from "@/app/common/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/app/common/components/Button";
import { ChecklistProgress } from "@/app/common/components/ChecklistProgress";
import { BananaIcon } from "@/app/common/components/Icons";
import { useProjectsManager } from "@/app/common/context/ProjectContext";
import { useLanguage } from "@/app/common/context/LanguageContext";
import { useActivityActions } from "@/app/features/board/hooks/useActivityActions";
import TaskItem from "./TaskItem";
import ActivityHeader from "./ActivityHeader";
import AddTaskForm from "./AddTaskForm";
import { Tooltip } from "@/app/common/components/Tooltip";

interface ActivityCardProps {
  activity: Activity;
  sprintId: string;
  isOverlay?: boolean;
}

export default function ActivityCard({ activity, sprintId, isOverlay }: ActivityCardProps) {
  const { openActivityDetails } = useProjectsManager();
  const { t } = useLanguage();

  const {
    handleRenameActivity,
    handleDeleteActivity,
    handleToggleTask,
    handleAddTask,
    handleDeleteTask,
    handleRenameTask,
  } = useActivityActions(sprintId, activity.id);

  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
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

  const containerClassName = `w-[264px] mb-3 break-inside-avoid`;
  const cardClassName = `bg-(--color-card-bg) border rounded-xl p-4 pt-1 flex flex-col gap-3 transition-all duration-200 ease-out shadow-[0_2px_8px_rgba(0,0,0,0.02)] group relative ${
    isOverlay
      ? "border-(--color-border) shadow-none"
      : isDragging
      ? "border-dashed border-(--color-muted)"
      : "border-(--color-border) hover:border-(--color-muted) hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
  }`;

  return (
    <div ref={isOverlay ? undefined : setNodeRef} style={style} className={containerClassName}>
      <div className={cardClassName}>
        <div 
          ref={setActivatorNodeRef} 
          className={`w-full flex justify-center pt-2 pb-2 ${isOverlay ? "cursor-grabbing" : "cursor-grab active:cursor-grabbing"} group/handle`}
          {...(isOverlay ? {} : { ...listeners, ...attributes })}
        >
          <div className="w-8 h-1.5 rounded-full bg-(--color-border) group-hover/handle:bg-(--color-muted) transition-colors" />
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

          <Tooltip content={t("view_details")}>
            <Button
              variant="custom"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openActivityDetails(sprintId, activity.id);
              }}
              className="p-1.5 text-lg hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-all active:scale-95 shrink-0 select-none opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              <BananaIcon />
            </Button>
          </Tooltip>
        </div>

        <div className="flex flex-col gap-1.5 cursor-default" onPointerDown={(e) => e.stopPropagation()}>
          <ChecklistProgress completed={completedTasks} total={tasks.length} />

          <div className="flex flex-col gap-1.5 group/tasklist transition-opacity duration-300">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                variant="board"
                onToggle={() => handleToggleTask(task.id)}
                onDelete={() => handleDeleteTask(task.id)}
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
