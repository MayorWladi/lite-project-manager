// /app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { flushSync } from "react-dom";
import AppLayout from "@/app/layouts/AppLayout";
import SprintSelector from "@/app/features/board/SprintSelector";
import KanbanBoard from "@/app/features/board/KanbanBoard";
import ActivityDetailsSidebar from "@/app/features/board/ActivityDetailsSidebar";
import { useProjectsManager } from "@/app/common/context/ProjectContext";
import { useLanguage } from "@/app/common/context/LanguageContext";
import { useConfirmation } from "@/app/common/context/ConfirmationContext";

export default function Home() {
  const {
    selectedProjectId,
    projects,
    addSprint,
    selectedActivity,
    closeActivityDetails,
    updateActivityDescription,
    addTaskToActivity,
    toggleTaskCompletion,
    deleteTask,
    renameTask
  } = useProjectsManager();
  
  const { t } = useLanguage();
  const { confirmAction } = useConfirmation();
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);
  const [prevProjectId, setPrevProjectId] = useState<string | null>(selectedProjectId);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  // Auto-seleccionar sincrónicamente el primer sprint al cambiar de proyecto
  if (selectedProjectId !== prevProjectId) {
    setPrevProjectId(selectedProjectId);
    if (selectedProject && selectedProject.sprints.length > 0) {
      setSelectedSprintId(selectedProject.sprints[0].id);
    } else {
      setSelectedSprintId(null);
    }
  }

  // Also handle cases where the selected sprint is deleted
  useEffect(() => {
    if (selectedProject && selectedProject.sprints.length > 0) {
      if (selectedSprintId && !selectedProject.sprints.some(s => s.id === selectedSprintId)) {
        setSelectedSprintId(selectedProject.sprints[0].id);
      }
    }
  }, [selectedProject, selectedSprintId]);

  const handleAddSprint = (name: string) => {
    if (selectedProjectId) {
      addSprint(selectedProjectId, name);
    }
  };

  const handleSprintChange = (newId: string) => {
    if (newId === selectedSprintId) return;
    
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      document.startViewTransition(() => {
        flushSync(() => {
          setSelectedSprintId(newId);
        });
      });
    } else {
      setSelectedSprintId(newId);
    }
  };

  const activeSprint = selectedProject?.sprints.find(s => s.id === selectedSprintId);

  // Handlers para ActivityDetailsSidebar
  const handleUpdateDescription = (id: string, newDesc: string) => {
    if (selectedProjectId && selectedSprintId) {
      updateActivityDescription(selectedProjectId, selectedSprintId, id, newDesc);
    }
  };

  const handleAddTask = (id: string, taskTitle: string) => {
    if (selectedProjectId && selectedSprintId) {
      addTaskToActivity(selectedProjectId, selectedSprintId, id, taskTitle);
    }
  };

  const handleToggleTask = (id: string, taskId: string) => {
    if (selectedProjectId && selectedSprintId) {
      toggleTaskCompletion(selectedProjectId, selectedSprintId, id, taskId);
    }
  };

  const handleDeleteTask = async (id: string, taskId: string) => {
    if (selectedProjectId && selectedSprintId) {
      const confirmed = await confirmAction({
        title: t("delete_item"),
        description: t("confirm_delete_task_desc"),
        level: "normal"
      });
      if (confirmed) {
        deleteTask(selectedProjectId, selectedSprintId, id, taskId);
      }
    }
  };

  const handleRenameTask = (id: string, taskId: string, newTitle: string) => {
    if (selectedProjectId && selectedSprintId) {
      renameTask(selectedProjectId, selectedSprintId, id, taskId, newTitle);
    }
  };

  return (
    <AppLayout>
      {selectedProjectId && selectedProject ? (
        <div className="h-full w-full flex flex-row overflow-hidden relative">
          <div className="flex-1 flex flex-col p-4 md:p-8 animate-scroll-entry overflow-hidden">
            <header className="flex flex-col gap-4 shrink-0">
            <h1 className="text-2xl md:text-4xl font-semibold tracking-tight text-foreground">
              {selectedProject.name}
            </h1>

            <SprintSelector
              sprints={selectedProject.sprints}
              activeSprint={activeSprint}
              onSelectSprint={handleSprintChange}
              onAddSprint={handleAddSprint}
            />
          </header>

          <div className="flex-1 overflow-hidden">
            {activeSprint ? (
              <KanbanBoard sprint={activeSprint} />
            ) : (
              <div className="h-full border-2 border-dashed border-(--color-border) rounded-xl flex flex-col items-center justify-center gap-2">
                <p className="text-(--color-muted) text-sm">{t("no_sprints_yet")}</p>
                <p className="text-xs text-(--color-muted)/70">{t("create_sprint_msg")}</p>
              </div>
            )}
          </div>
        </div>

        <ActivityDetailsSidebar
          isOpen={selectedActivity !== null}
          onClose={closeActivityDetails}
          activity={selectedActivity}
          onUpdateDescription={handleUpdateDescription}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onRenameTask={handleRenameTask}
        />
      </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-(--color-muted) text-sm italic select-none">
            {t("select_project_msg")}
          </p>
        </div>
      )}
    </AppLayout>
  );
}