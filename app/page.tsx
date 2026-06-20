// /app/page.tsx
"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/app/components/AppLayout";
import KanbanBoard from "@/app/components/KanbanBoard";
import SprintSelector from "@/app/components/SprintSelector";
import { useProjectsManager } from "@/app/context/ProjectContext";

export default function Home() {
  const { selectedProjectId, projects, addSprint } = useProjectsManager();
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  // Auto-seleccionar el primer sprint al cambiar de proyecto o al crear uno nuevo
  useEffect(() => {
    if (selectedProject && selectedProject.sprints.length > 0) {
      if (!selectedSprintId || !selectedProject.sprints.some(s => s.id === selectedSprintId)) {
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
        <div className="h-full flex flex-col p-8 animate-scroll-entry">
          <header className="flex flex-col gap-4">
            <h1 className="font-editorial text-4xl font-medium tracking-tight text-[var(--foreground)]">
              {selectedProject.name}
            </h1>

            <SprintSelector
              sprints={selectedProject.sprints}
              selectedSprintId={selectedSprintId}
              onSelectSprint={setSelectedSprintId}
              onAddSprint={handleAddSprint}
            />
          </header>

          <div className="flex-1 overflow-hidden">
            {activeSprint ? (
              <KanbanBoard sprint={activeSprint} />
            ) : (
              <div className="h-full border-2 border-dashed border-[var(--color-border)] rounded-xl flex flex-col items-center justify-center gap-2">
                <p className="text-[var(--color-muted)] text-sm">Este proyecto aún no tiene sprints.</p>
                <p className="text-xs text-[var(--color-muted)]/70">Utiliza el botón de arriba para crear uno nuevo.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-[var(--color-muted)] text-sm italic select-none">
            Selecciona o crea un proyecto de la barra lateral
          </p>
        </div>
      )}
    </AppLayout>
  );
}