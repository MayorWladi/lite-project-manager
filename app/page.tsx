// /app/page.tsx
"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/app/features/common/components/AppLayout";
import KanbanBoard from "@/app/features/board/components/KanbanBoard";
import SprintSelector from "@/app/features/board/components/SprintSelector";
import { useProjectsManager } from "@/app/features/common/context/ProjectContext";
import { useLanguage } from "@/app/features/common/context/LanguageContext";

export default function Home() {
  const { selectedProjectId, projects, addSprint } = useProjectsManager();
  const { t } = useLanguage();
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  // Auto-seleccionar el primer sprint al cambiar de proyecto o al crear uno nuevo
  useEffect(() => {
    if (selectedProject && selectedProject.sprints.length > 0) {
      if (!selectedSprintId || !selectedProject.sprints.some(s => s.id === selectedSprintId)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedSprintId(selectedProject.sprints[0].id);
      }
    } else {
       
      setSelectedSprintId(null);
    }
  }, [selectedProject, selectedSprintId]);

  const handleAddSprint = (name: string) => {
    if (selectedProjectId) {
      addSprint(selectedProjectId, name);
    }
  };

  const activeSprint = selectedProject?.sprints.find(s => s.id === selectedSprintId);

  return (
    <AppLayout>
      {selectedProjectId && selectedProject ? (
        <div className="h-full flex flex-col p-4 md:p-8 animate-scroll-entry">
          <header className="flex flex-col gap-4">
            <h1 className="text-2xl md:text-4xl font-semibold tracking-tight text-foreground">
              {selectedProject.name}
            </h1>

            <SprintSelector
              sprints={selectedProject.sprints}
              activeSprint={activeSprint}
              onSelectSprint={setSelectedSprintId}
              onAddSprint={handleAddSprint}
            />
          </header>

          <div className="flex-1 overflow-hidden">
            {activeSprint ? (
              <KanbanBoard key={activeSprint.id} sprint={activeSprint} />
            ) : (
              <div className="h-full border-2 border-dashed border-(--color-border) rounded-xl flex flex-col items-center justify-center gap-2">
                <p className="text-(--color-muted) text-sm">{t("no_sprints_yet")}</p>
                <p className="text-xs text-(--color-muted)/70">{t("create_sprint_msg")}</p>
              </div>
            )}
          </div>
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