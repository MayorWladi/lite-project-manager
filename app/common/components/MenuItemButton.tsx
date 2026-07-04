import React from "react";
import { Button, ButtonProps } from "./Button";

interface MenuItemButtonProps extends Omit<ButtonProps, "variant"> {
  isDanger?: boolean;
}

export function MenuItemButton({ isDanger = false, className = "", children, ...props }: MenuItemButtonProps) {
  const baseClasses = "w-full text-left px-3 py-1.5 text-xs font-medium transition-colors";
  const stateClasses = isDanger 
    ? "text-red-500 hover:bg-red-500/10"
    : "text-(--color-muted) hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5";
    
  return (
    <Button 
      variant="custom" 
      className={`${baseClasses} ${stateClasses} ${className}`} 
      {...props}
    >
      {children}
    </Button>
  );
}
