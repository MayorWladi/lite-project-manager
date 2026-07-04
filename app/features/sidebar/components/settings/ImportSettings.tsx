"use client";

import React, { useState } from "react";
import { useLanguage } from "@/app/common/context/LanguageContext";
import { useProjectsManager } from "@/app/common/context/ProjectContext";
import { RadioCard } from "@/app/common/components/RadioOption";
import { notify } from "@/app/utils/helpers/notifications";
import { Project } from "@/app/common/types";
import { Button } from "@/app/common/components/Button";
import { Label } from "@/app/common/components/Label";
import { Input } from "@/app/common/components/Input";

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
					<Label className="mb-2">
						{t("type_word")} &quot;IMPORT&quot; {t("to_confirm")}
					</Label>
					<Input
						type="text"
						value={confirmText}
						onChange={(e) => setConfirmText(e.target.value)}
						placeholder={t("confirm_word")}
						className="w-full p-3 uppercase focus:border-red-500"
					/>
				</div>
			)}

			<div className="flex gap-3 pt-6 border-t border-(--color-border)">
				<Button
					variant="ghost"
					onClick={onCancel}
					className="flex-1"
				>
					{t("cancel")}
				</Button>
				<Button
					variant={importMode === "overwrite" ? "danger" : "primary"}
					onClick={confirmImport}
					disabled={importMode === "overwrite" && confirmText !== t("confirm_word")}
					className="flex-1"
				>
					{t("import_action")}
				</Button>
			</div>
		</div>
	);
}
