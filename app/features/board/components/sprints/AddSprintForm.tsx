// /app/components/AddSprintForm.tsx
"use client";

import { useState } from "react";
import { Input } from "@/app/common/components/Input";
import { Button } from "@/app/common/components/Button";
import { PlusIcon } from "@/app/common/components/Icons";

interface AddSprintFormProps {
  onAdd: (name: string) => void;
  placeholderText: string;
  buttonText: string;
}

export default function AddSprintForm({ onAdd, placeholderText, buttonText }: AddSprintFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onAdd(newName.trim());
      setNewName("");
      setIsAdding(false);
    }
  };

  if (isAdding) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2 ml-1">
        <Input
          type="text"
          autoFocus
          placeholder={placeholderText}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={() => setIsAdding(false)}
          onKeyDown={(e) => { if (e.key === 'Escape') setIsAdding(false); }}
          className="px-3 py-1.5 text-sm w-36 md:w-48"
        />
      </form>
    );
  }

  return (
    <Button
      variant="custom"
      onClick={() => setIsAdding(true)}
      className="px-3 py-1.5 rounded-md text-xs md:text-sm font-medium text-(--color-muted) border border-dashed border-(--color-border) hover:border-(--color-muted) hover:text-foreground transition-all duration-300 ease-in-out flex items-center gap-1.5 whitespace-nowrap bg-background"
    >
      <PlusIcon />
      <span>{buttonText}</span>
    </Button>
  );
}