// /app/components/ActivityDetailsSidebar.tsx
"use client";

import React from "react";
import { Activity, Task } from "@/app/common/types";
import { useLanguage } from "@/app/common/context/LanguageContext";
import ActivityTaskItem from "@/app/features/activity-details/components/ActivityTaskItem";
import AddTaskForm from "@/app/features/activity-details/components/AddTaskForm";

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
            <button
              onClick={onClose}
              className="p-1.5 text-(--color-muted) hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors border border-transparent"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cuerpo */}
          <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-6 scrollbar-hide">

            {/* SECCIÓN DE TAREAS (Usando tus componentes) */}
            <div className="space-y-1.5 flex flex-col">
              <div className="flex items-center justify-between mb-1 select-none px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-(--color-muted)">{t("checklist")}</span>
                <span className="text-[10px] font-mono text-(--color-muted)">{completedTasks}/{totalTasks}</span>
              </div>

              <div className="flex flex-col gap-1.5 group/tasklist transition-opacity duration-300 px-1">
                {currentActivity.tasks && currentActivity.tasks.map((task: Task) => (
                  <ActivityTaskItem
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
              <button className="w-full p-3 hover:bg-black/3 dark:hover:bg-white/5 transition-colors text-left flex items-center gap-3 text-sm text-foreground">
                <svg width="16" height="16" fill="none" stroke="currentColor" className="text-(--color-muted)" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{t("current_status")} <span className="font-semibold uppercase text-xs ml-1">{currentActivity.status}</span></span>
              </button>
            </div>

            {/* DESCRIPCIÓN */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-(--color-muted) uppercase tracking-wider px-1">
                {t("description")}
              </label>
              <textarea
                className="w-full bg-background border border-(--color-border) rounded-lg p-3 text-sm text-foreground placeholder-(--color-muted) outline-none focus:border-(--color-muted) transition-colors min-h-[140px] resize-none shadow-sm"
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