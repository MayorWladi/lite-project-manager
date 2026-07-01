import { sileo } from 'sileo'
import type { Project } from "@/app/features/common/types"

export const handleAddProject = (
	newProjectName: string,
	addProject: (name: string) => Project
) => {
	if (!newProjectName.trim()) {
		sileo.warning({ title: 'Nombre requerido', description: 'Escribe un nombre para el proyecto.' })
		return
	}
	const project = addProject(newProjectName)
	sileo.success({ title: 'Proyecto creado', description: `"${project.name}" agregado.` })
}

export const handleDeleteProject = (
	id: number,
	name: string,
	deleteProject: (id: number) => void
) => {
	sileo.action({
		title: `¿Eliminar "${name}"?`,
		description: 'Esta acción no se puede deshacer.',
		button: {
			title: 'Eliminar',
			onClick: () => {
				deleteProject(id)
				sileo.error({ title: 'Eliminado', description: `Proyecto "${name}" eliminado.` })
			},
		},
	})
}