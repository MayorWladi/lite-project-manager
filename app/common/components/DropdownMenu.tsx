// /app/components/DropdownMenu.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { MoreVerticalIcon } from "@/app/common/components/Icons";
import { MenuItemButton } from "@/app/common/components/MenuItemButton";

interface MenuItem {
  label: string;
  onClick: () => void;
  isDanger?: boolean;
}

interface DropdownMenuProps {
  items: MenuItem[];
  triggerClassName?: string;
  menuClassName?: string;
  ariaLabel?: string;
}

export default function DropdownMenu({
  items,
  triggerClassName = "",
  menuClassName = "bg-(--color-card-bg) border border-(--color-border) rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] py-1 min-w-[120px] animate-fade-in",
  ariaLabel = "Opciones"
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
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={showMenu}
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className={`p-0.5 rounded text-current hover:opacity-100 transition-opacity ${triggerClassName}`}
      >
        <MoreVerticalIcon />
      </button>

      {showMenu &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-40 cursor-default"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
              }}
            />
            <div
              ref={menuRef}
              className={`fixed z-50 ${menuClassName}`}
              style={{ top: position.top, left: position.left }}
              onClick={(e) => e.stopPropagation()}
            >
              {items.map((item, idx) => (
                <MenuItemButton
                  key={idx}
                  isDanger={item.isDanger}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    item.onClick();
                  }}
                >
                  {item.label}
                </MenuItemButton>
              ))}
            </div>
          </>,
          document.body
        )}
    </div>
  );
}