"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function Tooltip({ children, content, position = "top", className = "" }: TooltipProps) {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      requestAnimationFrame(() => {
        if (!tooltipRef.current) return;
        const tooltipRect = tooltipRef.current.getBoundingClientRect();

        let top = 0;
        let left = 0;

        switch (position) {
          case "top":
            top = rect.top - tooltipRect.height - 6;
            left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
            break;
          case "bottom":
            top = rect.bottom + 6;
            left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
            break;
          case "left":
            top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
            left = rect.left - tooltipRect.width - 6;
            break;
          case "right":
            top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
            left = rect.right + 6;
            break;
        }

        // Keep inside window bounds roughly
        if (left < 4) left = 4;
        if (left + tooltipRect.width > window.innerWidth - 4) left = window.innerWidth - tooltipRect.width - 4;
        if (top < 4) top = 4;
        if (top + tooltipRect.height > window.innerHeight - 4) top = window.innerHeight - tooltipRect.height - 4;

        setCoords({ top, left });
      });
    }
  }, [show, position]);

  return (
    <div
      className="relative inline-flex"
      ref={triggerRef}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && typeof window !== "undefined" && createPortal(
        <div
          ref={tooltipRef}
          className={`fixed z-9999 bg-(--color-card-bg) border border-(--color-border) rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] px-2.5 py-1.5 pointer-events-none animate-fade-in ${className}`}
          style={{ top: coords.top, left: coords.left }}
        >
          <span className="text-xs font-medium text-foreground whitespace-nowrap">{content}</span>
        </div>,
        document.body
      )}
    </div>
  );
}
