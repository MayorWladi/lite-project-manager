// /app/components/AppLayout.tsx
"use client";

import { ReactNode, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Toaster } from "sileo";
import "sileo/styles.css";

export default function AppLayout({ children }: { children: ReactNode }) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(true);

	return (
		<div className="flex flex-col md:flex-row h-screen w-full bg-background text-foreground overflow-hidden">
			{/* Mobile Header */}
			<div className="md:hidden flex items-center gap-3 p-4 border-b border-(--color-border) bg-background z-20 shrink-0">
				<button
					onClick={() => setIsMobileMenuOpen(true)}
					className="p-2 -ml-2 text-(--color-muted) hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
				>
					<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>
				<h2 className="text-base font-bold tracking-tight">Lite Project Manager</h2>
			</div>

			<Sidebar 
				isOpen={isMobileMenuOpen} 
				onClose={() => setIsMobileMenuOpen(false)} 
				isDesktopOpen={isDesktopMenuOpen}
				onDesktopToggle={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
			/>

			<main className="flex-1 h-full overflow-hidden relative">
				<div className={`h-full w-full transition-all duration-300 ${!isDesktopMenuOpen ? 'md:pl-16' : ''}`}>
					{!isDesktopMenuOpen && (
						<button 
							onClick={() => setIsDesktopMenuOpen(true)}
							className="hidden md:flex absolute top-8 left-6 z-30 p-2 text-(--color-muted) hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors border border-(--color-border) bg-background shadow-sm"
						>
							<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						</button>
					)}
					{children}
				</div>
			</main>
			<Toaster theme="system" />
		</div>
	);
}