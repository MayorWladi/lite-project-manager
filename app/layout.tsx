import './globals.css'
import type { Metadata, Viewport } from 'next'
import { ProjectProvider } from "@/app/common/context/ProjectContext";

export const metadata: Metadata = {
  title: "Lite Project Manager",
  description: "Gestor de proyectos minimalista, rápido y local",
  applicationName: "Lite Project Manager",
  icons: {
    icon: "/app-icon.png",
  },
  openGraph: {
    title: "Lite Project Manager",
    description: "Gestor de proyectos minimalista, rápido y local",
    images: [
      {
        url: "/projects/lite-project-manager/app-preview.gif",
        width: 1200,
        height: 630,
        alt: "Lite Project Manager",
      },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Previene zoom en inputs móviles
}

import { Quicksand, Comfortaa, DM_Sans, JetBrains_Mono } from 'next/font/google';
import { SettingsProvider } from "@/app/common/context/SettingsContext";
import { LanguageProvider } from "@/app/common/context/LanguageContext";
import { ConfirmationProvider } from "@/app/common/context/ConfirmationContext";
import { ThemeScript } from "@/app/common/components/ThemeScript";

const quicksand = Quicksand({ subsets: ['latin'], variable: '--font-quicksand' });
const comfortaa = Comfortaa({ subsets: ['latin'], variable: '--font-comfortaa' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${quicksand.variable} ${comfortaa.variable} ${dmSans.variable} ${jetBrainsMono.variable}`}>
      <head>
        <ThemeScript />
      </head>
      <body className="antialiased font-dm-sans transition-colors duration-300">
        <LanguageProvider>
          <SettingsProvider>
            <ProjectProvider>
              <ConfirmationProvider>
                {children}
              </ConfirmationProvider>
            </ProjectProvider>
          </SettingsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}