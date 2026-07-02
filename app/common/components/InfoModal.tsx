"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/app/common/context/LanguageContext";
import Modal from "@/app/common/components/Modal";
import UserGuide from "@/app/common/components/info/UserGuide";
import CollaboratorsList from "@/app/common/components/info/CollaboratorsList";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  const { t } = useLanguage();

  // Tabs management
  const [activeTab, setActiveTab] = useState<"guide" | "collaborators">("guide");
  const [displayedTab, setDisplayedTab] = useState<"guide" | "collaborators">("guide");

  // Animation states: 'idle' | 'exiting' | 'entering'
  const [animState, setAnimState] = useState<'idle' | 'exiting' | 'entering'>('idle');
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const ANIMATION_DELAY = 150; // 150ms
  const TRANSITION_DURATION = 150; // 150ms

  const handleTabChange = (newTab: "guide" | "collaborators") => {
    if (newTab === activeTab || animState !== 'idle') return;

    setDirection(newTab === "guide" ? 'left' : 'right');
    setActiveTab(newTab);
    setAnimState('exiting');
  };

  useEffect(() => {
    if (animState === 'exiting') {
      const exitTimer = setTimeout(() => {
        setDisplayedTab(activeTab);
        setAnimState('entering');
      }, TRANSITION_DURATION);
      return () => clearTimeout(exitTimer);
    } else if (animState === 'entering') {
      const enterTimer = setTimeout(() => {
        setAnimState('idle');
      }, ANIMATION_DELAY); // Esperamos a que el Modal cambie su altura antes de mostrar
      return () => clearTimeout(enterTimer);
    }
  }, [animState, activeTab]);

  // Clases CSS dinámicas para la animación manual
  let contentClass = "transition-all duration-150 ";
  if (animState === 'idle') {
    contentClass += "opacity-100 translate-x-0 ease-out";
  } else if (animState === 'exiting') {
    contentClass += `opacity-0 ease-in ${direction === 'left' ? '-translate-x-5' : 'translate-x-5'}`;
  } else if (animState === 'entering') {
    // Al entrar (antes del delay), lo preparamos desplazado pero sin transición (duration-0 o simplemente no seteamos opacity-100)
    contentClass = `opacity-0 ${direction === 'left' ? '-translate-x-5' : 'translate-x-5'}`;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("information")}>
      {/* Pestañas */}
      <div className="flex border-b border-(--color-border) mb-6">
        <button
          onClick={() => handleTabChange("guide")}
          className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === "guide" ? "border-foreground text-foreground" : "border-transparent text-(--color-muted) hover:text-foreground"}`}
        >
          {t("user_guide")}
        </button>
        <button
          onClick={() => handleTabChange("collaborators")}
          className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === "collaborators" ? "border-foreground text-foreground" : "border-transparent text-(--color-muted) hover:text-foreground"}`}
        >
          {t("collaborators")}
        </button>
      </div>

      <div className="relative w-full">
        <div className={`w-full flex flex-col ${contentClass}`}>
          {displayedTab === "guide" && <UserGuide onClose={onClose} />}
          {displayedTab === "collaborators" && <CollaboratorsList />}
        </div>
      </div>
    </Modal>
  );
}
