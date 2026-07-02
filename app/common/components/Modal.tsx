"use client";

import React, { useEffect, useRef, useState, ReactNode } from "react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string | ReactNode;
	children: ReactNode;
}

function useModalTransition(isOpen: boolean, delayTime: number) {
	const [shouldRender, setShouldRender] = useState(isOpen);
	const [isVisible, setIsVisible] = useState(false);

	// Efecto para montar/desmontar
	useEffect(() => {
		if (isOpen) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setShouldRender(true);
		} else {
			setIsVisible(false);
			const timeoutId = setTimeout(() => setShouldRender(false), delayTime);
			return () => clearTimeout(timeoutId);
		}
	}, [isOpen, delayTime]);

	// Efecto para animar SOLO cuando ya está montado
	useEffect(() => {
		if (shouldRender && isOpen) {
			// Forzamos un reflow para asegurar que el navegador haya pintado el DOM con opacity-0
			const frame = requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					setIsVisible(true);
				});
			});
			return () => cancelAnimationFrame(frame);
		}
	}, [shouldRender, isOpen]);

	return { shouldRender, isVisible };
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
	const { shouldRender, isVisible } = useModalTransition(isOpen, 200);
	const [contentHeight, setContentHeight] = useState<number | 'auto'>('auto');
	const contentRef = useRef<HTMLDivElement>(null);

	// Cerrar con la tecla Escape
	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleEsc);
		return () => window.removeEventListener("keydown", handleEsc);
	}, [onClose]);

	// Observador de altura
	useEffect(() => {
		if (!contentRef.current) return;

		const resizeObserver = new ResizeObserver(() => {
			if (contentRef.current) {
				// offsetHeight da el tamaño total renderizado del contenido interno
				setContentHeight(contentRef.current.offsetHeight);
			}
		});

		// Observamos el div interno para detectar cambios de tamaño de los hijos
		resizeObserver.observe(contentRef.current);

		return () => resizeObserver.disconnect();
	}, [shouldRender]);

	if (!shouldRender) return null;

	// Animaciones CSS calculadas según estado
	const backdropClass = isVisible ? "opacity-100" : "opacity-0";
	const modalClass = isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95";

	return (
		<div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
			{/* Backdrop */}
			<div
				className={`absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm transition-opacity duration-200 ease-out ${backdropClass}`}
				onClick={onClose}
			/>

			{/* Modal Container con Altura Dinámica */}
			<div
				className={`relative w-full max-w-md bg-(--color-card-bg) rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-(--color-border) overflow-hidden flex flex-col transition-all duration-200 ease-out ${modalClass}`}
				style={{ 
					height: contentHeight !== 'auto' ? contentHeight : undefined,
					maxHeight: '90vh'
				}}
			>
				{/* Inner Content Wrapper para medir altura */}
				<div ref={contentRef} className="flex flex-col w-full max-h-[90vh]">
					{/* Cabecera estándar del Modal */}
					<div className="flex items-center justify-between px-6 pt-6 mb-6 shrink-0">
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
					<div className="overflow-y-auto overflow-x-hidden scrollbar-hide grow px-6 pb-6">
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}