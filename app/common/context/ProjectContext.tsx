// /app/context/ProjectContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { Project, Sprint, TaskStatus, Activity } from "@/app/common/types";
import { useLanguage } from "./LanguageContext";
import { notifyTaskAdded, notifyTaskCompleted, notifyTaskDeleted } from "@/app/utils/helpers/notifications";

interface ProjectContextType {
  projects: Project[];
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;

  // --- CONTROLADORES DEL SIDEBAR DERECHO ---
  selectedSprintId: string | null;
  selectedActivityId: string | null;
  selectedActivity: Activity | null;
  openActivityDetails: (sprintId: string, activityId: string) => void;
  closeActivityDetails: () => void;
  updateActivityDescription: (projectId: string, sprintId: string, activityId: string, description: string) => void;
  updateActivityStatus: (projectId: string, sprintId: string, activityId: string, status: TaskStatus) => void;
  // -----------------------------------------

  addProject: (name: string) => void;
  renameProject: (projectId: string, newName: string) => void;
  deleteProject: (projectId: string) => void;
  addSprint: (projectId: string, name: string) => void;
  renameSprint: (projectId: string, sprintId: string, newName: string) => void;
  deleteSprint: (projectId: string, sprintId: string) => void;
  addActivity: (projectId: string, sprintId: string, name: string) => void;
  renameActivity: (projectId: string, sprintId: string, activityId: string, newName: string) => void;
  deleteActivity: (projectId: string, sprintId: string, activityId: string) => void;
  updateSprintActivities: (projectId: string, sprintId: string, newActivities: Activity[]) => void;
  addTaskToActivity: (projectId: string, sprintId: string, activityId: string, title: string) => void;
  renameTask: (projectId: string, sprintId: string, activityId: string, taskId: string, newTitle: string) => void;
  toggleTaskCompletion: (projectId: string, sprintId: string, activityId: string, taskId: string) => void;
  deleteTask: (projectId: string, sprintId: string, activityId: string, taskId: string) => void;
  useSprintMetrics: (sprint: Sprint | null | undefined) => { total: number; done: number; percentage: number };
  getActivityMetrics: (activity: Activity) => { total: number; done: number };
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Estados del Sidebar
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  // Actividad computada en tiempo real
  const currentProject = useMemo(() => projects.find(p => p.id === selectedProjectId), [projects, selectedProjectId]);
  const currentSprint = useMemo(() => currentProject?.sprints.find(s => s.id === selectedSprintId), [currentProject, selectedSprintId]);
  const selectedActivity = useMemo(() => currentSprint?.activities.find(a => a.id === selectedActivityId) || null, [currentSprint, selectedActivityId]);

  const openActivityDetails = (sprintId: string, activityId: string) => {
    setSelectedSprintId(sprintId);
    setSelectedActivityId(activityId);
  };

  const closeActivityDetails = () => {
    setSelectedSprintId(null);
    setSelectedActivityId(null);
  };

  const updateActivityDescription = (projectId: string, sprintId: string, activityId: string, description: string) => {
    setProjects(prev => prev.map(p => p.id !== projectId ? p : {
      ...p, sprints: p.sprints.map(s => s.id !== sprintId ? s : {
        ...s, activities: s.activities.map(a => a.id === activityId ? { ...a, description } : a)
      })
    }));
  };

  const updateActivityStatus = (projectId: string, sprintId: string, activityId: string, status: TaskStatus) => {
    setProjects(prev => prev.map(p => p.id !== projectId ? p : {
      ...p, sprints: p.sprints.map(s => s.id !== sprintId ? s : {
        ...s, activities: s.activities.map(a => a.id === activityId ? { ...a, status } : a)
      })
    }));
  };

  useEffect(() => {
    const savedProjects = localStorage.getItem("kanban-projects");
    const savedSelectedId = localStorage.getItem("kanban-selected-id");
    if (savedProjects) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProjects(JSON.parse(savedProjects));
      } catch (e) { console.error(e); }
    }
    if (savedSelectedId) {
      setSelectedProjectId(savedSelectedId);
    }
    setIsHydrated(true);

