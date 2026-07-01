"use client";

import React from "react";
import { useLanguage } from "@/app/common/context/LanguageContext";
import Modal from "@/app/common/components/Modal";
import { collaborators } from "@/app/utils/storage/collaborators";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = React.useState<"guide" | "collaborators">("guide");
  const [currentStep, setCurrentStep] = React.useState(0);

  const tutorialSteps = [
    { title: t("tut_step1_title"), desc: t("tut_step1_desc"), image: "/tutorial/step1.png" },
    { title: t("tut_step2_title"), desc: t("tut_step2_desc"), image: "/tutorial/step2.png" },
    { title: t("tut_step3_title"), desc: t("tut_step3_desc"), image: "/tutorial/step3.png" },
    { title: t("tut_step4_title"), desc: t("tut_step4_desc"), image: "/tutorial/step4.png" },
  ];

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, tutorialSteps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const renderSocialIcon = (url: string) => {
    if (url.includes('linkedin.com')) {
      return (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="hover:text-[#0a66c2] transition-colors">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      );
    } else if (url.includes('instagram.com')) {
      return (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="hover:text-[#E1306C] transition-colors">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      );
    } else if (url.includes('github.com')) {
      return (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="hover:text-foreground transition-colors">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      );
    } else {
      return (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      );
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("information")}>
      {/* Pestañas */}
      <div className="flex border-b border-(--color-border) mb-6">
        <button
          onClick={() => setActiveTab("guide")}
          className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === "guide" ? "border-foreground text-foreground" : "border-transparent text-(--color-muted) hover:text-foreground"}`}
        >
          {t("user_guide")}
        </button>
        <button
          onClick={() => setActiveTab("collaborators")}
          className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === "collaborators" ? "border-foreground text-foreground" : "border-transparent text-(--color-muted) hover:text-foreground"}`}
        >
          {t("collaborators")}
        </button>
      </div>

      <div className="relative w-full">
        {/* Contenido: Guía de Uso */}
        {/* Contenido: Guía de Uso (Carrusel de Tutorial) */}
        {activeTab === "guide" && (
          <div className="animate-fade-in flex flex-col items-center">
            {/* Contenedor de Imagen */}
            <div className="w-full aspect-video bg-black/5 dark:bg-white/5 rounded-xl border border-(--color-border) overflow-hidden flex items-center justify-center relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tutorialSteps[currentStep].image}
                alt={tutorialSteps[currentStep].title}
                className="w-full h-full object-cover transition-opacity duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" fill="%23e5e7eb"><rect width="100%25" height="100%25" fill="%231a1a1a" /><text x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18px" fill="%23666666">Screenshot missing: ${tutorialSteps[currentStep].image}</text><text x="50%25" y="60%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14px" fill="%23555555">(Please add it to the public/tutorial folder)</text></svg>`;
                }}
              />
            </div>

            {/* Textos y Controles */}
            <div className="w-full mt-5 flex flex-col gap-2">
              <h3 className="font-bold text-foreground text-lg">{tutorialSteps[currentStep].title}</h3>
              <p className="text-sm text-(--color-muted) min-h-[40px] leading-relaxed">{tutorialSteps[currentStep].desc}</p>

              {/* Controles de Navegación */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-0 disabled:pointer-events-none hover:bg-black/5 dark:hover:bg-white/5 text-foreground"
                >
                  {t("tut_prev")}
                </button>

                <div className="flex gap-2">
                  {tutorialSteps.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentStep(idx)}
                      aria-label={`Go to step ${idx + 1}`}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentStep ? 'bg-foreground w-4' : 'bg-foreground/20 hover:bg-foreground/50'}`}
                    />
                  ))}
                </div>

                <button
                  onClick={currentStep === tutorialSteps.length - 1 ? onClose : nextStep}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-foreground text-background hover:opacity-90 transition-opacity shadow-sm"
                >
                  {currentStep === tutorialSteps.length - 1 ? t("tut_finish") : t("tut_next")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contenido: Colaboradores */}
        {activeTab === "collaborators" && (
          <div className="animate-fade-in">
            <div className="text-sm text-(--color-muted) mb-4">
              <p>{t("credits_desc")}</p>
            </div>
            <div className="flex flex-col gap-3">
              {collaborators.map(collaborator => (
                <div key={collaborator.id} className="flex items-center justify-between p-3 rounded-xl border border-(--color-border) hover:bg-black/3 dark:hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm">
                      {collaborator.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{collaborator.name}</div>
                      <div className="text-xs text-(--color-muted)">{collaborator.role[language as 'en' | 'es']}</div>
                    </div>
                  </div>
                  {collaborator.socials && collaborator.socials.length > 0 && (
                    <div className="flex gap-2 text-(--color-muted)">
                      {collaborator.socials.map((social, index) => (
                        <a key={index} href={social.url} target="_blank" rel="noopener noreferrer" className="p-1 hover:text-foreground transition-colors">
                          {renderSocialIcon(social.url)}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
