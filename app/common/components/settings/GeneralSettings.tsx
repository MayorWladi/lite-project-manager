"use client";

import React, { useRef } from "react";
import { useSettings, FontType } from "@/app/common/context/SettingsContext";
import { useLanguage } from "@/app/common/context/LanguageContext";
import { useProjectsManager } from "@/app/common/context/ProjectContext";
import { RadioPill, RadioCard, ActionCard, SettingsSection } from "@/app/common/components/RadioOption";
import { notify } from "@/app/utils/helpers/notifications";
import { Project } from "@/app/common/types";

const FONTS: { id: FontType; name: string; class: string; description: { en: string; es: string } }[] = [
	{ id: "dm-sans", name: "DM Sans", class: "font-dm-sans", description: { en: "Minimal and warm. Excellent readability.", es: "Minimalista y cálida. Excelente legibilidad." } },
	{ id: "quicksand", name: "Quicksand", class: "font-quicksand", description: { en: "Soft and very rounded. Ultra relaxing.", es: "Suave y muy redondeada. Ultra relajante." } },
	{ id: "comfortaa", name: "Comfortaa", class: "font-comfortaa", description: { en: "Modern geometric. Zen app vibe.", es: "Geométrica moderna. Vibe de app zen." } },
	{ id: "mono", name: "JetBrains Mono", class: "font-mono", description: { en: "Retro code style. Lo-fi hip-hop radio.", es: "Estilo código retro. Lo-fi hip-hop radio." } },
];

interface GeneralSettingsProps {
	onStartImport: (data: Project[]) => void;
}

export default function GeneralSettings({ onStartImport }: GeneralSettingsProps) {
	const { theme, setTheme, font, setFont } = useSettings();
	const { language, setLanguage, t } = useLanguage();
	const { projects } = useProjectsManager();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleExport = () => {
		const dataStr = JSON.stringify(projects, null, 2);
		const blob = new Blob([dataStr], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const date = new Date().toISOString().split("T")[0];

		const a = document.createElement("a");
		a.href = url;
		a.download = `minimalist-project-backup-${date}.json`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (event) => {
			try {
				const jsonData = JSON.parse(event.target?.result as string);
				if (Array.isArray(jsonData) && (jsonData.length === 0 || jsonData[0].sprints)) {
					onStartImport(jsonData);
				} else {
					throw new Error("Invalid format");
				}
			} catch {
				notify(t("notif_import_error"), t("notif_import_error_desc"), "error");
			}
		};
		reader.readAsText(file);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	return (
		<div className="space-y-8">
			{/* Idioma */}
			<SettingsSection title={t("language")}>
				<div className="flex gap-3">
					<RadioPill label={t("english")} isActive={language === "en"} onClick={() => setLanguage("en")} />
					<RadioPill label={t("spanish")} isActive={language === "es"} onClick={() => setLanguage("es")} />
				</div>
			</SettingsSection>

			{/* Tema */}
			<SettingsSection title={t("appearance")}>
				<div className="flex gap-3">
					<RadioPill
						label={t("light")}
						isActive={theme === "light"}
						onClick={() => setTheme("light")}
						layout="col"
						icon={
							<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
								<circle cx="12" cy="12" r="5" />
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
								/>
							</svg>
						}
					/>
					<RadioPill
						label={t("dark")}
						isActive={theme === "dark"}
						onClick={() => setTheme("dark")}
						layout="col"
						icon={
							<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
							</svg>
						}
					/>
				</div>
			</SettingsSection>

			{/* Tipografía */}
			<SettingsSection title={t("font")}>
				<div className="flex flex-col gap-2">
					{FONTS.map((f) => (
						<div key={f.id} className={f.class}>
							<RadioCard
								title={f.name}
								description={f.description[language as "en" | "es"]}
								isActive={font === f.id}
								onClick={() => setFont(f.id)}
							/>
						</div>
					))}
				</div>
			</SettingsSection>

			{/* Datos */}
			<SettingsSection title={t("data_management")}>
				<div className="flex gap-3">
					<ActionCard
						title={t("export_backup")}
						description={t("export_desc")}
						onClick={handleExport}
						icon={
							<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
								<polyline strokeLinecap="round" strokeLinejoin="round" points="7 10 12 15 17 10" />
								<line strokeLinecap="round" strokeLinejoin="round" x1="12" x2="12" y1="15" y2="3" />
							</svg>
						}
					/>
					<ActionCard
						title={t("import_backup")}
						description={t("import_desc")}
						onClick={() => fileInputRef.current?.click()}
						icon={
							<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
								<polyline strokeLinecap="round" strokeLinejoin="round" points="17 8 12 3 7 8" />
								<line strokeLinecap="round" strokeLinejoin="round" x1="12" x2="12" y1="3" y2="15" />
							</svg>
						}
					/>
					<input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
				</div>
			</SettingsSection>
		</div>
	);
}
