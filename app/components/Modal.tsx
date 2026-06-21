"use client";

import React, { useEffect, useState, ReactNode } from "react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string | ReactNode;
	children: ReactNode;
}

const ANIMATION_DURATION = 150; // Controla la velocidad de toda la animación

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
	const [isMounted, setIsMounted] = useState(isOpen);
	const [isVisible, setIsVisible] = useState(false);

	// Manejo de animaciones de entrada/salida
	useEffect(() => {
		if (isOpen) {
			setIsMounted(true);
			const timer = setTimeout(() => setIsVisible(true), 10);
			return () => clearTimeout(timer);
		} else if (isMounted) {
			setIsVisible(false);
			const timer = setTimeout(() => setIsMounted(false), ANIMATION_DURATION);
			return () => clearTimeout(timer);
		}
	}, [isOpen, isMounted]);

	// Cerrar con la tecla Escape
	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleEsc);
		return () => window.removeEventListener("keydown", handleEsc);
	}, [onClose]);

	if (!isMounted) return null;

	return (
		<div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
			{/* Backdrop */}
			<div
				className={`absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0'
					}`}
				style={{ transitionDuration: `${ANIMATION_DURATION}ms` }}
				onClick={onClose}
			/>

			{/* Modal Content Container */}
			<div
				className={`relative w-full max-w-md bg-(--color-card-bg) rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-(--color-border) p-6 transition-all ease-out max-h-[90vh] overflow-y-auto scrollbar-hide ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
					}`}
				style={{ transitionDuration: `${ANIMATION_DURATION}ms` }}
			>
				{/* Cabecera estándar del Modal */}
				<div className="flex items-center justify-between mb-6">
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
				</div>

				{/* Aquí se inyecta el contenido específico de cada modal */}
				{children}
			</div>
		</div>
	);
}