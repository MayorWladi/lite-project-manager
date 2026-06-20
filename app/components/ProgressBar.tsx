// /app/components/ProgressBar.tsx
"use client";

export default function ProgressBar({ percentage }: { percentage: number }) {
	return (
		<div className="flex items-center gap-3 w-48">
			<div className="flex-1 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
				<div
					className="h-full bg-(--foreground) transition-all duration-500 ease-out"
					style={{ width: `${percentage}%` }}
				/>
			</div>
			<span className="text-[10px] font-mono font-medium text-(--color-muted) w-6 text-right">
				{percentage}%
			</span>
		</div>
	);
}