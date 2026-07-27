"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo, useCallback } from "react";
import { THEMES, ThemeType } from "@/app/common/constants/themes";
import { safeGetItem, safeSetItem } from "@/app/utils/storage/core";

export type FontType = "quicksand" | "comfortaa" | "dm-sans" | "mono";

interface SettingsContextType {
	theme: ThemeType;
	setTheme: (theme: ThemeType) => void;
	font: FontType;
	setFont: (font: FontType) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<ThemeType>("light");
	const [font, setFontState] = useState<FontType>("dm-sans");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const savedTheme = safeGetItem("kanban-theme") as ThemeType | null;
		const savedFont = safeGetItem("kanban-font") as FontType | null;

		if (savedTheme) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setThemeState(savedTheme);
		} else {
			const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
			 
			setThemeState(prefersDark ? "dark" : "light");
		}

		if (savedFont) {
			setFontState(savedFont);
		}

		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;

		const root = document.documentElement;
		// Quitar cualquier clase previa relacionada con temas
		const currentThemeClasses = Array.from(root.classList).filter(cls => cls.startsWith('theme-'));
		root.classList.remove(...currentThemeClasses, "dark");
		
		// Agregar la nueva clase del tema
		root.classList.add(`theme-${theme}`);
		
		// Agregar la clase 'dark' si el tema es de naturaleza oscura (para variantes dark:)
		const themeConfig = THEMES.find(t => t.id === theme);
		if (themeConfig?.isDark) {
			root.classList.add("dark");
		}
	}, [theme, mounted]);

	useEffect(() => {
		if (!mounted) return;

		const body = document.body;
		const currentFontClasses = Array.from(body.classList).filter(cls => cls.startsWith('font-'));
		body.classList.remove(...currentFontClasses);
		body.classList.add(`font-${font}`);
	}, [font, mounted]);


	const setTheme = useCallback((newTheme: ThemeType) => {
		setThemeState(newTheme);
		safeSetItem("kanban-theme", newTheme);
	}, []);

	const setFont = useCallback((newFont: FontType) => {
		setFontState(newFont);
		safeSetItem("kanban-font", newFont);
	}, []);

	const contextValue = useMemo(() => ({
		theme, setTheme, font, setFont
	}), [theme, font, setTheme, setFont]);

	// Prevenimos renderizado del children hasta que se monte para evitar desajuste de hidratación (flickering de fuentes y colores)
	if (!mounted) {
		return <div style={{ visibility: "hidden" }}>{children}</div>;
	}

	return (
		<SettingsContext.Provider value={contextValue}>
			<div className={`font-${font}`}>
				{children}
			</div>
		</SettingsContext.Provider>
	);
}

export function useSettings() {
	const context = useContext(SettingsContext);
	if (context === undefined) {
		throw new Error("useSettings must be used within a SettingsProvider");
	}
	return context;
}
