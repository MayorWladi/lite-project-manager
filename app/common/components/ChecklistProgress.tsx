import React from "react";
import { useLanguage } from "@/app/common/context/LanguageContext";

interface ChecklistProgressProps {
  completed: number;
  total: number;
  className?: string;
}

export function ChecklistProgress({ completed, total, className = "" }: ChecklistProgressProps) {
  const { t } = useLanguage();
  
  return (
    <div className={`flex items-center justify-between mb-1 select-none ${className}`}>
      <span className="text-[10px] font-bold uppercase tracking-wider text-(--color-muted)">
        {t("checklist")}
      </span>
      <span className="text-[10px] font-mono text-(--color-muted)">
        {completed}/{total}
      </span>
    </div>
  );
}
