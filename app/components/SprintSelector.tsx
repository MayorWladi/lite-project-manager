// /app/components/SprintSelector.tsx
"use client";

import { useState } from "react";
import { Sprint } from "@/app/types";
import { useSprintMetrics } from "@/app/context/ProjectContext";
import ProgressBar from "./ProgressBar";

interface SprintSelectorProps {
	sprints: Sprint[];
	activeSprint: Sprint | undefined;
	onSelectSprint: (id: string) => void;
	onAddSprint: (name: string) => void;
}

export default function SprintSelector({ sprints, activeSprint, onSelectSprint, onAddSprint }: SprintSelectorProps) {
	const [isAdding, setIsAdding] = useState(false);
	const [newSprintName, setNewSprintName] = useState("");

	const metrics = useSprintMetrics(activeSprint);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (newSprintName.trim()) {
			onAddSprint(newSprintName.trim());
			setNewSprintName("");
			setIsAdding(false);
		}
	};

	return (
		<div className="flex items-center justify-between border-b border-(--color-border) pb-3 mb-6">
			<div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
				{sprints.map((sprint) => (
					<button
						key={sprint.id}
						onClick={() => onSelectSprint(sprint.id)}
						className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeSprint?.id === sprint.id
							? "bg-(--foreground) text-(--background) shadow-sm"
							: "text-(--color-muted) hover:bg-black/5 dark:hover:bg-white/10 hover:text-(--foreground)"
							}`}
					>
						{sprint.name}
					</button>
				))}

				{isAdding ? (
					<form onSubmit={handleSubmit} className="flex items-center gap-2 ml-1">
						<input
							type="text"
							autoFocus
							placeholder="Nombre del sprint..."
							value={newSprintName}
							onChange={(e) => setNewSprintName(e.target.value)}
							className="px-3 py-1.5 bg-transparent border border-(--color-border) rounded-md text-sm outline-none transition-colors focus:border-(--color-muted) text-(--foreground) w-48"
							onBlur={() => setIsAdding(false)}
						/>
					</form>
				) : (
					<button
						onClick={() => setIsAdding(true)}
						className="ml-1 px-3 py-1.5 rounded-md text-sm font-medium text-(--color-muted) border border-dashed border-(--color-border) hover:border-(--color-muted) hover:text-(--foreground) transition-colors flex items-center gap-1.5 whitespace-nowrap"
					>
						<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
						</svg>
						Nuevo Sprint
					</button>
				)}
			</div>

			{/* Renderizado de la barra de progreso */}
			{activeSprint && (
				<div className="hidden sm:block ml-4 shrink-0">
					<ProgressBar percentage={metrics.percentage} />
				</div>
			)}
		</div>
	);
}