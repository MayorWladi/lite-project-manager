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
        <Input
          type="text"
          autoFocus
          placeholder={t("new_activity_placeholder")}
          value={newActivityName}
          onChange={(e) => setNewActivityName(e.target.value)}
          className="w-48 px-3 py-2 text-sm"
          variant="ghost"
          onBlur={() => { if (!newActivityName.trim()) onClose(); }}
        />
        <Button variant="primary" type="submit" className="shrink-0">
          {t("add")}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleAddActivity} className="flex items-center gap-2">
      <Input
        type="text"
        autoFocus
        placeholder={t("new_activity_placeholder")}
        value={newActivityName}
        onChange={(e) => setNewActivityName(e.target.value)}
        className="w-[280px] px-3 py-2 text-sm shadow-sm"
        onBlur={() => { if (!newActivityName.trim()) onClose(); }}
      />
    </form>
  );
}
