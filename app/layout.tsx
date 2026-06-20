// /app/layout.tsx
import './globals.css';
import { ProjectProvider } from '@/app/context/ProjectContext';
// ... tus otras importaciones

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