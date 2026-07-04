// /app/components/Sidebar.tsx
"use client";

import React, { useState } from "react";
import { useProjectsManager } from "@/app/common/context/ProjectContext";
import { useLanguage } from "@/app/common/context/LanguageContext";
import SettingsModal from "./components/settings/SettingsModal";
import InfoModal from "./components/info/InfoModal";
import ProgressBar from "@/app/common/components/ProgressBar";
import ProjectList from "./components/projects/ProjectList";
import { useConfirmation } from "@/app/common/context/ConfirmationContext";
import { Button } from "@/app/common/components/Button";
import { Input } from "@/app/common/components/Input";
import { Label } from "@/app/common/components/Label";
import { CloseIcon, MenuIcon, InfoIcon, SettingsIcon } from "@/app/common/components/Icons";
import { useIsMobile } from "@/app/common/hooks/useIsMobile";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isDesktopOpen?: boolean;
  onDesktopToggle?: () => void;
}

export default function Sidebar({ isOpen, onClose, isDesktopOpen = true, onDesktopToggle }: SidebarProps) {
  const { projects, selectedProjectId, setSelectedProjectId, addProject, deleteProject } = useProjectsManager();
  const { t } = useLanguage();
  const [newProjectName, setNewProjectName] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [storageUsage, setStorageUsage] = useState(0);
  const { confirmAction } = useConfirmation();
  const isMobile = useIsMobile();

  React.useEffect(() => {
    const calculateStorage = () => {
      let total = 0;
      try {
        if (typeof window !== "undefined") {
          for (const x in window.localStorage) {
            if (!window.localStorage.hasOwnProperty(x)) continue;
            total += ((window.localStorage[x].length + x.length) * 2);
          }
        }
      } catch {
        // Ignoramos errores de cuota o localStorage deshabilitado.
      }
      setStorageUsage(Math.min((total / 5242880) * 100, 100));
    };
    calculateStorage();
    const interval = setInterval(calculateStorage, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      addProject(newProjectName.trim());
      setNewProjectName("");
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-sm md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 bg-(--color-card-bg) border-r border-(--color-border) flex flex-col transition-all duration-300 ease-in-out md:static ${isOpen ? 'translate-x-0 shadow-[20px_0_40px_rgba(0,0,0,0.05)] w-[260px]' : '-translate-x-full md:translate-x-0'} ${isDesktopOpen ? 'md:w-[260px]' : 'md:w-0 md:border-r-0 overflow-hidden w-[260px]'}`}>
        <div className="w-[260px] min-w-[260px] h-full flex flex-col">
          {/* Encabezado */}
          <div className="h-16 flex justify-between items-center px-6 border-b border-(--color-border) shrink-0">
            <h1 className="text-lg font-medium text-foreground tracking-tight truncate">
              Lite Project Manager
            </h1>
            {isMobile && (
              <Button variant="icon" className="md:hidden -mr-2" onClick={onClose}>
                <CloseIcon />
              </Button>
            )}
            {onDesktopToggle && !isMobile && (
              <Button variant="icon" className="hidden md:block -mr-2" onClick={onDesktopToggle}>
                <MenuIcon />
              </Button>
            )}
          </div>

          {/* Lista de Proyectos */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
            <div className="px-3 py-2 mb-2">
              <h2 className="text-[10px] font-bold text-(--color-muted) uppercase tracking-wider">{t("projects")}</h2>
            </div>

            {projects.length === 0 ? (
              <p className="text-sm text-(--color-muted) px-3 italic">{t("no_projects")}</p>
            ) : (
              <ProjectList
                projects={projects}
                selectedProjectId={selectedProjectId}
                onSelectProject={setSelectedProjectId}
                onDeleteProject={async (id, name) => {
                  const confirmed = await confirmAction({
                    title: t("delete_item"),
                    description: t("confirm_delete_project_desc"),
                    level: "high",
                    confirmWord: name
                  });
                  if (confirmed) {
                    deleteProject(id);
                  }
                }}
              />
            )}
          </div>

          {/* Formulario para Nuevo Proyecto */}
          <div className="p-4 border-t border-(--color-border)">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <Label className="text-[10px]">
                {t("new_project")}
              </Label>
              <Input
                type="text"
                placeholder={t("project_placeholder")}
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="w-full px-3 py-2 text-sm"
              />
            </form>
          </div>

          {/* Almacenamiento Local */}
          <div className="px-4 py-3 border-t border-(--color-border)">
            <ProgressBar
              percentage={storageUsage}
              label="Storage"
              displayValue={`${storageUsage.toFixed(1)}%`}
              variant="stacked"
              tooltipPosition="top"
              tooltipTitle="Almacenamiento Local"
              tooltipStats={[
                { label: "Usado", value: `${(storageUsage * 5 / 100).toFixed(2)} MB` },
                { label: "Libre", value: `${(5 - (storageUsage * 5 / 100)).toFixed(2)} MB` },
                'divider',
                { label: "Total Estimado", value: "5.00 MB" },
              ]}
            />
          </div>

          {/* Botones de Footer (Info y Ajustes) */}
          <div className="p-3 border-t border-(--color-border) space-y-1">
            <Button
              variant="sidebar"
              onClick={() => setIsInfoOpen(true)}
            >
              <InfoIcon />
              <span>{t("information")}</span>
            </Button>

            <Button
              variant="sidebar"
              onClick={() => setIsSettingsOpen(true)}
            >
              <SettingsIcon />
              <span>{t("settings")}</span>
            </Button>
          </div>
        </div>
      </aside>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </>
  );
}