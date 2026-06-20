// /app/components/TaskCard.tsx
"use client";

import { Task } from "@/app/types";

export default function TaskCard({ task }: { task: Task }) {
	return (
		<div className="bg-[var(--background)] border border-[var(--color-border)] rounded-xl p-3 flex flex-col gap-2 hover:border-[var(--color-muted)] transition-colors cursor-grab active:cursor-grabbing select-none shadow-sm group">
			<div className="flex justify-between items-start">
				<h4 className="font-semibold text-sm text-[var(--foreground)] leading-tight group-hover:text-accent-purple transition-colors">
					{task.title}
				</h4>
			</div>

			{task.description && (
				<p className="text-xs text-[var(--color-muted)] line-clamp-2 leading-relaxed">
					{task.description}
				</p>
			)}

			{/* Etiqueta del ID para darle un toque más técnico/Jira */}
			<div className="mt-1 flex">
				<span className="text-[9px] font-mono font-medium bg-black/5 dark:bg-white/10 text-[var(--color-muted)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">
					{task.id.split('-')[0].toUpperCase()}
				</span>
			</div>
		</div>
	);
}