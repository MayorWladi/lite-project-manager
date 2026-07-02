import React from "react";

export type ThemeType = string;

export interface ThemeConfig {
  id: ThemeType;
  name: {
    en: string;
    es: string;
  };
  isDark: boolean; // Controla si se inyecta la clase 'dark' para Tailwind
  icon: React.ReactNode;
}

export const THEMES: ThemeConfig[] = [
  {
    id: "light",
    name: { en: "Light", es: "Claro" },
    isDark: false,
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="5" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        />
      </svg>
    ),
  },
  {
    id: "matcha",
    name: { en: "Matcha", es: "Matcha" },
    isDark: false,
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    ),
  },
  {
    id: "honey",
    name: { en: "Honey", es: "Miel" },
    isDark: false,
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="8" y="6" width="8" height="12" rx="4" />
        <path d="M8 10h8" />
        <path d="M8 14h8" />
        <path d="M12 18v3" />
        <path d="M10 6V4" />
        <path d="M14 6V4" />
        <path d="M8 10c-3 0-5-2-5-4 2 0 5 2 5 4Z" />
        <path d="M16 10c3 0 5-2 5-4-2 0-5 2-5 4Z" />
      </svg>
    ),
  },
  {
    id: "dark",
    name: { en: "Dark", es: "Oscuro" },
    isDark: true,
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
  {
    id: "espresso",
    name: { en: "Espresso", es: "Café" },
    isDark: true,
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
        <line x1="6" x2="6" y1="2" y2="4" />
        <line x1="10" x2="10" y1="2" y2="4" />
        <line x1="14" x2="14" y1="2" y2="4" />
      </svg>
    ),
  },
  {
    id: "midnight",
    name: { en: "Midnight", es: "Medianoche" },
    isDark: true,
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        <path d="M19 3v4" />
        <path d="M21 5h-4" />
      </svg>
    ),
  },
];
