import { sileo } from 'sileo'
import type { Project } from '@/app/types'

export const handleAddActivity = (
  selectedProjectId: number | null,
  newActivityName: string,
  addActivity: (projectId: number, activityName: string) => Project | undefined
) => {
  if (!selectedProjectId) {
    sileo.info({ title: 'Selecciona un proyecto', description: 'Primero elige un proyecto para agregar actividad.' })
    return
  }
  if (!newActivityName.trim()) {
    sileo.warning({ title: 'Actividad vacía', description: 'Escribe el nombre de la actividad.' })
    return
  }
  const project = addActivity(selectedProjectId, newActivityName)
  if (project) {
    sileo.success({ title: 'Actividad agregada', description: `"${newActivityName}" añadida a "${project.name}".` })
  }
}

export const handleDeleteActivity = (
  projectId: number,
  index: number,
  activityName: string,
  deleteActivity: (projectId: number, index: number) => void
) => {
  deleteActivity(projectId, index)
  sileo.info({ title: 'Actividad eliminada', description: `"${activityName}" removida.` })
}

export const handleAsyncTask = () => {
  const promise = new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.3) {
        resolve('Tarea completada con éxito')
      } else {
        reject(new Error('Algo salió mal'))
      }
    }, 2000)
  })

  sileo.promise(promise, {
    loading: { title: 'Procesando...', description: 'Espera un momento.' },
    success: (data) => ({ title: '¡Éxito!', description: data }),
    error: (err) => ({ title: 'Error', description: err instanceof Error ? err.message : 'Error desconocido' }),
  })
}