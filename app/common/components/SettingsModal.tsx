"use client";

import React, { useRef, useState } from "react";
import { useSettings, FontType } from "@/app/common/context/SettingsContext";
import { useLanguage } from "@/app/common/context/LanguageContext";
import { useProjectsManager } from "@/app/common/context/ProjectContext";
import { Project } from "@/app/common/types";
import Modal from "@/app/common/components/Modal";
import { notify } from "@/app/utils/helpers/notifications";

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
	const { projects, importData } = useProjectsManager();

	const [isImporting, setIsImporting] = useState(false);
	const [importMode, setImportMode] = useState<'merge' | 'overwrite'>('merge');
	const [confirmText, setConfirmText] = useState("");
	const [pendingImportData, setPendingImportData] = useState<Project[] | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleClose = () => {
		setIsImporting(false);
		setPendingImportData(null);
		setConfirmText("");
		onClose();
	};

	const handleExport = () => {
		const dataStr = JSON.stringify(projects, null, 2);
		const blob = new Blob([dataStr], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const date = new Date().toISOString().split('T')[0];
		
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
				// Basic validation
				if (Array.isArray(jsonData) && (jsonData.length === 0 || jsonData[0].sprints)) {
					setPendingImportData(jsonData);
					setIsImporting(true);
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

	const confirmImport = () => {
		if (importMode === 'overwrite' && confirmText !== t("confirm_word")) return;
		if (pendingImportData) {
			importData(pendingImportData, importMode);
			notify(t("notif_import_success"), t("notif_import_success_desc"), "success");
			handleClose();
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} title={isImporting ? t("import_action") : t("settings")}>
			{isImporting ? (
				<div className="space-y-6">
					<p className="text-sm text-(--color-muted)">
						{t("import_desc")}
					</p>

					<div className="flex flex-col gap-2">
						<button
							onClick={() => setImportMode('merge')}
							className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${importMode === 'merge'
								? "border-foreground bg-black/2 dark:bg-white/2 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
								: "border-transparent border-(--color-border) hover:bg-black/3 dark:hover:bg-white/5"
								}`}
						>
							<div>
								<div className={`font-semibold text-sm ${importMode === 'merge' ? 'text-foreground' : ''}`}>{t("mode_merge")}</div>
								<div className="text-xs text-(--color-muted) mt-0.5">{t("mode_merge_desc")}</div>
							</div>
							{importMode === 'merge' && (
								<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-foreground shrink-0 animate-in fade-in zoom-in duration-200">
									<polyline points="20 6 9 17 4 12" />
								</svg>
							)}
						</button>

						<button
							onClick={() => setImportMode('overwrite')}
							className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${importMode === 'overwrite'
								? "border-red-500 bg-red-500/5 dark:bg-red-500/10 shadow-[0_2px_8px_rgba(239,68,68,0.1)]"
								: "border-transparent border-(--color-border) hover:bg-red-500/5"
								}`}
						>
							<div>
								<div className={`font-semibold text-sm ${importMode === 'overwrite' ? 'text-red-600 dark:text-red-400' : 'text-foreground'}`}>{t("mode_overwrite")}</div>
								<div className="text-xs text-(--color-muted) mt-0.5">{t("mode_overwrite_desc")}</div>
							</div>
							{importMode === 'overwrite' && (
								<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-red-600 dark:text-red-400 shrink-0 animate-in fade-in zoom-in duration-200">
									<polyline points="20 6 9 17 4 12" />
								</svg>
							)}
						</button>
					</div>

					{importMode === 'overwrite' && (
						<div className="pt-2 animate-tab-enter">
							<label className="block text-xs font-bold text-(--color-muted) uppercase tracking-wider mb-2">
								{t("type_to_confirm")}
							</label>
							<input
								type="text"
								value={confirmText}
								onChange={(e) => setConfirmText(e.target.value)}
								placeholder={t("confirm_word")}
								className="w-full bg-transparent border border-(--color-border) rounded-lg p-3 text-sm focus:outline-none focus:border-red-500 transition-colors uppercase"
							/>
						</div>
					)}

					<div className="flex gap-3 pt-4 border-t border-(--color-border)">
						<button onClick={() => setIsImporting(false)} className="flex-1 py-2.5 px-4 rounded-xl border border-(--color-border) text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
							{t("cancel")}
						</button>
						<button 
							onClick={confirmImport} 
							disabled={importMode === 'overwrite' && confirmText !== t("confirm_word")}
							className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
								importMode === 'overwrite'
									? (confirmText === t("confirm_word") ? "bg-red-600 text-white shadow-md hover:bg-red-700" : "bg-red-600/30 text-white/50 cursor-not-allowed")
									: "bg-foreground text-background shadow-md hover:opacity-90"
							}`}
						>
							{t("import_action")}
						</button>
					</div>
				</div>
			) : (
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

					{/* Datos */}
					<section>
						<h3 className="text-xs font-bold uppercase tracking-wider text-(--color-muted) mb-3">{t("data_management")}</h3>
						<div className="flex gap-3">
							<button
								onClick={handleExport}
								className="flex-1 py-3 px-4 rounded-xl border border-(--color-border) hover:border-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all flex flex-col items-center gap-2 group"
							>
								<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-(--color-muted) group-hover:text-foreground transition-colors">
									<path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
									<polyline strokeLinecap="round" strokeLinejoin="round" points="7 10 12 15 17 10" />
									<line strokeLinecap="round" strokeLinejoin="round" x1="12" x2="12" y1="15" y2="3" />
								</svg>
								<div className="text-center">
									<span className="block text-sm font-medium text-foreground">{t("export_backup")}</span>
									<span className="block text-[10px] text-(--color-muted) mt-1">{t("export_desc")}</span>
								</div>
							</button>
							
							<button
								onClick={() => fileInputRef.current?.click()}
								className="flex-1 py-3 px-4 rounded-xl border border-(--color-border) hover:border-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all flex flex-col items-center gap-2 group"
							>
								<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-(--color-muted) group-hover:text-foreground transition-colors">
									<path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
									<polyline strokeLinecap="round" strokeLinejoin="round" points="17 8 12 3 7 8" />
									<line strokeLinecap="round" strokeLinejoin="round" x1="12" x2="12" y1="3" y2="15" />
								</svg>
								<div className="text-center">
									<span className="block text-sm font-medium text-foreground">{t("import_backup")}</span>
									<span className="block text-[10px] text-(--color-muted) mt-1">{t("import_desc")}</span>
								</div>
							</button>
							<input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
						</div>
					</section>
				</div>
			)}
		</Modal>
	);
}