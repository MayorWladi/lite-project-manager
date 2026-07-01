import { useState } from "react";
import { useProjectsManager } from "@/app/context/ProjectContext";
import { useLanguage } from "@/app/context/LanguageContext";

interface AddActivityFormProps {
  sprintId: string;
  isMobile?: boolean;
  onClose: () => void;
}

export default function AddActivityForm({ sprintId, isMobile, onClose }: AddActivityFormProps) {
  const { selectedProjectId, addActivity } = useProjectsManager();
  const { t } = useLanguage();
  const [newActivityName, setNewActivityName] = useState("");

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newActivityName.trim() && selectedProjectId) {
      addActivity(selectedProjectId, sprintId, newActivityName.trim());
      setNewActivityName("");
      onClose();
    }
  };

  if (isMobile) {
    return (
      <form onSubmit={handleAddActivity} className="flex gap-2 bg-(--color-card-bg) p-2 rounded-xl shadow-xl border border-(--color-border) animate-pop-count origin-bottom-right">
        <input
          type="text"
          autoFocus
          placeholder={t("new_activity_placeholder")}
          value={newActivityName}
          onChange={(e) => setNewActivityName(e.target.value)}
          className="w-48 px-3 py-2 bg-transparent border-none rounded-lg text-sm outline-none focus:ring-0 text-foreground"
          onBlur={() => { if (!newActivityName.trim()) onClose(); }}
        />
        <button type="submit" className="px-3 py-2 bg-foreground text-background rounded-lg text-sm font-medium shrink-0">
          {t("add")}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleAddActivity} className="flex items-center gap-2">
      <input
        type="text"
        autoFocus
        placeholder={t("new_activity_placeholder")}
        value={newActivityName}
        onChange={(e) => setNewActivityName(e.target.value)}
        className="w-[280px] px-3 py-2 bg-transparent border border-(--color-border) rounded-md text-sm outline-none transition-colors focus:border-(--color-muted) text-foreground shadow-sm"
        onBlur={() => { if (!newActivityName.trim()) onClose(); }}
      />
    </form>
  );
}
