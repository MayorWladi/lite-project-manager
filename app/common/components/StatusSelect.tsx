"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useLanguage } from "@/app/common/context/LanguageContext";

interface StatusOption<T> {
  id: T;
  label: string;
}

interface StatusSelectProps<T> {
  options: StatusOption<T>[];
  selectedId: T;
  onChange: (id: T) => void;
  triggerClassName?: string;
  menuClassName?: string;
  ariaLabel?: string;
  buttonLabel?: string;
}

export function StatusSelect<T extends string>({
  options,
  selectedId,
  onChange,
  triggerClassName = "",
  menuClassName = "bg-(--color-card-bg) border border-(--color-border) rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] py-1 min-w-[130px]",
  ariaLabel,
  buttonLabel,
}: StatusSelectProps<T>) {
  const { t } = useLanguage();
  const [showMenu, setShowMenu] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!showMenu || !triggerRef.current || !menuRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const menuWidth = menuRef.current.offsetWidth;
    let left = rect.right - menuWidth;

    if (left < 0) left = 0;
    if (left + menuWidth > window.innerWidth) left = window.innerWidth - menuWidth;

    setPosition({
      top: 0,
      left,
    });
  }, [showMenu]);

  const selectedOption = options.find((option) => option.id === selectedId);

  return (
    <div className="relative shrink-0 flex items-center">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={showMenu}
        aria-label={ariaLabel ?? `${buttonLabel ?? t("status")}`}
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu((current) => !current);
        }}
        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-(--color-border) bg-black/3 dark:bg-white/5 text-(--color-muted) active:scale-95 transition-transform ${triggerClassName}`}
      >
        {selectedOption?.label ?? selectedId}
        <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40 cursor-default" onClick={() => setShowMenu(false)} />
          <div
            ref={menuRef}
            className={`fixed z-50 ${menuClassName}`}
            style={{ top: position.top, left: position.left }}
            onClick={(e) => e.stopPropagation()}
          >
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onChange(option.id);
                }}
                className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${selectedId === option.id ? "text-foreground bg-black/5 dark:bg-white/10" : "text-(--color-muted) active:bg-black/5 dark:active:bg-white/5"}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
