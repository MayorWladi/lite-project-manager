// /app/components/SprintSelector.tsx
"use client";

import { useCallback } from "react";
import { Sprint } from "@/app/common/types";
import { useSprintMetrics, useProjectsManager } from "@/app/common/context/ProjectContext";
import { useLanguage } from "@/app/common/context/LanguageContext";
import ProgressBar from "@/app/common/components/ProgressBar";
import SprintTab from "@/app/features/board/components/SprintTab";
import AddSprintForm from "@/app/features/board/components/AddSprintForm";

interface SprintSelectorProps {
	sprints: Sprint[];
	activeSprint: Sprint | undefined;
	onSelectSprint: (id: string) => void;
	onAddSprint: (name: string) => void;
}

export default function SprintSelector({ sprints, activeSprint, onSelectSprint, onAddSprint }: SprintSelectorProps) {
	const { t } = useLanguage();
	const { selectedProjectId, renameSprint, deleteSprint } = useProjectsManager();
	const metrics = useSprintMetrics(activeSprint);

	const handleRenameSprint = useCallback((sprintId: string, newName: string) => {
		if (selectedProjectId) {
			renameSprint(selectedProjectId, sprintId, newName);
		}
	}, [selectedProjectId, renameSprint]);

	const handleDeleteSprint = useCallback((sprintId: string) => {
		if (selectedProjectId) {
			deleteSprint(selectedProjectId, sprintId);
			// Seleccionar automáticamente otro sprint si el activo fue eliminado
			const remaining = sprints.filter(s => s.id !== sprintId);
			if (remaining.length > 0 && activeSprint?.id === sprintId) {
				onSelectSprint(remaining[0].id);
			}
		}
	}, [selectedProjectId, deleteSprint, sprints, activeSprint, onSelectSprint]);

	return (
		<div className="flex items-center border-b border-(--color-border) pb-2 md:pb-3 mb-3 md:mb-6 relative">
			<div className="hidden md:block flex-1" />

			<div className="flex flex-wrap items-center gap-2 shrink-0 md:justify-center md:max-w-[calc(100%-100px)] px-0 md:px-2 relative">
				{sprints.map((sprint) => (
					<SprintTab
						key={sprint.id}
						sprint={sprint}
						isActive={activeSprint?.id === sprint.id}
						onSelect={() => onSelectSprint(sprint.id)}
						onRename={handleRenameSprint}
						onDelete={handleDeleteSprint}
						t={t}
					/>
				))}

				<AddSprintForm
					onAdd={onAddSprint}
					placeholderText={t("sprint_placeholder")}
					buttonText={t("new_sprint")}
				/>
			</div>

			<div className="hidden md:flex justify-end flex-1 shrink-0">
				{activeSprint && (
					<ProgressBar
						percentage={metrics.percentage}
						variant="inline"
						className="w-48"
						tooltipPosition="bottom"
						tooltipTitle="Progreso del Sprint"
						tooltipStats={
							metrics.total !== undefined && metrics.done !== undefined ? [
								{ label: "Completadas", value: metrics.done },
								{ label: "Pendientes", value: metrics.total - metrics.done },
								'divider',
								{ label: "Total", value: `${metrics.total} actividades` },
							] : []
						}
					/>
				)}
			</div>
		</div>
	);
}