import { Toaster } from 'sileo'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gestor de Actividades',
  description: 'Aprende a usar Sileo con Next.js y TypeScript',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        {children}
        <Toaster
          position="top-right"
          options={{
            fill: '#1e293b',
            roundness: 20,
            styles: {
              title: 'text-white!',
              description: 'text-gray-300!',
              badge: 'bg-slate-700!',
              button: 'bg-slate-600! hover:bg-slate-500!',
            },
          }}
        />
      </body>
    </html>
  )
}