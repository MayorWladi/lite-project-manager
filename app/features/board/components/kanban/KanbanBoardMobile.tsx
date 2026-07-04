import { useState } from "react";
import { Sprint, TaskStatus, Activity } from "@/app/common/types";
import { useLanguage } from "@/app/common/context/LanguageContext";
import { Button } from "@/app/common/components/Button";
import { TabButton } from "@/app/common/components/TabButton";
import { Badge } from "@/app/common/components/Badge";
import { PlusIcon, InboxIcon } from "@/app/common/components/Icons";
import MobileActivityCard from "@/app/features/board/components/activity/MobileActivityCard";
import AddActivityForm from "@/app/features/board/components/activity/AddActivityForm";

interface KanbanBoardMobileProps {
  sprint: Sprint;
  localActivities: Activity[];
  mobileActiveColumn: TaskStatus;
  setMobileActiveColumn: (status: TaskStatus) => void;
  handleMobileStatusChange: (activityId: string, newStatus: TaskStatus) => void;
  columns: { id: TaskStatus; title: string }[];
}

export default function KanbanBoardMobile({
  sprint,
  localActivities,
  mobileActiveColumn,
  setMobileActiveColumn,
  handleMobileStatusChange,
  columns
}: KanbanBoardMobileProps) {
  const { t } = useLanguage();
  const [isAdding, setIsAdding] = useState(false);

  const mobileActivities = localActivities.filter(a => a.status === mobileActiveColumn);

  return (
    <div className="md:hidden h-full flex flex-col">
      {/* Column Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide border-b border-(--color-border) shrink-0 bg-background">
        {columns.map(col => {
          const count = localActivities.filter(a => a.status === col.id).length;
          return (
            <TabButton
              key={col.id}
              isActive={mobileActiveColumn === col.id}
              onClick={() => setMobileActiveColumn(col.id)}
              className="flex items-center gap-1.5 px-3 py-2.5 whitespace-nowrap"
            >
              {col.title}
              <Badge>{count}</Badge>
            </TabButton>
          );
        })}
      </div>

      {/* Active Column Cards */}
      <div key={mobileActiveColumn} className="flex-1 overflow-y-auto p-3 space-y-3 pb-24 animate-column-enter vt-kanban">
        {mobileActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-(--color-muted)">
            <InboxIcon width="32" height="32" className="mb-3 opacity-40" />
            <p className="text-sm">{t("no_activities_here")}</p>
          </div>
        ) : (
          mobileActivities.map(activity => (
            <MobileActivityCard
              key={activity.id}
              activity={activity}
              sprintId={sprint.id}
              columns={columns}
              onStatusChange={handleMobileStatusChange}
            />
          ))
        )}
      </div>

      {/* Mobile Add Activity FAB */}
      <div className="fixed bottom-6 right-6 z-50">
        {isAdding ? (
          <AddActivityForm sprintId={sprint.id} isMobile onClose={() => setIsAdding(false)} />
        ) : (
          <Button
            variant="custom"
            onClick={() => setIsAdding(true)}
            className="w-14 h-14 bg-foreground text-background rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            <PlusIcon width="24" height="24" strokeWidth="2" />
          </Button>
        )}
      </div>
    </div>
  );
}
