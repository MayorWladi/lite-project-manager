// /app/components/ProgressBar.tsx
"use client";

import { useState, useRef } from "react";

export type StatItem = { label: string; value: string | number } | 'divider';

interface ProgressBarProps {
	percentage: number;
	label?: string;
	displayValue?: string;
	variant?: 'inline' | 'stacked';
	className?: string;
	tooltipPosition?: 'top' | 'bottom';
	tooltipTitle?: string;
	tooltipStats?: StatItem[];
}

export default function ProgressBar({
	percentage,
	label,
	displayValue,
	variant = 'inline',
	className = "",
	tooltipPosition = 'bottom',
	tooltipTitle,
	tooltipStats
}: ProgressBarProps) {
	const [showTooltip, setShowTooltip] = useState(false);
	const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const hasTooltip = tooltipTitle || (tooltipStats && tooltipStats.length > 0);
	const valueText = displayValue !== undefined ? displayValue : `${Math.round(percentage)}%`;

	return (
		<div
			className={`relative group ${className} ${hasTooltip ? 'cursor-help' : ''}`}
			onTouchStart={() => { if (hasTooltip) longPressTimer.current = setTimeout(() => setShowTooltip(true), 400); }}
			onTouchEnd={() => { if (longPressTimer.current) clearTimeout(longPressTimer.current); }}
			onClick={() => hasTooltip && setShowTooltip(v => !v)}
			onMouseLeave={() => setShowTooltip(false)}
		>
			{/* Variante para el Storage */}
			{variant === 'stacked' && (
				<div className="flex flex-col gap-1.5 w-full">
					<div className="flex justify-between items-center text-[10px] text-(--color-muted) uppercase tracking-wider font-medium">
						{label && <span>{label}</span>}
						<span>{valueText}</span>
					</div>
					<div className="h-1.5 w-full bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
						<div className="h-full bg-foreground rounded-full transition-all duration-500 ease-out" style={{ width: `${percentage}%` }} />
					</div>
				</div>
			)}

			{/* Variante para el Sprint */}
			{variant === 'inline' && (
				<div className="flex items-center gap-3 w-full">
					<div className="flex-1 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
						<div
							className="h-full bg-foreground transition-all duration-500 ease-out"
							style={{ width: `${percentage}%` }}
						/>
					</div>
					<span className="text-[10px] font-mono font-medium text-(--color-muted) w-6 text-right shrink-0">
						{valueText}
					</span>
				</div>
			)}

			{/* Tooltip Dinámico */}
			{hasTooltip && (
				<div className={`absolute z-50 bg-(--color-card-bg) border border-(--color-border) rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] p-3 min-w-[180px] pointer-events-none transition-all duration-200 ${showTooltip ? 'opacity-100 visible' : 'opacity-0 invisible'} md:group-hover:opacity-100 md:group-hover:visible
					${tooltipPosition === 'bottom' ? 'right-0 top-full mt-2' : 'left-1/2 -translate-x-1/2 bottom-full mb-2'}
				`}>
					<div className="flex flex-col gap-2">
						{tooltipTitle && <h4 className="text-xs font-bold text-foreground">{tooltipTitle}</h4>}

						{tooltipStats?.map((stat, i) => {
							if (stat === 'divider') {
								return <div key={`div-${i}`} className="h-px bg-(--color-border) w-full my-0.5" />;
							}
							return (
								<div key={i} className="flex justify-between items-center text-xs gap-4">
									<span className="text-(--color-muted)">{stat.label}</span>
									<span className="font-mono text-foreground font-medium">{stat.value}</span>
								</div>
							);
						})}
					</div>
					{/* Flecha del Tooltip */}
					<div className={`absolute w-3 h-3 bg-(--color-card-bg) border-(--color-border) rotate-45
						${tooltipPosition === 'bottom'
							? 'right-6 -top-1.5 border-l border-t'
							: 'left-1/2 -translate-x-1/2 -bottom-1.5 border-r border-b'
						}
					`} />
				</div>
			)}
		</div>
	);
}