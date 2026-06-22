// /app/components/DropdownMenu.tsx
"use client";

import { useState } from "react";

interface MenuItem {
  label: string;
  onClick: () => void;
  isDanger?: boolean;
}

interface DropdownMenuProps {
  items: MenuItem[];
  triggerClassName?: string;
  menuClassName?: string;
}

export default function DropdownMenu({
  items,
  triggerClassName = "",
  menuClassName = "absolute right-0 top-full mt-1 z-50 bg-(--color-card-bg) border border-(--color-border) rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] py-1 min-w-[120px] animate-fade-in"
}: DropdownMenuProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative shrink-0 flex items-center">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className={`p-0.5 rounded text-current hover:opacity-100 transition-opacity ${triggerClassName}`}
      >
        <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40 cursor-default"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(false);
            }}
          />
          <div className={menuClassName}>
            {items.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  item.onClick();
                }}
                className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors ${item.isDanger
                  ? "text-red-500 hover:bg-red-500/10"
                  : "text-(--color-muted) hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}