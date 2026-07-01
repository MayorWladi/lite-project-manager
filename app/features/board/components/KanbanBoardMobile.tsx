import { useState } from "react";
import { Sprint, TaskStatus, Activity } from "@/app/common/types";
import { useLanguage } from "@/app/common/context/LanguageContext";
import MobileActivityCard from "@/app/features/activity/MobileActivityCard";
import AddActivityForm from "@/app/features/activity/components/AddActivityForm";

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
            <button
              key={col.id}
              onClick={() => setMobileActiveColumn(col.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${mobileActiveColumn === col.id
                ? "border-foreground text-foreground"
                : "border-transparent text-(--color-muted)"
                }`}
            >
              {col.title}
              <span key={count} className={`animate-pop-count text-[10px] font-bold px-1.5 py-0.5 rounded-full ${mobileActiveColumn === col.id
                ? "bg-foreground text-background"
                : "bg-black/5 dark:bg-white/10 text-(--color-muted)"
                }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Column Cards */}
      <div key={mobileActiveColumn} className="flex-1 overflow-y-auto p-3 space-y-3 pb-24 animate-column-enter">
        {mobileActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-(--color-muted)">
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="mb-3 opacity-40">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7m16 0v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5m16 0h-2.586a1 1 0 0 0-.707.293l-2.414 2.414a1 1 0 0 1-.707.293h-3.172a1 1 0 0 1-.707-.293l-2.414-2.414A1 1 0 0 0 6.586 13H4" />
            </svg>
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
          <button
            onClick={() => setIsAdding(true)}
            className="w-14 h-14 bg-foreground text-background rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
