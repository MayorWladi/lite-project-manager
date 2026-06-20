import { Toaster } from 'sileo'
import './globals.css'
import type { Metadata } from 'next'
import { ProjectProvider } from './context/ProjectContext';

export const metadata: Metadata = {
  title: 'Lite Project Manager',
  description: 'Fast, lightweight, and local-first project manager',
}

import { Quicksand, Comfortaa, DM_Sans, JetBrains_Mono } from 'next/font/google';
import { SettingsProvider } from './context/SettingsContext';
import { LanguageProvider } from './context/LanguageContext';

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
              <Toaster
                position="top-right"
                options={{
                  fill: '#ffffff',
                  roundness: 8,
                  styles: {
                    title: 'text-[#111111]! font-medium! tracking-tight!',
                    description: 'text-[#787774]! text-sm!',
                    badge: 'bg-[#F7F6F3]! text-[#111111]!',
                    button: 'bg-[#111111]! hover:bg-[#333333]! text-[#FFFFFF]! rounded-md!',
                  },
                }}
              />
            </ProjectProvider>
          </SettingsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}