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
          <Toaster
            position="top-right"
            options={{
              fill: '#ffffff',
              roundness: 8,
              border: '1px solid #EAEAEA',
              styles: {
                title: 'text-[#111111]! font-medium! tracking-tight!',
                description: 'text-[#787774]! text-sm!',
                badge: 'bg-[#F7F6F3]! text-[#111111]!',
                button: 'bg-[#111111]! hover:bg-[#333333]! text-[#FFFFFF]! rounded-md!',
              },
            }}
          />
        </ProjectProvider>
      </body>
    </html>
  );
}