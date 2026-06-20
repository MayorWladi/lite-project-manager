// /app/components/TaskCard.tsx
"use client";

import { Task } from "@/app/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export default function TaskCard({ task }: { task: Task }) {
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
		id: task.id,
		data: { task }, // Pasamos la tarea para usarla en el DragOverlay
	});

	const style = {
		transform: CSS.Translate.toString(transform),
		opacity: isDragging ? 0.4 : 1,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			className={`bg-[var(--background)] border rounded-xl p-3 flex flex-col gap-2 transition-colors cursor-grab active:cursor-grabbing select-none shadow-sm group
        ${isDragging ? 'border-dashed border-[var(--color-muted)]' : 'border-[var(--color-border)] hover:border-[var(--color-muted)]'}
      `}
		>
			<div className="flex justify-between items-start">
				<h4 className="font-semibold text-sm text-[var(--foreground)] leading-tight group-hover:text-[var(--color-muted)] transition-colors">
					{task.title}
				</h4>
			</div>

			{task.description && (
				<p className="text-xs text-[var(--color-muted)] line-clamp-2 leading-relaxed">
					{task.description}
				</p>
			)}

			<div className="mt-1 flex">
				<span className="text-[9px] font-mono font-medium bg-black/5 dark:bg-white/10 text-[var(--color-muted)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">
					{task.id.split('-')[0].toUpperCase()}
				</span>
			</div>
		</div>
	);
}