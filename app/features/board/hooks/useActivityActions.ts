"use client";

import { useCallback } from "react";
import { useProjectsManager } from "@/app/common/context/ProjectContext";
import { useLanguage } from "@/app/common/context/LanguageContext";
import { useConfirmation } from "@/app/common/context/ConfirmationContext";

/**
 * Centraliza los handlers CRUD de una actividad (rename, delete, tasks).
 * Compartido entre ActivityCard (desktop) y MobileActivityCard.
 */
export function useActivityActions(sprintId: string, activityId: string) {
  const {
    selectedProjectId,
    toggleTaskCompletion,
    addTaskToActivity,
    deleteTask,
    renameActivity,
    deleteActivity,
    renameTask,
  } = useProjectsManager();
  const { t } = useLanguage();
  const { confirmAction } = useConfirmation();

  const handleRenameActivity = useCallback(
    (newName: string) => {
      if (!selectedProjectId) return;
      renameActivity(selectedProjectId, sprintId, activityId, newName);
    },
    [selectedProjectId, sprintId, activityId, renameActivity]
  );

  const handleDeleteActivity = useCallback(async () => {
    if (!selectedProjectId) return;
    const confirmed = await confirmAction({
      title: t("delete_item"),
      description: t("confirm_delete_activity_desc"),
      level: "normal",
    });
    if (confirmed) deleteActivity(selectedProjectId, sprintId, activityId);
  }, [selectedProjectId, sprintId, activityId, deleteActivity, confirmAction, t]);

  const handleToggleTask = useCallback(
    (taskId: string) => {
      if (!selectedProjectId) return;
      toggleTaskCompletion(selectedProjectId, sprintId, activityId, taskId);
    },
    [selectedProjectId, sprintId, activityId, toggleTaskCompletion]
  );

  const handleAddTask = useCallback(
    (title: string) => {
      if (!selectedProjectId) return;
      addTaskToActivity(selectedProjectId, sprintId, activityId, title);
    },
    [selectedProjectId, sprintId, activityId, addTaskToActivity]
  );

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      if (!selectedProjectId) return;
      const confirmed = await confirmAction({
        title: t("delete_item"),
        description: t("confirm_delete_task_desc"),
        level: "normal",
      });
      if (confirmed) deleteTask(selectedProjectId, sprintId, activityId, taskId);
    },
    [selectedProjectId, sprintId, activityId, deleteTask, confirmAction, t]
  );

  const handleRenameTask = useCallback(
    (taskId: string, newTitle: string) => {
      if (!selectedProjectId) return;
      renameTask(selectedProjectId, sprintId, activityId, taskId, newTitle);
    },
    [selectedProjectId, sprintId, activityId, renameTask]
  );

  return {
    handleRenameActivity,
    handleDeleteActivity,
    handleToggleTask,
    handleAddTask,
    handleDeleteTask,
    handleRenameTask,
  };
}
