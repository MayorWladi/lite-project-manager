// /app/components/AddSprintForm.tsx
"use client";

import { useState } from "react";

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
        <input
          type="text"
          autoFocus
          placeholder={placeholderText}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={() => setIsAdding(false)}
          onKeyDown={(e) => { if (e.key === 'Escape') setIsAdding(false); }}
          className="px-3 py-1.5 bg-transparent border border-(--color-border) rounded-md text-sm outline-none transition-colors focus:border-(--color-muted) text-foreground w-36 md:w-48"
        />
      </form>
    );
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className="px-3 py-1.5 rounded-md text-xs md:text-sm font-medium text-(--color-muted) border border-dashed border-(--color-border) hover:border-(--color-muted) hover:text-foreground transition-colors flex items-center gap-1.5 whitespace-nowrap bg-background"
    >
      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      <span>{buttonText}</span>
    </button>
  );
}