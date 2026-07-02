"use client";

import React, { useRef, useState } from "react";
import { useSettings, FontType } from "@/app/common/context/SettingsContext";
import { useLanguage } from "@/app/common/context/LanguageContext";
import { useProjectsManager } from "@/app/common/context/ProjectContext";
import { Project } from "@/app/common/types";
import Modal from "@/app/common/components/Modal";
import { RadioPill, RadioCard, ActionCard } from "@/app/common/components/RadioOption";
import { notify } from "@/app/utils/helpers/notifications";

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<section>
			<h3 className="text-xs font-bold uppercase tracking-wider text-(--color-muted) mb-3">{title}</h3>
			{children}
		</section>
	);
}

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
						<RadioCard
							title={t("mode_merge")}
							description={t("mode_merge_desc")}
							isActive={importMode === 'merge'}
							onClick={() => setImportMode('merge')}
						/>
						<RadioCard
							title={t("mode_overwrite")}
							description={t("mode_overwrite_desc")}
							isActive={importMode === 'overwrite'}
							onClick={() => setImportMode('overwrite')}
							variant="danger"
						/>
					</div>

					{importMode === 'overwrite' && (
						<div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
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
					<SettingsSection title={t("language")}>
						<div className="flex gap-3">
							<RadioPill
								label={t("english")}
								isActive={language === "en"}
								onClick={() => setLanguage("en")}
							/>
							<RadioPill
								label={t("spanish")}
								isActive={language === "es"}
								onClick={() => setLanguage("es")}
							/>
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
										<path strokeLinecap="round" strokeLinejoin="round" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
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
							{FONTS.map(f => (
								<div key={f.id} className={f.class}>
									<RadioCard
										title={f.name}
										description={f.description[language as 'en' | 'es']}
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
			)}
		</Modal>
	);
}