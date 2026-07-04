"use client";

import Link from "next/link";
import { Button } from "@/app/common/components/Button";
import { useLanguage } from "@/app/common/context/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 animate-fade-in">
      <div className="max-w-md w-full bg-(--color-card-bg) border border-(--color-border) shadow-xl rounded-2xl p-8 flex flex-col items-center text-center gap-4">
        
        <div className="w-20 h-20 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-2">
          <svg className="w-10 h-10 text-(--color-muted)" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-foreground tracking-tight">
          404
        </h2>
        
        <p className="text-(--color-muted) text-sm leading-relaxed">
          {t('not_found_desc')}
        </p>

        <div className="w-full mt-4">
          <Link href="/" passHref>
            <Button variant="primary" className="w-full font-semibold">
              {t('back_to_board')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
