"use client";

import React from "react";
import { Activity, Task } from "@/app/common/types";
import { useLanguage } from "@/app/common/context/LanguageContext";
import { Button } from "@/app/common/components/Button";
import { Textarea } from "@/app/common/components/Textarea";
import { Label } from "@/app/common/components/Label";
import { ChecklistProgress } from "@/app/common/components/ChecklistProgress";
import { CloseIcon, StatusIcon } from "@/app/common/components/Icons";
import BoardTaskItem from "./components/activity/BoardTaskItem";
import AddTaskForm from "./components/activity/AddTaskForm";

interface ActivityDetailsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
  onUpdateDescription: (activityId: string, description: string) => void;
  // onToggleActivityStatus: (activityId: string, currentStatus: TaskStatus) => void;
  onAddTask: (activityId: string, taskTitle: string) => void;
  onToggleTask: (activityId: string, taskId: string, isCompleted: boolean) => void;
  onDeleteTask: (activityId: string, taskId: string) => void;
  onRenameTask: (activityId: string, taskId: string, newTitle: string) => void;
}

export default function ActivityDetailsSidebar({
  isOpen,
  onClose,
  activity,
  onUpdateDescription,
  // onToggleActivityStatus,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onRenameTask
}: ActivityDetailsSidebarProps) {
  const { t, language } = useLanguage();
  const [isMounted, setIsMounted] = React.useState(isOpen);
  const [isVisible, setIsVisible] = React.useState(false);
  const [cachedActivity, setCachedActivity] = React.useState<Activity | null>(activity);

  React.useEffect(() => {
    if (activity) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCachedActivity(activity);
    }
  }, [activity]);

  React.useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsMounted(true);
    } else if (isMounted) {
      setIsVisible(false);
      const timer = setTimeout(() => setIsMounted(false), 300); // 300ms transition
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMounted]);

  React.useEffect(() => {
    if (isMounted && isOpen) {
      // Force a reflow and wait for the next frame to ensure the initial state is painted
      let frameId = requestAnimationFrame(() => {
        frameId = requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
      return () => cancelAnimationFrame(frameId);
    }
  }, [isMounted, isOpen]);

  const currentActivity = activity || cachedActivity;

  if (!isMounted || !currentActivity) return null;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const isActivityDone = currentActivity.status === 'done';
  const completedTasks = currentActivity.tasks ? currentActivity.tasks.filter(t => t.isCompleted).length : 0;
  const totalTasks = currentActivity.tasks ? currentActivity.tasks.length : 0;

  return (
    <>
      {/* Fondo oscuro móvil */}
      {isVisible && (
        <div
          className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-sm xl:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* CONTENEDOR ANIMADO PRO: Transición de ancho y transformación */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 bg-(--color-card-bg) flex flex-col transition-all duration-300 ease-in-out xl:static overflow-hidden shrink-0 shadow-[-20px_0_40px_rgba(0,0,0,0.05)] w-[85%] md:w-[340px] ${isVisible
          ? "translate-x-0 border-l border-(--color-border) xl:mr-0"
          : "translate-x-full border-none xl:mr-[-340px]"
          }`}
      >
        {/* Contenedor interno de ancho fijo para evitar que el contenido se aplaste durante la animación */}
        <div className="w-[85vw] md:w-[340px] min-w-[85vw] md:min-w-[340px] h-full flex flex-col">

          {/* Encabezado */}
          <div className="h-16 flex justify-between items-center px-5 border-b border-(--color-border) shrink-0">
            <div className="flex items-center gap-3 truncate mr-2">
              {/* <input
                type="checkbox"
                checked={isActivityDone}
                onChange={() => onToggleActivityStatus(activity.id, activity.status)}
                className="w-4 h-4 rounded-full border-(--color-border) accent-foreground cursor-pointer"
              /> */}
              <h3 className={`font-medium truncate tracking-tight ${isActivityDone ? 'text-(--color-muted) line-through' : 'text-foreground'}`}>
                {currentActivity.name}
              </h3>
            </div>
            <Button
              variant="icon"
              onClick={onClose}
              className="p-1.5 border border-transparent"
            >
              <CloseIcon width="18" height="18" />
            </Button>
          </div>

          {/* Cuerpo */}
          <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-6 scrollbar-hide">

            {/* SECCIÓN DE TAREAS (Usando tus componentes) */}
            <div className="space-y-1.5 flex flex-col">
              <ChecklistProgress completed={completedTasks} total={totalTasks} className="px-1" />

              <div className="flex flex-col gap-1.5 group/tasklist transition-opacity duration-300 px-1">
                {currentActivity.tasks && currentActivity.tasks.map((task: Task) => (
                  <BoardTaskItem
                    key={task.id}
                    task={task}
                    onToggle={(e) => { e.stopPropagation(); onToggleTask(currentActivity.id, task.id, !task.isCompleted); }}
                    onDelete={(e) => { e.stopPropagation(); onDeleteTask(currentActivity.id, task.id); }}
                    onRename={(newTitle) => onRenameTask(currentActivity.id, task.id, newTitle)}
                  />
                ))}
              </div>

              <div className="mt-1">
                <AddTaskForm
                  onAdd={(title) => onAddTask(currentActivity.id, title)}
                  placeholderText={t("new_task_placeholder")}
                  buttonText={t("add_task")}
                />
              </div>
            </div>

            {/* Estado de la actividad */}
            <div className="bg-background border border-(--color-border) rounded-lg divide-y divide-(--color-border) overflow-hidden">
              <Button variant="custom" className="w-full p-3 hover:bg-black/3 dark:hover:bg-white/5 transition-colors text-left flex items-center gap-3 text-sm text-foreground">
                <StatusIcon className="text-(--color-muted)" />
                <span>{t("current_status")} <span className="font-semibold uppercase text-xs ml-1">{currentActivity.status}</span></span>
              </Button>
            </div>

            {/* DESCRIPCIÓN */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-[10px] px-1">
                {t("description")}
              </Label>
              <Textarea
                className="w-full bg-background p-3 text-sm text-foreground placeholder-(--color-muted) min-h-35 resize-none shadow-sm"
                placeholder={t("add_note")}
                value={currentActivity.description || ""}
                onChange={(e) => onUpdateDescription(currentActivity.id, e.target.value)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-(--color-border) bg-background/50 text-center shrink-0">
            <span className="text-xs text-(--color-muted)">
              {t("created_on")} {formatDate(currentActivity.createdAt)}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}