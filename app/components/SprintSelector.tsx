// /app/components/SprintSelector.tsx
"use client";

import { useState } from "react";
import { Sprint } from "@/app/types";

interface SprintSelectorProps {
	sprints: Sprint[];
	selectedSprintId: string | null;
	onSelectSprint: (id: string) => void;
	onAddSprint: (name: string) => void;
}

export default function SprintSelector({ sprints, selectedSprintId, onSelectSprint, onAddSprint }: SprintSelectorProps) {
	const [isAdding, setIsAdding] = useState(false);
	const [newSprintName, setNewSprintName] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (newSprintName.trim()) {
			onAddSprint(newSprintName.trim());
			setNewSprintName("");
			setIsAdding(false);
		}
	};

	return (
		<div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-3 mb-6 overflow-x-auto scrollbar-hide">
			{sprints.map((sprint) => (
				<button
					key={sprint.id}
					onClick={() => onSelectSprint(sprint.id)}
					className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${selectedSprintId === sprint.id
							? "bg-[var(--foreground)] text-[var(--background)] shadow-sm"
							: "text-[var(--color-muted)] hover:bg-black/5 dark:hover:bg-white/10 hover:text-[var(--foreground)]"
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
						className="px-3 py-1.5 bg-transparent border border-[var(--color-border)] rounded-md text-sm outline-none transition-colors focus:border-[var(--color-muted)] text-[var(--foreground)] w-48"
						onBlur={() => setIsAdding(false)}
					/>
				</form>
			) : (
				<button
					onClick={() => setIsAdding(true)}
					className="ml-1 px-3 py-1.5 rounded-md text-sm font-medium text-[var(--color-muted)] border border-dashed border-[var(--color-border)] hover:border-[var(--color-muted)] hover:text-[var(--foreground)] transition-colors flex items-center gap-1.5 whitespace-nowrap"
				>
					<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
					</svg>
					Nuevo Sprint
				</button>
			)}
		</div>
	);
}