import { Toaster } from 'sileo'
import './globals.css'
import type { Metadata } from 'next'
import { ProjectProvider } from './context/ProjectContext';

export const metadata: Metadata = {
  title: 'Gestor de Actividades',
  description: 'Aprende a usar Sileo con Next.js y TypeScript',
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased">
        <ProjectProvider>
          {children}
        </ProjectProvider>
      </body>
    </html>
  );
}