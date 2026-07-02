"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/app/common/components/Modal";
import { useLanguage } from "@/app/common/context/LanguageContext";

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
						<label className="block text-xs font-bold text-(--color-muted) uppercase tracking-wider mb-2">
							{t("type_exact_name_to_confirm")} <span className="text-foreground ml-1 font-extrabold">{confirmWord}</span>
						</label>
						<input
							type="text"
							value={inputText}
							onChange={(e) => setInputText(e.target.value)}
							placeholder={confirmWord}
							className="w-full bg-transparent border border-(--color-border) rounded-lg p-3 text-sm focus:outline-none focus:border-red-500 transition-colors"
						/>
					</div>
				)}

				<div className="flex gap-3 pt-4 border-t border-(--color-border)">
					<button
						onClick={onClose}
						className="flex-1 py-2.5 px-4 rounded-xl border border-(--color-border) text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
					>
						{t("cancel")}
					</button>
					<button
						onClick={onConfirm}
						disabled={isConfirmDisabled}
						className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
							isConfirmDisabled
								? "bg-red-600/30 text-white/50 cursor-not-allowed"
								: "bg-red-600 text-white shadow-md hover:bg-red-700"
						}`}
					>
						{t("delete_action")}
					</button>
				</div>
			</div>
		</Modal>
	);
}
