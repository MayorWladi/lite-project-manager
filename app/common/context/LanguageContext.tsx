// /app/context/LanguageContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "es";

interface Translations {
	[key: string]: {
		en: string;
		es: string;
	};
}

const DICTIONARY: Translations = {
	projects: { en: "Projects", es: "Proyectos" },
	no_projects: { en: "No projects yet.", es: "No hay proyectos aún." },
	new_project: { en: "New Project", es: "Nuevo Proyecto" },
	project_placeholder: { en: "Ex: Web Redesign...", es: "Ej: Rediseño Web..." },
	settings: { en: "Settings", es: "Ajustes" },

	select_project_msg: { en: "Select or create a project from the sidebar", es: "Selecciona o crea un proyecto de la barra lateral" },
	no_sprints_yet: { en: "This project has no sprints yet.", es: "Este proyecto aún no tiene sprints." },
	create_sprint_msg: { en: "Use the button above to create a new one.", es: "Utiliza el botón de arriba para crear uno nuevo." },
	new_sprint: { en: "New Sprint", es: "Nuevo Sprint" },
	sprint_placeholder: { en: "Sprint name...", es: "Nombre del sprint..." },

	add_activity: { en: "Add Activity", es: "Añadir Actividad" },
	new_activity_placeholder: { en: "New activity name...", es: "Nombre de la nueva actividad..." },
	no_activities_here: { en: "No activities here", es: "Sin actividades aquí" },
	add: { en: "Add", es: "Añadir" },

	checklist: { en: "Checklist", es: "Checklist" },
	add_task: { en: "Add task", es: "Añadir tarea" },
	new_task_placeholder: { en: "New task...", es: "Nueva tarea..." },

	drop_here: { en: "Drop here", es: "Suelta aquí" },
	add_activity_here: { en: "+ Add activity", es: "+ Añadir actividad" },

	appearance: { en: "Appearance", es: "Apariencia" },
	theme: { en: "Theme", es: "Tema" },
	light: { en: "Light", es: "Claro" },
	dark: { en: "Dark", es: "Oscuro" },
	font: { en: "Font", es: "Tipografía" },
	language: { en: "Language", es: "Idioma" },
	english: { en: "English", es: "Inglés" },
	spanish: { en: "Spanish", es: "Español" },

	information: { en: "Information", es: "Información" },
	user_guide: { en: "User Guide", es: "Guía de Uso" },
	collaborators: { en: "Collaborators", es: "Colaboradores" },
	guide_desc: { en: "Learn how to use Lite Project Manager efficiently.", es: "Aprende a usar Lite Project Manager de forma eficiente." },
	credits_desc: { en: "The people who made this possible.", es: "Las personas que hicieron esto posible." },

	danger_zone: { en: "Danger Zone", es: "Zona de Peligro" },
	delete_all_data: { en: "Delete All Data", es: "Borrar Todos los Datos" },
	delete_warning: { en: "This will permanently delete all your projects, sprints, and tasks.", es: "Esto eliminará permanentemente todos tus proyectos, sprints y tareas." },
	
	col_todo: { en: "To Do", es: "Por Hacer" },
	col_working: { en: "In Progress", es: "En Progreso" },
	col_review: { en: "Review", es: "Revisión" },
	col_dropped: { en: "Dropped", es: "Descartado" },
	col_done: { en: "Done", es: "Terminado" },

	done: { en: "Done", es: "Listo" },

	rename: { en: "Rename", es: "Renombrar" },
	delete_item: { en: "Delete", es: "Eliminar" },
	cancel: { en: "Cancel", es: "Cancelar" },
	save: { en: "Save", es: "Guardar" },
	rename_placeholder: { en: "New name...", es: "Nuevo nombre..." },

	// Missing Translations
	description: { en: "Description", es: "Descripción" },
	add_note: { en: "Add note...", es: "Agregar nota..." },
	new_project_placeholder: { en: "New project", es: "Nuevo proyecto" },
	delete_project_title: { en: 'Delete "{{name}}"?', es: '¿Eliminar "{{name}}"?'},
	grid_2x2: { en: "Switch to 2x2 grid", es: "Cambiar a grid 2x2" },
	grid_list: { en: "Switch to list view", es: "Cambiar a lista" },
	current_status: { en: "Current status:", es: "Estado actual:" },
	created_on: { en: "Created on", es: "Creada el" },
	info_create: { en: "Create projects and sprints from the sidebar.", es: "Crea proyectos y sprints desde la barra lateral." },
	info_drag: { en: "Add activities and drag them between columns.", es: "Añade actividades y arrástralas entre columnas." },
	info_tasks: { en: "Click on an activity to add tasks (checklist).", es: "Haz clic en una actividad para añadir tareas (checklist)." },
	info_rules: { en: "You cannot move an activity to 'Review' or 'Done' if it has incomplete tasks.", es: "No puedes mover una actividad a 'Revisión' o 'Terminado' si tiene tareas sin completar." },
	type_name: { en: "Type the name...", es: "Escribe el nombre..." },
	create: { en: "Create", es: "Crear" },

	// Tutorial Translations
	tut_step1_title: { en: "1. Create Projects", es: "1. Crea Proyectos" },
	tut_step1_desc: { en: "Start by creating a project and adding sprints from the left sidebar.", es: "Comienza creando un proyecto y añadiendo sprints desde la barra lateral." },
	tut_step2_title: { en: "2. The Kanban Board", es: "2. El Tablero Kanban" },
	tut_step2_desc: { en: "Visualize your workflow. Add activities to the columns.", es: "Visualiza tu flujo de trabajo. Añade actividades a las columnas." },
	tut_step3_title: { en: "3. Drag and Drop", es: "3. Arrastrar y Soltar" },
	tut_step3_desc: { en: "Move activities easily between statuses as your work progresses.", es: "Mueve actividades fácilmente entre estados conforme avanzas." },
	tut_step4_title: { en: "4. Checklists & Details", es: "4. Checklists y Detalles" },
	tut_step4_desc: { en: "Click on any activity to open its side panel and break it down into tasks.", es: "Haz clic en cualquier actividad para abrir su panel y desglosarla en tareas." },
	tut_next: { en: "Next", es: "Siguiente" },
	tut_prev: { en: "Back", es: "Atrás" },
	tut_finish: { en: "Got it!", es: "¡Entendido!" }
};

