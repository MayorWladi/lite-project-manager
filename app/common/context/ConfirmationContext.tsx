"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import ConfirmModal from "@/app/common/components/ConfirmModal";

type SecurityLevel = "normal" | "high";

interface ConfirmOptions {
	title: string;
	description: string;
	level: SecurityLevel;
	confirmWord?: string;
}

interface ConfirmationContextType {
	confirmAction: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

export function ConfirmationProvider({ children }: { children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);
	const [options, setOptions] = useState<ConfirmOptions | null>(null);
	const [resolver, setResolver] = useState<{ resolve: (value: boolean) => void } | null>(null);

	const confirmAction = useCallback((opts: ConfirmOptions): Promise<boolean> => {
		setOptions(opts);
		setIsOpen(true);
		return new Promise((resolve) => {
			setResolver({ resolve });
		});
	}, []);

	const handleConfirm = () => {
		setIsOpen(false);
		if (resolver) resolver.resolve(true);
	};

	const handleCancel = () => {
		setIsOpen(false);
		if (resolver) resolver.resolve(false);
	};

	return (
		<ConfirmationContext.Provider value={{ confirmAction }}>
			{children}
			{options && (
				<ConfirmModal
					isOpen={isOpen}
					onClose={handleCancel}
					onConfirm={handleConfirm}
					title={options.title}
					description={options.description}
					level={options.level}
					confirmWord={options.confirmWord}
				/>
			)}
		</ConfirmationContext.Provider>
	);
}

export function useConfirmation() {
	const context = useContext(ConfirmationContext);
	if (!context) throw new Error("useConfirmation must be used within a ConfirmationProvider");
	return context;
}
