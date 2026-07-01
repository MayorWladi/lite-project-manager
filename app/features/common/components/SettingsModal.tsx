"use client";

import React from "react";
import { useSettings, FontType } from "@/app/features/common/context/SettingsContext";
import { useLanguage } from "@/app/features/common/context/LanguageContext";
import Modal from "@/app/features/common/components/Modal"; // Ajusta esta ruta según donde guardes Modal.tsx

interface SettingsModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const FONTS: { id: FontType; name: string; class: string; description: { en: string; es: string } }[] = [
	{ id: "dm-sans", name: "DM Sans", class: "font-dm-sans", description: { en: "Minimal and warm. Excellent readability.", es: "Minimalista y cálida. Excelente legibilidad." } },
	{ id: "quicksand", name: "Quicksand", class: "font-quicksand", description: { en: "Soft and very rounded. Ultra relaxing.", es: "Suave y muy redondeada. Ultra relajante." } },
	{ id: "comfortaa", name: "Comfortaa", class: "font-comfortaa", description: { en: "Modern geometric. Zen app vibe.", es: "Geométrica moderna. Vibe de app zen." } },
	{ id: "mono", name: "JetBrains Mono", class: "font-mono", description: { en: "Retro code style. Lo-fi hip-hop radio.", es: "Estilo código retro. Lo-fi hip-hop radio." } },
];

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
	const { theme, setTheme, font, setFont } = useSettings();
	const { language, setLanguage, t } = useLanguage();

	return (
		<Modal isOpen={isOpen} onClose={onClose} title={t("settings")}>
			<div className="space-y-8">
				{/* Idioma */}
				<section>
					<h3 className="text-xs font-bold uppercase tracking-wider text-(--color-muted) mb-3">{t("language")}</h3>
					<div className="flex gap-3">
						<button
							onClick={() => setLanguage("en")}
							className={`flex-1 py-2.5 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all duration-200 ${language === "en"
								? "border-foreground bg-black/5 dark:bg-white/5 shadow-inner"
								: "border-(--color-border) hover:border-(--color-muted) text-(--color-muted)"
								}`}
						>
							<span className={`text-sm ${language === "en" ? "text-foreground font-medium" : ""}`}>{t("english")}</span>
						</button>
						<button
							onClick={() => setLanguage("es")}
							className={`flex-1 py-2.5 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all duration-200 ${language === "es"
								? "border-foreground bg-black/5 dark:bg-white/5 shadow-inner"
								: "border-(--color-border) hover:border-(--color-muted) text-(--color-muted)"
								}`}
						>
							<span className={`text-sm ${language === "es" ? "text-foreground font-medium" : ""}`}>{t("spanish")}</span>
						</button>
					</div>
				</section>

				{/* Tema */}
				<section>
					<h3 className="text-xs font-bold uppercase tracking-wider text-(--color-muted) mb-3">{t("appearance")}</h3>
					<div className="flex gap-3">
						<button
							onClick={() => setTheme("light")}
							className={`flex-1 py-3 px-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-200 ${theme === "light"
								? "border-foreground bg-black/5 dark:bg-white/5 shadow-inner"
								: "border-(--color-border) hover:border-(--color-muted) text-(--color-muted)"
								}`}
						>
							<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
								<circle cx="12" cy="12" r="5" />
								<path strokeLinecap="round" strokeLinejoin="round" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
							</svg>
							<span className={`text-sm ${theme === "light" ? "text-foreground font-medium" : ""}`}>{t("light")}</span>
						</button>
						<button
							onClick={() => setTheme("dark")}
							className={`flex-1 py-3 px-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-200 ${theme === "dark"
								? "border-foreground bg-black/5 dark:bg-white/5 shadow-inner"
								: "border-(--color-border) hover:border-(--color-muted) text-(--color-muted)"
								}`}
						>
							<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
							</svg>
							<span className={`text-sm ${theme === "dark" ? "text-foreground font-medium" : ""}`}>{t("dark")}</span>
						</button>
					</div>
				</section>

				{/* Tipografía */}
				<section>
					<h3 className="text-xs font-bold uppercase tracking-wider text-(--color-muted) mb-3">{t("font")}</h3>
					<div className="flex flex-col gap-2">
						{FONTS.map(f => (
							<button
								key={f.id}
								onClick={() => setFont(f.id)}
								className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-center justify-between group ${font === f.id
									? "border-foreground bg-black/2 dark:bg-white/2 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
									: "border-transparent hover:bg-black/3 dark:hover:bg-white/5"
									}`}
							>
								<div>
									<div className={`text-base text-foreground ${f.class}`}>
										{f.name}
									</div>
									<div className="text-xs text-(--color-muted) mt-0.5">
										{f.description[language]}
									</div>
								</div>
								{font === f.id && (
									<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-foreground">
										<polyline points="20 6 9 17 4 12" />
									</svg>
								)}
							</button>
						))}
					</div>
				</section>
			</div>
		</Modal>
	);
}