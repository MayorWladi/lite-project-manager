"use client";

import { useEffect } from "react";
import { Button } from "@/app/common/components/Button";
import { useLanguage } from "@/app/common/context/LanguageContext";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    // Aquí podrías enviar el error a un servicio de reporte (Sentry, LogRocket, etc.)
    console.error("Lite Project Manager - Global Crash Captured:", error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 animate-fade-in">
      <div className="max-w-md w-full bg-(--color-card-bg) border border-red-500/20 shadow-2xl rounded-2xl p-8 flex flex-col items-center text-center gap-4 relative overflow-hidden">
        
        {/* Decoración de fondo */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          {t('error_title')}
        </h2>
        
        <p className="text-(--color-muted) text-sm leading-relaxed">
          {t('error_desc')}
        </p>

        <div className="w-full flex flex-col sm:flex-row gap-3 mt-4">
          <Button 
            variant="primary" 
            onClick={() => reset()} 
            className="flex-1 font-semibold"
          >
            {t('retry')}
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => window.location.reload()} 
            className="flex-1 font-semibold"
          >
            {t('reload_page')}
          </Button>
        </div>
      </div>
    </div>
  );
}
