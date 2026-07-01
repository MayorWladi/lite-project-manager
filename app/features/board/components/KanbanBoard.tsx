"use client";

import { Sprint, TaskStatus } from "@/app/features/common/types";
import { useLanguage } from "@/app/features/common/context/LanguageContext";
import { useKanbanBoard } from "@/app/features/board/hooks/useKanbanBoard";
import KanbanBoardMobile from "@/app/features/board/components/KanbanBoardMobile";
import KanbanBoardDesktop from "@/app/features/board/components/KanbanBoardDesktop";

export const getColumns = (t: (k: string) => string): { id: TaskStatus; title: string }[] => [
	{ id: "todo", title: t("col_todo") },
	{ id: "working", title: t("col_working") },
	{ id: "review", title: t("col_review") },
	{ id: "dropped", title: t("col_dropped") },
	{ id: "done", title: t("col_done") },
];

export default function KanbanBoard({ sprint }: { sprint: Sprint }) {
	const { t } = useLanguage();
	const boardState = useKanbanBoard(sprint, t);

	return (
		<>
			<KanbanBoardMobile
				sprint={sprint}
				localActivities={boardState.localActivities}
				mobileActiveColumn={boardState.mobileActiveColumn}
				setMobileActiveColumn={boardState.setMobileActiveColumn}
				handleMobileStatusChange={boardState.handleMobileStatusChange}
				columns={boardState.COLUMNS}
			/>

			<KanbanBoardDesktop
				sprint={sprint}
				localActivities={boardState.localActivities}
				activeActivity={boardState.activeActivity}
				columns={boardState.COLUMNS}
				sensors={boardState.sensors}
				handleDragStart={boardState.handleDragStart}
				handleDragOver={boardState.handleDragOver}
				handleDragEnd={boardState.handleDragEnd}
			/>
		</>
	);
}