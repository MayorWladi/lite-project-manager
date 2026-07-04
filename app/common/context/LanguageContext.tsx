// /app/context/LanguageContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { safeGetItem, safeSetItem } from "@/app/utils/storage/core";
import { DICTIONARY } from "./dictionary";

type Language = "en" | "es";

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
		const savedLang = safeGetItem("kanban-lang") as Language | null;
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

	const setLanguage = useCallback((lang: Language) => {
		setLanguageState(lang);
		safeSetItem("kanban-lang", lang);
	}, []);

	const t = useCallback((key: keyof typeof DICTIONARY): string => {
		if (!mounted) return DICTIONARY[key]?.en || key as string; 
		return DICTIONARY[key]?.[language] || key as string;
	}, [mounted, language]);

	const contextValue = useMemo(() => ({
		language, setLanguage, t
	}), [language, setLanguage, t]);

	return (
		<LanguageContext.Provider value={contextValue}>
			{children}
		</LanguageContext.Provider>
	);
}

export function useLanguage() {
	const context = useContext(LanguageContext);
	if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
	return context;
}
