"use client";

import React, { useState } from "react";
import { useLanguage } from "@/app/common/context/LanguageContext";
import { Project } from "@/app/common/types";
import Modal from "@/app/common/components/Modal";
import GeneralSettings from "@/app/common/components/settings/GeneralSettings";
import ImportSettings from "@/app/common/components/settings/ImportSettings";

interface SettingsModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
	const { t } = useLanguage();
	const [pendingImportData, setPendingImportData] = useState<Project[] | null>(null);

	const handleClose = () => {
		setPendingImportData(null);
		onClose();
	};

	const handleStartImport = (data: Project[]) => {
		setPendingImportData(data);
	};

	const isImporting = pendingImportData !== null;

	return (
		<Modal isOpen={isOpen} onClose={handleClose} title={isImporting ? t("import_action") : t("settings")}>
			{isImporting ? (
				<ImportSettings
					pendingImportData={pendingImportData}
					onCancel={() => setPendingImportData(null)}
					onSuccess={handleClose}
				/>
			) : (
				<GeneralSettings onStartImport={handleStartImport} />
			)}
		</Modal>
	);
}