interface LanguageContextType {
	language: Language;
	setLanguage: (lang: Language) => void;
	t: (key: keyof typeof DICTIONARY) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
	const [language, setLanguageState] = useState<Language>("en");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const savedLang = localStorage.getItem("kanban-lang") as Language | null;
		if (savedLang) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setLanguageState(savedLang);
		} else {
			// Auto detect browser language
			const browserLang = navigator.language.split('-')[0];
			if (browserLang === 'es') {
				 
				setLanguageState("es");
			} else {
				 
				setLanguageState("en");
			}
		}
		setMounted(true);
	}, []);

	const setLanguage = (lang: Language) => {
		setLanguageState(lang);
		localStorage.setItem("kanban-lang", lang);
	};

	const t = (key: keyof typeof DICTIONARY): string => {
		// NOTA (Anti-Hydration Mismatch):
		// Durante SSR y el primer render del cliente, `mounted` es false y devolvemos siempre 'en'.
		// Esto evita que React tire un error si el servidor renderiza en inglés pero el cliente local tiene español.
		// El "costo" es un leve parpadeo (FOUC) de inglés a español en la primera carga para usuarios de habla hispana,
		// lo cual es un compromiso aceptable para una PWA puramente estática sin middleware de cookies.
		if (!mounted) return DICTIONARY[key]?.en || key as string; // SSR fallback
		return DICTIONARY[key]?.[language] || key as string;
	};

	return (
		<LanguageContext.Provider value={{ language, setLanguage, t }}>
			{children}
		</LanguageContext.Provider>
	);
}

export function useLanguage() {
	const context = useContext(LanguageContext);
	if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
	return context;
}
