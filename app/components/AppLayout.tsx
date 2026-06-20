// /app/components/AppLayout.tsx
"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex h-screen w-full bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
			<Sidebar />
			<main className="flex-1 h-full overflow-hidden relative">
				{children}
			</main>
		</div>
	);
}