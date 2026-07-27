"use client";

import { useState } from "react";
import { useLanguage } from "@/app/common/context/LanguageContext";
import DropdownMenu from "@/app/common/components/DropdownMenu";
import { InlineEditableText } from "@/app/common/components/InlineEditableText";

interface ActivityHeaderProps {
  name: string;
  description?: string;
  isOverlay?: boolean;
  onRenameSubmit: (newName: string) => void;
  onDeleteActivity: () => void;
}

export default function ActivityHeader({ name, description, isOverlay, onRenameSubmit, onDeleteActivity }: ActivityHeaderProps) {
  const { t } = useLanguage();
  const [isRenaming, setIsRenaming] = useState(false);

  const menuItems = [
    {
      label: t("rename"),
      onClick: () => setIsRenaming(true),
    },
    {
      label: t("delete_item"),
      onClick: onDeleteActivity,
      isDanger: true,
    },
  ];

  return (
    <div className="flex items-start justify-between gap-1" onPointerDown={(e) => e.stopPropagation()}>
      <div className="flex-1 min-w-0">
        <InlineEditableText
          value={name}
          onSubmit={onRenameSubmit}
          isEditing={isRenaming}
          onEditingChange={setIsRenaming}
          disabled={isOverlay}
          placeholder={t("rename")}
          textClassName="font-semibold text-foreground text-sm leading-tight tracking-tight mt-0.5 break-all group-hover:text-foreground transition-colors cursor-default"
          inputClassName="w-full p-0 text-sm"
          wrapperClassName="w-full"
        />
        {description && (
          <p className="text-xs text-(--color-muted) line-clamp-2 leading-relaxed mt-1 hidden md:block group-hover:text-foreground/80 transition-colors">
            {description}
          </p>
        )}
      </div>

      {!isOverlay && (
        <DropdownMenu
          items={menuItems}
          triggerClassName="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all hover:bg-black/5 dark:hover:bg-white/5 rounded-md"
          ariaLabel={`${t("options")} - ${name}`}
        />
      )}
    </div>
  );
}
