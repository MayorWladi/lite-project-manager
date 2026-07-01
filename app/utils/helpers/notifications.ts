import { sileo } from 'sileo';

export type NotificationType = 'success' | 'info' | 'error' | 'warning';

// Wrapper para notificaciones de sileo y futuros efectos de sonido
export const notify = (title: string, description?: string, type: NotificationType = 'success') => {
	// Aquí se podrá añadir lógica para reproducir sonidos en el futuro
	// ej: if (type === 'success') playSuccessSound();

	sileo[type]({
		title,
		description,
		position: 'top-center',
		duration: 4500,
		styles: {
			description: 'text-foreground! font-medium! tracking-tight! opacity-90! text-center!',
		}
	});
};

export const notifyTaskAdded = (t: (key: string) => string, taskName: string) => {
	notify(t('notif_task_added'), `${t('notif_task_added_desc')} "${taskName}"`, 'success');
};

export const notifyTaskCompleted = (t: (key: string) => string, taskName: string, isCompleted: boolean) => {
	if (isCompleted) {
		notify(t('notif_task_done'), `"${taskName}" ${t('notif_task_done_desc')}`, 'success');
	} else {
		notify(t('notif_task_undone'), `"${taskName}" ${t('notif_task_undone_desc')}`, 'info');
	}
};

export const notifyTaskDeleted = (t: (key: string) => string) => {
	notify(t('notif_task_deleted'), t('notif_task_deleted_desc'), 'warning');
};

export const notifyActivityError = (t: (key: string) => string) => {
	notify(t('notif_error_title'), t('notif_error_desc'), 'error');
};
