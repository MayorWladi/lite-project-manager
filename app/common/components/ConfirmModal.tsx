"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/app/common/components/Modal";
import { useLanguage } from "@/app/common/context/LanguageContext";
import { Button } from "@/app/common/components/Button";
import { Label } from "@/app/common/components/Label";

interface ConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	description: string;
	level: "normal" | "high";
	confirmWord?: string;
}

export default function ConfirmModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	description,
	level,
	confirmWord,
}: ConfirmModalProps) {
	const { t } = useLanguage();
	const [inputText, setInputText] = useState("");

	useEffect(() => {
		if (isOpen) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setInputText("");
		}
	}, [isOpen]);

	const isConfirmDisabled = level === "high" && confirmWord ? inputText.trim() !== confirmWord.trim() : false;

	return (
		<Modal isOpen={isOpen} onClose={onClose} title={title}>
			<div className="space-y-6">
				<p className="text-sm text-(--color-muted) leading-relaxed">
					{description}
				</p>

				{level === "high" && confirmWord && (
					<div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
						<Label className="mb-2">
							{t("type")} &quot;{confirmWord}&quot; {t("to_confirm")}
						</Label>
						<input
							type="text"
							value={inputText}
							onChange={(e) => setInputText(e.target.value)}
							placeholder={confirmWord}
							className="w-full bg-transparent border border-(--color-border) rounded-lg p-3 text-sm focus:outline-none focus:border-red-500 transition-colors"
						/>
					</div>
				)}

				<div className="flex gap-3 pt-6 border-t border-(--color-border)">
					<Button
						variant="ghost"
						onClick={onClose}
						className="flex-1"
					>
						{t("cancel")}
					</Button>
					<Button
						variant={level === "high" ? "danger" : "primary"}
						onClick={onConfirm}
						disabled={isConfirmDisabled}
						className="flex-1"
					>
						{t("confirm")}
					</Button>
				</div>
			</div>
		</Modal>
	);
}