    // Cross-tab synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'kanban-projects' && e.newValue) {
        try {
          setProjects(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error syncing projects:', error);
        }
      }
      if (e.key === 'kanban-selected-id') {
        setSelectedProjectId(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (isHydrated) localStorage.setItem("kanban-projects", JSON.stringify(projects));
  }, [projects, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      if (selectedProjectId) localStorage.setItem("kanban-selected-id", selectedProjectId);
      else localStorage.removeItem("kanban-selected-id");
    }
  }, [selectedProjectId, isHydrated]);

  const addProject = (name: string) => {
    const timestamp = Date.now();
    const onboardingSprint: Sprint = {
      id: timestamp.toString(),
      name: t("tpl_sprint_name") || "Sprint 1",
      startDate: timestamp,
      activities: [
        {
          id: (timestamp + 1).toString(),
          name: t("tpl_activity_name") || "Welcome! Start Here 🚀",
          description: t("tpl_activity_desc") || "Welcome to Lite Project Manager! Complete these tasks to learn how everything works.",
          status: 'todo',
          tasks: [
            { id: (timestamp + 2).toString(), title: t("tpl_task1") || "Drag this card to the 'In Progress' column", isCompleted: false, createdAt: timestamp },
            { id: (timestamp + 3).toString(), title: t("tpl_task2") || "Click on this card to view details", isCompleted: false, createdAt: timestamp },
            { id: (timestamp + 4).toString(), title: t("tpl_task3") || "Check off these tasks", isCompleted: false, createdAt: timestamp },
            { id: (timestamp + 5).toString(), title: t("tpl_task4") || "Delete this card when you're done", isCompleted: false, createdAt: timestamp }
          ],
          createdAt: timestamp
        }
      ]
    };

    const newProject: Project = { 
      id: (timestamp + 6).toString(), 
      name, 
      sprints: [onboardingSprint], 
      createdAt: timestamp 
    };
    
    setProjects((prev) => [...prev, newProject]);
    setSelectedProjectId(newProject.id);
  };

  const renameProject = (projectId: string, newName: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, name: newName } : p));
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (selectedProjectId === projectId) setSelectedProjectId(null);
  };

  const addSprint = (projectId: string, name: string) => {
    setProjects(prev => prev.map(p => p.id !== projectId ? p : { ...p, sprints: [...p.sprints, { id: `s-${Date.now()}`, name, activities: [], startDate: Date.now() }] }));
  };

  const renameSprint = (projectId: string, sprintId: string, newName: string) => {
    setProjects(prev => prev.map(p => p.id !== projectId ? p : { ...p, sprints: p.sprints.map(s => s.id === sprintId ? { ...s, name: newName } : s) }));
  };

  const deleteSprint = (projectId: string, sprintId: string) => {
    setProjects(prev => prev.map(p => p.id !== projectId ? p : { ...p, sprints: p.sprints.filter(s => s.id !== sprintId) }));
  };

  const addActivity = (projectId: string, sprintId: string, name: string) => {
    setProjects(prev => prev.map(p => p.id !== projectId ? p : { ...p, sprints: p.sprints.map(s => s.id !== sprintId ? s : { ...s, activities: [...(s.activities || []), { id: `act-${Date.now()}`, name, status: 'todo', tasks: [], createdAt: Date.now() }] }) }));
  };

  const renameActivity = (projectId: string, sprintId: string, activityId: string, newName: string) => {
    setProjects(prev => prev.map(p => p.id !== projectId ? p : { ...p, sprints: p.sprints.map(s => s.id !== sprintId ? s : { ...s, activities: (s.activities || []).map(a => a.id === activityId ? { ...a, name: newName } : a) }) }));
  };

  const deleteActivity = (projectId: string, sprintId: string, activityId: string) => {
    setProjects(prev => prev.map(p => p.id !== projectId ? p : { ...p, sprints: p.sprints.map(s => s.id !== sprintId ? s : { ...s, activities: (s.activities || []).filter(a => a.id !== activityId) }) }));
  };

  const updateSprintActivities = (projectId: string, sprintId: string, newActivities: Activity[]) => {
    setProjects(prev => prev.map(p => p.id !== projectId ? p : { ...p, sprints: p.sprints.map(s => s.id !== sprintId ? s : { ...s, activities: newActivities }) }));
  };

  const addTaskToActivity = (projectId: string, sprintId: string, activityId: string, title: string) => {
    setProjects(prev => prev.map(p => p.id !== projectId ? p : { ...p, sprints: p.sprints.map(s => s.id !== sprintId ? s : { ...s, activities: (s.activities || []).map(a => a.id !== activityId ? a : { ...a, tasks: [...(a.tasks || []), { id: `task-${Date.now()}`, title, isCompleted: false, createdAt: Date.now() }] }) }) }));
    notifyTaskAdded(title);
  };

  const renameTask = (projectId: string, sprintId: string, activityId: string, taskId: string, newTitle: string) => {
    setProjects(prev => prev.map(p => p.id !== projectId ? p : { ...p, sprints: p.sprints.map(s => s.id !== sprintId ? s : { ...s, activities: (s.activities || []).map(a => a.id !== activityId ? a : { ...a, tasks: (a.tasks || []).map(t => t.id === taskId ? { ...t, title: newTitle } : t) }) }) }));
  };

  const toggleTaskCompletion = (projectId: string, sprintId: string, activityId: string, taskId: string) => {
    let taskName = "";
    let isNowCompleted = false;
    setProjects(prev => prev.map(p => p.id !== projectId ? p : { ...p, sprints: p.sprints.map(s => s.id !== sprintId ? s : { ...s, activities: (s.activities || []).map(a => a.id !== activityId ? a : { ...a, tasks: (a.tasks || []).map(t => { if (t.id === taskId) { taskName = t.title; isNowCompleted = !t.isCompleted; return { ...t, isCompleted: isNowCompleted }; } return t; }) }) }) }));
    if (taskName) notifyTaskCompleted(taskName, isNowCompleted);
  };

  const deleteTask = (projectId: string, sprintId: string, activityId: string, taskId: string) => {
    let deletedTaskName = "";
    setProjects(prev => prev.map(p => p.id !== projectId ? p : { ...p, sprints: p.sprints.map(s => s.id !== sprintId ? s : { ...s, activities: (s.activities || []).map(a => { if (a.id !== activityId) return a; const task = a.tasks?.find(t => t.id === taskId); if (task) deletedTaskName = task.title; return { ...a, tasks: (a.tasks || []).filter(t => t.id !== taskId) }; }) }) }));
    if (deletedTaskName) notifyTaskDeleted();
  };

  if (!isHydrated) return null;

  return (
    <ProjectContext.Provider
      value={{
        projects, selectedProjectId, setSelectedProjectId,
        selectedSprintId, selectedActivityId, selectedActivity, openActivityDetails, closeActivityDetails, updateActivityDescription, updateActivityStatus,
        addProject, renameProject, deleteProject, addSprint, renameSprint, deleteSprint, addActivity, renameActivity, deleteActivity, updateSprintActivities, addTaskToActivity, renameTask, toggleTaskCompletion, deleteTask, useSprintMetrics, getActivityMetrics,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectsManager() {
  const context = useContext(ProjectContext);
  if (context === undefined) throw new Error("useProjectsManager debe ser utilizado dentro de un ProjectProvider");
  return context;
}

export function useSprintMetrics(sprint: Sprint | null | undefined) {
  if (!sprint || !sprint.activities) return { total: 0, done: 0, percentage: 0 };
  const total = sprint.activities.length;
  const done = sprint.activities.filter(act => act.status === 'done').length;
  return { total, done, percentage: total === 0 ? 0 : Math.round((done / total) * 100) };
}

export function getActivityMetrics(activity: Activity) {
  const total = activity.tasks ? activity.tasks.length : 0;
  const done = activity.tasks ? activity.tasks.filter(t => t.isCompleted).length : 0;
  return { total, done };
}