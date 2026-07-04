import React from "react";
import { Button, ButtonProps } from "./Button";

interface TabButtonProps extends Omit<ButtonProps, "variant"> {
  isActive?: boolean;
}

export function TabButton({ isActive = false, className = "", children, ...props }: TabButtonProps) {
  const baseClasses = "text-xs uppercase tracking-wider border-b-2 transition-colors";
  const activeClasses = isActive 
    ? "border-foreground text-foreground font-bold"
    : "border-transparent text-(--color-muted) hover:text-foreground font-semibold";
    
  return (
    <Button 
      variant="custom" 
      className={`${baseClasses} ${activeClasses} ${className}`} 
      {...props}
    >
      {children}
    </Button>
  );
}
