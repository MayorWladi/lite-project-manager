"use client";

import { useEffect, useState } from "react";
import { Input } from "@/app/common/components/Input";
import { useDoubleTap } from "@/app/common/hooks/useDoubleTap";

interface InlineEditableTextProps {
  value: string;
  onSubmit: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  textClassName?: string;
  wrapperClassName?: string;
  isEditing?: boolean;
  onEditingChange?: (isEditing: boolean) => void;
  onCancel?: () => void;
}

export function InlineEditableText({
  value,
  onSubmit,
  disabled = false,
  placeholder,
  className = "",
  inputClassName = "",
  textClassName = "",
  wrapperClassName = "",
  isEditing: controlledEditing,
  onEditingChange,
  onCancel,
}: InlineEditableTextProps) {
  const [internalEditing, setInternalEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const isEditing = controlledEditing ?? internalEditing;

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const setEditing = (next: boolean) => {
    if (disabled) return;
    if (controlledEditing === undefined) {
      setInternalEditing(next);
    }
    onEditingChange?.(next);
  };

  const handleSubmit = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) {
      onSubmit(trimmed);
    } else {
      setDraft(value);
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(value);
    setEditing(false);
    onCancel?.();
  };

  const handleTouchEnd = useDoubleTap((e) => {
    e.stopPropagation();
    setEditing(true);
  });

  if (isEditing) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className={wrapperClassName}
      >
        <Input
          autoFocus
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
            if (e.key === "Escape") {
              e.preventDefault();
              handleCancel();
            }
          }}
          placeholder={placeholder}
          variant="ghost"
          className={inputClassName}
        />
      </form>
    );
  }

  return (
    <span
      onDoubleClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
      onTouchEnd={handleTouchEnd}
      className={`${textClassName} ${className}`}
    >
      {value || placeholder}
    </span>
  );
}
