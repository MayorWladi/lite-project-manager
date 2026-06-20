// /app/components/KanbanColumn.tsx (Versión simplificada solo para títulos)
interface KanbanColumnProps {
	title: string;
}

export default function KanbanColumn({ title }: KanbanColumnProps) {
	return (
		<div className="w-[280px] shrink-0 px-1">
			<h3 className="font-editorial text-xl tracking-tight text-[var(--foreground)]">
				{title}
			</h3>
		</div>
	);
}