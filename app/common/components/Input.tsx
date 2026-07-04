import React, { forwardRef, InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "ghost";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const baseClasses = "bg-transparent outline-none transition-colors text-foreground";
    
    const variantClasses = {
      default: "border border-(--color-border) rounded-md focus:border-(--color-muted)",
      ghost: "border-none rounded-lg focus:ring-0",
    };

    return (
      <input
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
