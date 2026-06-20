// /app/components/AppLayout.tsx
"use client";

import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
				<h2 className="text-base font-bold tracking-tight">lite Project Manager</h2>
			</div>

			<Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
			
			<main className="flex-1 h-full overflow-hidden relative">
				{children}
			</main>
		</div>
	);
}