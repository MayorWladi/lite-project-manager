"use client";

import React, { ReactNode } from "react";

interface RadioPillProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
    icon?: ReactNode;
    layout?: "row" | "col";
}

export function RadioPill({ label, isActive, onClick, icon, layout = "row" }: RadioPillProps) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all duration-200 ${
                layout === "col" ? "flex-col py-3" : "py-2.5"
            } ${
                isActive
                    ? "border-foreground bg-black/5 dark:bg-white/5 shadow-inner"
                    : "border-(--color-border) hover:border-(--color-muted) text-(--color-muted)"
            }`}
        >
            {icon && icon}
            <span className={`text-sm ${isActive ? "text-foreground font-medium" : ""}`}>{label}</span>
        </button>
    );
}

interface RadioCardProps {
    title: string;
    description: string;
    isActive: boolean;
    onClick: () => void;
    variant?: "default" | "danger";
}

export function RadioCard({ title, description, isActive, onClick, variant = "default" }: RadioCardProps) {
    const isDanger = variant === "danger";

    const defaultActive = "border-foreground bg-black/2 dark:bg-white/2 shadow-[0_2px_8px_rgba(0,0,0,0.02)]";
    const defaultInactive = "border-transparent border-(--color-border) hover:bg-black/3 dark:hover:bg-white/5";

    const dangerActive = "border-red-500 bg-red-500/5 dark:bg-red-500/10 shadow-[0_2px_8px_rgba(239,68,68,0.1)]";
    const dangerInactive = "border-transparent border-(--color-border) hover:bg-red-500/5";

    return (
        <button
            onClick={onClick}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                isActive ? (isDanger ? dangerActive : defaultActive) : (isDanger ? dangerInactive : defaultInactive)
            }`}
        >
            <div>
                <div
                    className={`font-semibold text-sm ${
                        isActive ? (isDanger ? "text-red-600 dark:text-red-400" : "text-foreground") : "text-foreground"
                    }`}
                >
                    {title}
                </div>
                <div className="text-xs text-(--color-muted) mt-0.5">{description}</div>
            </div>
            {isActive && (
                <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    className={`shrink-0 animate-in fade-in zoom-in duration-200 ${
                        isDanger ? "text-red-600 dark:text-red-400" : "text-foreground"
                    }`}
                >
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            )}
        </button>
    );
}
