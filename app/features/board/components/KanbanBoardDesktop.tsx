import { useState, useEffect } from "react";
import { Sprint, TaskStatus, Activity } from "@/app/common/types";
import { useLanguage } from "@/app/common/context/LanguageContext";
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, DragOverlay, pointerWithin, SensorDescriptor, SensorOptions } from "@dnd-kit/core";
import { createPortal } from "react-dom";
import KanbanCell from "@/app/features/board/components/KanbanCell";
import ActivityCard from "@/app/features/activity/ActivityCard";
import AddActivityForm from "@/app/features/activity/components/AddActivityForm";

interface KanbanBoardDesktopProps {
  sprint: Sprint;
  localActivities: Activity[];
  activeActivity: Activity | null;
  columns: { id: TaskStatus; title: string }[];
  sensors: SensorDescriptor<SensorOptions>[];
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
}

export default function KanbanBoardDesktop({
  sprint,
  localActivities,
  activeActivity,
  columns,
  sensors,
  handleDragStart,
  handleDragOver,
  handleDragEnd
}: KanbanBoardDesktopProps) {
  const { t } = useLanguage();
  const [isAdding, setIsAdding] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [columnGrids, setColumnGrids] = useState<Record<string, number>>({});

  useEffect(() => {
    const saved = localStorage.getItem('kanbanColumnGrids');
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setColumnGrids(JSON.parse(saved));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {}
    }
     
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || activeActivity) return;

    const timeoutId = setTimeout(() => {
      setColumnGrids(prev => {
        let changed = false;
        const next = { ...prev };
        
        columns.forEach(col => {
          const count = localActivities.filter(a => a.status === col.id).length;
          const current = next[col.id] || 1;
          
          if (count < 3 && current !== 1) {
            next[col.id] = 1;
            changed = true;
          }
        });
        
        if (changed) {
          localStorage.setItem('kanbanColumnGrids', JSON.stringify(next));
          return next;
        }
        return prev;
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localActivities, activeActivity, mounted, columns]);

  const toggleGridMode = (colId: string, count: number) => {
    setColumnGrids(prev => {
      let current = prev[colId] || 1;
      if (count < 3) current = 1;
      else if (count < 4 && current === 3) current = 2;

      const next = current === 1 ? 2 : 1;

      const updated = { ...prev, [colId]: next };
      localStorage.setItem('kanbanColumnGrids', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="hidden md:flex h-full flex-col">
        {/* Desktop Add Activity Header */}
        <div className="mb-4 px-2 lg:px-6">
          {isAdding ? (
            <AddActivityForm sprintId={sprint.id} onClose={() => setIsAdding(false)} />
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="px-4 py-2.5 rounded-lg border border-(--color-border) text-(--color-muted) hover:text-foreground hover:border-(--color-muted) bg-background hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm font-medium flex items-center gap-2 shadow-sm"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              {t("add_activity")}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide pb-4 flex">
          <div className="flex flex-col min-w-max h-full mx-auto px-2 lg:px-6">
            {/* Headers */}
            <div className="flex gap-4 mb-4 sticky top-0 bg-background z-10 py-2 border-b border-(--color-border)">
              {columns.map((col) => {
                const colActivities = localActivities.filter(a => a.status === col.id);
                const gridMode = columnGrids[col.id] || 1;

                const widthClass = gridMode === 1 ? "w-[280px]" : "w-[560px]"; 

                return (
                  <div key={col.id} className={`${widthClass} shrink-0 px-2 flex justify-between items-end pb-1 transition-all duration-300`}>
                    <h3 className="font-bold text-(--color-muted) text-sm uppercase tracking-widest">{col.title}</h3>
                    <div className="flex items-center gap-2">
                      {colActivities.length >= 3 && (
                        <button 
                          onClick={() => toggleGridMode(col.id, colActivities.length)}
                          className="p-1 rounded-md text-(--color-muted) hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                          title={gridMode === 1 ? t("grid_2x2") : t("grid_list")}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {gridMode === 1 && <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />}
                            {gridMode === 2 && <><rect x="3" y="3" width="7" height="18" rx="2" /><rect x="14" y="3" width="7" height="18" rx="2" /></>}
                          </svg>
                        </button>
                      )}
                      <span className="text-[10px] font-bold bg-black/5 dark:bg-white/10 text-(--color-muted) px-1.5 py-0.5 rounded border border-(--color-border)">
                        {colActivities.length}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Columns */}
            <div className="flex gap-4 flex-1 min-h-0">
              {columns.map((col) => {
                const activities = localActivities.filter((a) => a.status === col.id);
                
                const gridMode = columnGrids[col.id] || 1;

                return <KanbanCell key={col.id} sprintId={sprint.id} statusId={col.id} activities={activities} gridMode={gridMode} />;
              })}
            </div>
          </div>
        </div>
      </div>

      {mounted && createPortal(
        <DragOverlay>
          {activeActivity ? (
            <div className="rotate-3 scale-105 shadow-[0_12px_40px_rgba(58,54,50,0.15)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] cursor-grabbing w-[264px]">
              <ActivityCard activity={activeActivity} sprintId={sprint.id} isOverlay />
            </div>
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
