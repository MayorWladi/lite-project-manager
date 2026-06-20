// /app/page.tsx
"use client";

import AppLayout from "@/app/components/AppLayout";
import KanbanBoard from "@/app/components/KanbanBoard";
import { useProjectsManager } from "@/app/context/ProjectContext";

export default function Home() {
  const { selectedProjectId, projects } = useProjectsManager();

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  // Para esta fase, asumimos que estamos viendo el primer sprint
  const activeSprint = selectedProject?.sprints[0];

  return (
    <AppLayout>
      {selectedProjectId && selectedProject ? (
        <div className="h-full flex flex-col p-8 animate-scroll-entry">
          <header className="mb-8 flex items-end justify-between">
            <div>
              <h1 className="font-editorial text-4xl font-medium tracking-tight mb-2 text-[var(--foreground)]">
                {selectedProject.name}
              </h1>
              {activeSprint && (
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-black/5 dark:bg-white/10 text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-widest border border-[var(--color-border)]">
                  {activeSprint.name}
                </div>
              )}
            </div>
          </header>

          <div className="flex-1 overflow-hidden">
            {activeSprint ? (
              <KanbanBoard sprint={activeSprint} />
            ) : (
              <div className="h-full border-2 border-dashed border-[var(--color-border)] rounded-xl flex items-center justify-center">
                <p className="text-[var(--color-muted)] text-sm">No hay sprints activos en este proyecto.</p>
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