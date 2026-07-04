import { useState, useEffect, useMemo } from "react";
import { safeGetItem, safeSetItem } from "@/app/utils/storage/core";
import { Sprint, TaskStatus, Activity } from "@/app/common/types";
import { useLanguage } from "@/app/common/context/LanguageContext";
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, DragOverlay, pointerWithin, SensorDescriptor, SensorOptions } from "@dnd-kit/core";
import { createPortal } from "react-dom";
import { Button } from "@/app/common/components/Button";
import { Badge } from "@/app/common/components/Badge";
import { PlusIcon, Grid1x1Icon, Grid2x2Icon } from "@/app/common/components/Icons";
import KanbanCell from "./KanbanCell";
import ActivityCard from "@/app/features/board/components/activity/ActivityCard";
import AddActivityForm from "@/app/features/board/components/activity/AddActivityForm";

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

  const activitiesByStatus = useMemo(
    () => columns.reduce<Record<string, Activity[]>>((acc, col) => {
      acc[col.id] = localActivities.filter((a) => a.status === col.id);
      return acc;
    }, {}),
    [localActivities, columns]
  );

  useEffect(() => {
    const saved = safeGetItem('kanbanColumnGrids');
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setColumnGrids(JSON.parse(saved));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) { }
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
          safeSetItem('kanbanColumnGrids', JSON.stringify(next));
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
      safeSetItem('kanbanColumnGrids', JSON.stringify(updated));
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
            <Button
              variant="custom"
              onClick={() => setIsAdding(true)}
              className="w-[180px] justify-center px-4 py-2.5 rounded-lg border border-(--color-border) text-(--color-muted) hover:text-foreground hover:border-(--color-muted) bg-background hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm font-medium flex items-center gap-2 shadow-sm"
            >
              <PlusIcon width="16" height="16" />
              {t("add_activity")}
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide pb-4 flex">
          <div className="flex flex-col min-w-max h-full mx-auto px-2 lg:px-6">
            {/* Headers */}
            <div className="flex gap-4 mb-4 sticky top-0 bg-background z-10 py-2 border-b border-(--color-border)">
              {columns.map((col) => {
                const colActivities = activitiesByStatus[col.id] ?? [];
                const gridMode = columnGrids[col.id] || 1;

                const widthClass = gridMode === 1 ? "w-[288px]" : "w-[568px]";

                return (
                  <div key={col.id} className={`${widthClass} shrink-0 px-2 flex justify-between items-end pb-1 transition-all duration-300`}>
                    <h3 className="font-bold text-(--color-muted) text-sm uppercase tracking-widest">{col.title}</h3>
                    <div className="flex items-center gap-2">
                      {colActivities.length >= 3 && (
                        <Button
                          variant="icon"
                          onClick={() => toggleGridMode(col.id, colActivities.length)}
                          title={gridMode === 1 ? t("grid_2x2") : t("grid_list")}
                          className="hover:bg-black/5 dark:hover:bg-white/5 rounded-md"
                        >
                          {gridMode === 1 && <Grid1x1Icon />}
                          {gridMode === 2 && <Grid2x2Icon />}
                        </Button>
                      )}
                      <Badge>{colActivities.length}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Columns */}
            <div className="flex gap-4 flex-1 min-h-0 vt-kanban">
              {columns.map((col) => {
                const activities = activitiesByStatus[col.id] ?? [];

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
