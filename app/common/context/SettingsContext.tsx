"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeType = "light" | "dark";
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
		const savedTheme = localStorage.getItem("kanban-theme") as ThemeType | null;
		const savedFont = localStorage.getItem("kanban-font") as FontType | null;

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
		if (theme === "dark") {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}
		localStorage.setItem("kanban-theme", theme);
	}, [theme, mounted]);

	useEffect(() => {
		if (!mounted) return;
		localStorage.setItem("kanban-font", font);
	}, [font, mounted]);

	const setTheme = (newTheme: ThemeType) => setThemeState(newTheme);
	const setFont = (newFont: FontType) => setFontState(newFont);

	// Prevenimos renderizado del children hasta que se monte para evitar desajuste de hidratación (flickering de fuentes y colores)
	if (!mounted) {
		return <div style={{ visibility: "hidden" }}>{children}</div>;
	}

	return (
		<SettingsContext.Provider value={{ theme, setTheme, font, setFont }}>
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
