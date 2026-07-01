import './globals.css'
import type { Metadata } from 'next'
import { ProjectProvider } from "@/app/common/context/ProjectContext";

export const metadata: Metadata = {
  title: 'Lite Project Manager',
  description: 'Fast, lightweight, and local-first project manager',
}

import { Quicksand, Comfortaa, DM_Sans, JetBrains_Mono } from 'next/font/google';
import { SettingsProvider } from "@/app/common/context/SettingsContext";
import { LanguageProvider } from "@/app/common/context/LanguageContext";

const quicksand = Quicksand({ subsets: ['latin'], variable: '--font-quicksand' });
const comfortaa = Comfortaa({ subsets: ['latin'], variable: '--font-comfortaa' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${quicksand.variable} ${comfortaa.variable} ${dmSans.variable} ${jetBrainsMono.variable}`}>
      <body className="antialiased font-dm-sans transition-colors duration-300">
        <LanguageProvider>
          <SettingsProvider>
            <ProjectProvider>
              {children}
            </ProjectProvider>
          </SettingsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}