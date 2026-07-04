"use client";

import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/app/common/components/Textarea";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isEditing = controlledEditing ?? internalEditing;

  useEffect(() => {
    setDraft(value);
  }, [value]);

  // Auto-resize: ajusta la altura al contenido mientras se escribe
  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

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
        <Textarea
          ref={textareaRef}
          autoFocus
          variant="ghost"
          value={draft}
          rows={1}
          onChange={(e) => {
            setDraft(e.target.value);
            autoResize(e.target);
          }}
          onFocus={(e) => autoResize(e.target)}
          onBlur={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
            if (e.key === "Escape") {
              e.preventDefault();
              handleCancel();
            }
          }}
          placeholder={placeholder}
          className={`resize-none overflow-hidden ${inputClassName}`}
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
      className={`wrap-break-word ${textClassName} ${className}`}
    >
      {value || placeholder}
    </span>
  );
}
