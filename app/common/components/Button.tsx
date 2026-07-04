import React, { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "ghost" | "icon" | "sidebar" | "custom";
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", children, ...props }, ref) => {
    
    // Clases comunes para botones estándar (evita repetir tailwind classes)
    const baseClasses = "rounded-lg text-sm font-medium";
    const standardPadding = "px-4 py-2";

    let variantClasses = "";
    switch (variant) {
      case "primary":
        variantClasses = `${baseClasses} ${standardPadding} bg-foreground text-background hover:opacity-90 disabled:opacity-50`;
        break;
      case "danger":
        variantClasses = `${baseClasses} ${standardPadding} bg-[#9F2F2D] text-white hover:bg-red-700 disabled:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed`;
        break;
      case "ghost":
        variantClasses = `${baseClasses} ${standardPadding} text-(--color-muted) hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5`;
        break;
      case "icon":
        variantClasses = "p-1 text-(--color-muted) hover:text-foreground";
        break;
      case "sidebar":
        variantClasses = `${baseClasses} px-3 py-2 w-full text-left text-(--color-muted) hover:bg-black/3 dark:hover:bg-white/5 hover:text-foreground hover:translate-x-0.5 flex items-center gap-2.5`;
        break;
      case "custom":
        variantClasses = ""; // No default styles, fully rely on className prop
        break;
    }

    // Handle disabled state across all variants except danger which has specific disabled styles above
    const disabledClasses = (props.disabled && variant !== "danger") ? "opacity-50 cursor-not-allowed" : "";

    return (
      <button
        ref={ref}
        className={`transition-colors ${variantClasses} ${disabledClasses} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
