"use client";

import React, { useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string | ReactNode;
	children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
	// Cerrar con la tecla Escape
	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleEsc);
		return () => window.removeEventListener("keydown", handleEsc);
	}, [onClose]);

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.15 }}
						className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm"
						onClick={onClose}
					/>

					{/* Modal Content Container */}
					<motion.div
						layout
						initial={{ opacity: 0, y: 32, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 32, scale: 0.95 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
						className="relative w-full max-w-md bg-(--color-card-bg) rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-(--color-border) p-6 overflow-hidden flex flex-col"
						style={{ maxHeight: '90vh' }}
					>
						{/* Cabecera estándar del Modal */}
						<motion.div layout="position" className="flex items-center justify-between mb-6 shrink-0">
							<h2 className="text-xl font-semibold text-foreground tracking-tight">
								{title}
							</h2>
							<button
								onClick={onClose}
								className="p-1.5 rounded-md text-(--color-muted) hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground transition-colors"
							>
								<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</motion.div>

						{/* Aquí se inyecta el contenido específico de cada modal */}
						<div className="overflow-y-auto overflow-x-hidden scrollbar-hide grow">
							{children}
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}