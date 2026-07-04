"use client";

import { useState } from "react";
import { useProjectsManager } from "@/app/common/context/ProjectContext";
import { useLanguage } from "@/app/common/context/LanguageContext";
import { Input } from "@/app/common/components/Input";
import { Button } from "@/app/common/components/Button";

interface AddActivityFormProps {
  sprintId: string;
  isMobile?: boolean;
  onClose: () => void;
}

export default function AddActivityForm({ sprintId, isMobile, onClose }: AddActivityFormProps) {
  const { selectedProjectId, addActivity } = useProjectsManager();
  const { t } = useLanguage();
  const [newActivityName, setNewActivityName] = useState("");

  const handleAddActivity = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newActivityName.trim() || !selectedProjectId) return;

    addActivity(selectedProjectId, sprintId, newActivityName.trim());
    setNewActivityName("");
    onClose();
  };

  const handleBlur = () => {
    if (!newActivityName.trim()) onClose();
  };

  const formClassName = `inline-flex gap-2 rounded-lg border border-(--color-border) bg-(--color-card-bg) ${
    isMobile ? "p-2 shadow-xl rounded-xl animate-pop-count origin-bottom-right" : ""
  }`;

  const inputClassName = `px-3 text-sm ${isMobile ? "py-2 w-48" : "py-2.5 w-[180px] shadow-sm"}`;

  return (
    <form onSubmit={handleAddActivity} className={formClassName}>
      <Input
        type="text"
        autoFocus
        placeholder={t("new_activity_placeholder")}
        value={newActivityName}
        onChange={(e) => setNewActivityName(e.target.value)}
        onBlur={handleBlur}
        variant="ghost"
        className={inputClassName}
      />
      {isMobile && (
        <Button variant="primary" type="submit" className="shrink-0">
          {t("add")}
        </Button>
      )}
    </form>
  );
}
