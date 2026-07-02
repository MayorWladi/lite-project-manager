"use client";

import React, { useState } from "react";
import { useLanguage } from "@/app/common/context/LanguageContext";
import { useProjectsManager } from "@/app/common/context/ProjectContext";
import { RadioCard } from "@/app/common/components/RadioOption";
import { notify } from "@/app/utils/helpers/notifications";
import { Project } from "@/app/common/types";

interface ImportSettingsProps {
	pendingImportData: Project[];
	onCancel: () => void;
	onSuccess: () => void;
}

export default function ImportSettings({ pendingImportData, onCancel, onSuccess }: ImportSettingsProps) {
	const { t } = useLanguage();
	const { importData } = useProjectsManager();
	const [importMode, setImportMode] = useState<"merge" | "overwrite">("merge");
	const [confirmText, setConfirmText] = useState("");

	const confirmImport = () => {
		if (importMode === "overwrite" && confirmText !== t("confirm_word")) return;
		
		importData(pendingImportData, importMode);
		notify(t("notif_import_success"), t("notif_import_success_desc"), "success");
		onSuccess();
	};

	return (
		<div className="space-y-6">
			<p className="text-sm text-(--color-muted)">{t("import_desc")}</p>

			<div className="flex flex-col gap-2">
				<RadioCard
					title={t("mode_merge")}
					description={t("mode_merge_desc")}
					isActive={importMode === "merge"}
					onClick={() => setImportMode("merge")}
				/>
				<RadioCard
					title={t("mode_overwrite")}
					description={t("mode_overwrite_desc")}
					isActive={importMode === "overwrite"}
					onClick={() => setImportMode("overwrite")}
					variant="danger"
				/>
			</div>

			{importMode === "overwrite" && (
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
				<button
					onClick={onCancel}
					className="flex-1 py-2.5 px-4 rounded-xl border border-(--color-border) text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
				>
					{t("cancel")}
				</button>
				<button
					onClick={confirmImport}
					disabled={importMode === "overwrite" && confirmText !== t("confirm_word")}
					className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
						importMode === "overwrite"
							? confirmText === t("confirm_word")
								? "bg-red-600 text-white shadow-md hover:bg-red-700"
								: "bg-red-600/30 text-white/50 cursor-not-allowed"
							: "bg-foreground text-background shadow-md hover:opacity-90"
					}`}
				>
					{t("import_action")}
				</button>
			</div>
		</div>
	);
}
