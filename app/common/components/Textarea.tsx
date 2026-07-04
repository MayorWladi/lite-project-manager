import React, { forwardRef, TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "ghost";
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const baseClasses = "bg-transparent outline-none transition-colors text-foreground";
    
    const variantClasses = {
      default: "border border-(--color-border) rounded-md focus:border-(--color-muted)",
      ghost: "border-none rounded-lg focus:ring-0",
    };

    return (
      <textarea
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
