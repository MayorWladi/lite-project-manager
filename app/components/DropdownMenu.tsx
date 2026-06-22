// /app/components/DropdownMenu.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

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
  menuClassName = "bg-(--color-card-bg) border border-(--color-border) rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] py-1 min-w-[120px] animate-fade-in"
}: DropdownMenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showMenu && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      // Esperamos un frame para que el menú se haya renderizado y podamos medirlo
      requestAnimationFrame(() => {
        const menuWidth = menuRef.current?.offsetWidth || 160;
        let left = rect.right - menuWidth;
        // Evitar que se salga por la izquierda
        if (left < 0) left = 0;
        // Evitar que se salga por la derecha
        if (left + menuWidth > window.innerWidth) left = window.innerWidth - menuWidth;
        setPosition({
          top: rect.bottom + window.scrollY + 4,
          left: left + window.scrollX,
        });
      });
    }
  }, [showMenu]);

  return (
    <div className="relative shrink-0 flex items-center" ref={triggerRef}>
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

      {showMenu &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-99 cursor-default"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
              }}
            />
            <div
              ref={menuRef}
              className={`fixed z-100 ${menuClassName}`}
              style={{ top: position.top, left: position.left }}
              onClick={(e) => e.stopPropagation()}
            >
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
                    : "text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </>,
          document.body
        )}
    </div>
  );
}