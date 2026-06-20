import { sileo } from 'sileo';

export type NotificationType = 'success' | 'info' | 'error' | 'warning';

// Wrapper para notificaciones de sileo y futuros efectos de sonido
export const notify = (title: string, description?: string, type: NotificationType = 'success') => {
	// Aquí se podrá añadir lógica para reproducir sonidos en el futuro
	// ej: if (type === 'success') playSuccessSound();

	sileo[type]({
		title,
		description,
		position: 'bottom-right',
		duration: 3000,
	});
};

export const notifyTaskAdded = (taskName: string) => {
	notify('Tarea añadida', `Se ha añadido la tarea "${taskName}"`, 'success');
};

export const notifyTaskCompleted = (taskName: string, isCompleted: boolean) => {
	if (isCompleted) {
		notify('Tarea completada', `"${taskName}" ha sido marcada como completada`, 'success');
	} else {
		notify('Tarea desmarcada', `"${taskName}" ahora está pendiente`, 'info');
	}
};

export const notifyTaskDeleted = (taskName: string) => {
	notify('Tarea eliminada', `La tarea ha sido eliminada de la lista`, 'warning');
};

export const notifyActivityError = () => {
	notify('Acción no permitida', 'No puedes pasar a revisión o finalizar una actividad con tareas sin completar', 'error');
};
