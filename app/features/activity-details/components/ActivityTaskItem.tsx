// /app/components/ActivityTaskItem.tsx
"use client";

import { useState, memo } from "react";
import { Task } from "@/app/features/common/types";

// --- CONFIGURACIÓN PREDETERMINADA (se puede sobrescribir vía props) ---
const DEFAULT_AUDIO_PATHS = [
  "/fxs/scrach_1.wav",
  "/fxs/scrach_2.wav",
  "/fxs/scrach_3.wav",
];
const DEFAULT_VOLUME_RANGE = [0.05, 0.08, 0.1]; // tres valores de ejemplo

interface ActivityTaskItemProps {
  task: Task;
  onToggle: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onRename: (newTitle: string) => void;
  // Nuevas props opcionales para sonidos
  audioPaths?: string[];
  volumeRange?: number[];
}

const ActivityTaskItem = memo(function ActivityTaskItem({
  task,
  onToggle,
  onDelete,
  onRename,
  audioPaths = DEFAULT_AUDIO_PATHS,
  volumeRange = DEFAULT_VOLUME_RANGE,
}: ActivityTaskItemProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(task.title);

  // --- Función para elegir un elemento aleatorio de un array ---
  const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Elegir un sonido aleatorio
    const selectedPath = pickRandom(audioPaths);
    // Elegir un volumen aleatorio del rango
    const selectedVolume = pickRandom(volumeRange);

    const audio = new Audio(selectedPath);
    audio.volume = selectedVolume;
    audio.play().catch(() => { /* silenciar errores */ });

    // Llamar a la función original del contexto
    onToggle(e);
  };

  return (
    <div
      className={`
        flex items-start gap-2 group/task
        transition-opacity duration-300
        /* Efecto spotlight: se atenúa cuando el contenedor .group/tasklist está en hover */
        group-hover/tasklist:opacity-50
        /* Al hacer hover en esta tarea, recupera opacidad completa */
        hover:opacity-100
      `}
    >
      {/* Botón de check / unchecked */}
      <button
        type="button"
        onClick={handleToggle}
        className="mt-0.5 shrink-0 text-(--color-muted) hover:text-foreground"
      >
        {task.isCompleted ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
          </svg>
        )}
      </button>

      {/* Título de la tarea (con edición inline) */}
      {isRenaming ? (
        <textarea
          value={renameValue}
          onChange={(e) => {
            setRenameValue(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onFocus={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onBlur={() => {
            if (renameValue.trim() && renameValue.trim() !== task.title) {
              onRename(renameValue.trim());
            }
            setIsRenaming(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.blur();
            }
            if (e.key === 'Escape') {
              setIsRenaming(false);
              setRenameValue(task.title);
            }
          }}
          autoFocus
          rows={1}
          className="text-xs flex-1 bg-transparent border-b border-(--color-border) outline-none resize-none overflow-hidden py-0"
        />
      ) : (
        <span
          onDoubleClick={() => {
            // ✅ No permitir editar si la tarea está completada
            if (task.isCompleted) return;
            setIsRenaming(true);
            setRenameValue(task.title);
          }}
          className={`text-xs flex-1 min-w-0 select-none cursor-default transition-all duration-300 ease-in-out wrap-break-word whitespace-pre-wrap
            ${task.isCompleted
              ? "text-(--color-muted) line-through decoration-current decoration-1 underline-offset-2"
              : "text-foreground"
            }`}
        >
          {task.title}
        </span>
      )}

      {/* Botón de eliminar (visible solo al hacer hover en la tarea) */}
      <button
        onClick={onDelete}
        className="opacity-0 group-hover/task:opacity-100 text-(--color-muted) hover:text-[#9F2F2D] transition-opacity"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  );
});

export default ActivityTaskItem;