// /app/components/ActivityMenu.tsx
"use client";

import { useState } from "react";

interface ActivityMenuProps {
  onRename: () => void;
  onDelete: () => void;
  renameText: string;
  deleteText: string;
}

export default function ActivityMenu({ onRename, onDelete, renameText, deleteText }: ActivityMenuProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-0.5 rounded text-(--color-muted) hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" /></svg>
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-full mt-0.5 z-50 bg-(--color-card-bg) border border-(--color-border) rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] py-1 min-w-[120px]">
            <button
              onClick={() => { setShowMenu(false); onRename(); }}
              className="w-full text-left px-3 py-1.5 text-xs font-medium text-(--color-muted) hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              {renameText}
            </button>
            <button
              onClick={() => { setShowMenu(false); onDelete(); }}
              className="w-full text-left px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors"
            >
              {deleteText}
            </button>
          </div>
        </>
      )}
    </div>
  );
}