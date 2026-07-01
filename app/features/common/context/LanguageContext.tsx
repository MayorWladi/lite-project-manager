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
	rename_placeholder: { en: "New name...", es: "Nuevo nombre..." }
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
