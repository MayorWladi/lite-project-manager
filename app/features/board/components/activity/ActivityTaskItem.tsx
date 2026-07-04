// /app/components/ActivityTaskItem.tsx
"use client";

import { useState, memo } from "react";
import { Task } from "@/app/common/types";
import { Button } from "@/app/common/components/Button";
import { Textarea } from "@/app/common/components/Textarea";
import { CheckCircleIcon, CircleIcon, TrashIcon } from "@/app/common/components/Icons";

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
      <Button
        variant="icon"
        type="button"
        onClick={handleToggle}
        className="mt-0.5 shrink-0 p-0"
      >
        {task.isCompleted ? <CheckCircleIcon /> : <CircleIcon />}
      </Button>

      {/* Título de la tarea (con edición inline) */}
      {isRenaming ? (
        <Textarea
          variant="ghost"
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
          className="text-xs flex-1 resize-none overflow-hidden py-0 border-b border-(--color-border) rounded-none focus:border-(--color-muted)"
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
      <Button
        variant="icon"
        onClick={onDelete}
        className="opacity-0 group-hover/task:opacity-100 hover:text-red-500 p-0"
      >
        <TrashIcon width="12" height="12" />
      </Button>
    </div>
  );
});

export default ActivityTaskItem;