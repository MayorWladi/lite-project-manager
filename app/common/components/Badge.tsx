import React, { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span className={`text-[10px] font-bold bg-black/5 dark:bg-white/10 text-(--color-muted) px-1.5 py-0.5 rounded border border-(--color-border) ${className}`}>
      {children}
    </span>
  );
}
