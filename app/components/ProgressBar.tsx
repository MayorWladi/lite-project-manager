// /app/components/ProgressBar.tsx
"use client";

import { useState, useRef } from "react";

interface ProgressBarProps {
	percentage: number;
	total?: number;
	done?: number;
}

export default function ProgressBar({ percentage, total, done }: ProgressBarProps) {
	const [showTooltip, setShowTooltip] = useState(false);
	const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const hasDetail = total !== undefined && done !== undefined;

	return (
		<div
			className="relative group flex items-center gap-3 w-48"
			onTouchStart={() => { longPressTimer.current = setTimeout(() => setShowTooltip(true), 400); }}
			onTouchEnd={() => { if (longPressTimer.current) clearTimeout(longPressTimer.current); }}
			onClick={() => hasDetail && setShowTooltip(v => !v)}
		>
			<div className="flex-1 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
				<div
					className="h-full bg-foreground transition-all duration-500 ease-out"
					style={{ width: `${percentage}%` }}
				/>
			</div>
			<span className="text-[10px] font-mono font-medium text-(--color-muted) w-6 text-right shrink-0">
				{percentage}%
			</span>

			{hasDetail && (
				<div className={`absolute right-0 top-full mt-2 z-50 bg-(--color-card-bg) border border-(--color-border) rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] p-3 min-w-[180px] pointer-events-none transition-all duration-200 ${showTooltip ? 'opacity-100 visible' : 'opacity-0 invisible'} md:group-hover:opacity-100 md:group-hover:visible`}>
					<div className="flex flex-col gap-2">
						<h4 className="text-xs font-bold text-foreground">Progreso del Sprint</h4>
						<div className="flex justify-between items-center text-xs">
							<span className="text-(--color-muted)">Completadas</span>
							<span className="font-mono text-foreground font-medium">{done}</span>
						</div>
						<div className="flex justify-between items-center text-xs">
							<span className="text-(--color-muted)">Pendientes</span>
							<span className="font-mono text-foreground font-medium">{total - done}</span>
						</div>
						<div className="h-px bg-(--color-border) w-full my-0.5" />
						<div className="flex justify-between items-center text-xs">
							<span className="text-(--color-muted)">Total</span>
							<span className="font-mono text-foreground font-medium">{total} actividades</span>
						</div>
					</div>
					<div className="absolute right-6 -top-1.5 w-3 h-3 bg-(--color-card-bg) border-l border-t border-(--color-border) rotate-45" />
				</div>
			)}
		</div>
	);
}