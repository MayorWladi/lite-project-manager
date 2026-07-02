"use client";

import React, { useState } from "react";
import { useLanguage } from "@/app/common/context/LanguageContext";
import { useSettings } from "@/app/common/context/SettingsContext";

interface UserGuideProps {
	onClose: () => void;
}

export default function UserGuide({ onClose }: UserGuideProps) {
	const { t } = useLanguage();
	const { theme } = useSettings();
	const [currentStep, setCurrentStep] = useState(0);

	const tutorialSteps = [
		{ title: t("tut_step1_title"), desc: t("tut_step1_desc"), image: `/tutorial/${theme}_step1.png` },
		{ title: t("tut_step2_title"), desc: t("tut_step2_desc"), image: `/tutorial/${theme}_step2.png` },
		{ title: t("tut_step3_title"), desc: t("tut_step3_desc"), image: `/tutorial/${theme}_step3.png` },
		{ title: t("tut_step4_title"), desc: t("tut_step4_desc"), image: `/tutorial/${theme}_step4.png` },
	];

	const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, tutorialSteps.length - 1));
	const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

	return (
		<div className="flex flex-col items-center">
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
				<p className="text-sm text-(--color-muted) min-h-[40px] leading-relaxed">
					{tutorialSteps[currentStep].desc}
				</p>

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
								className={`w-2 h-2 rounded-full transition-all duration-300 ${
									idx === currentStep ? "bg-foreground w-4" : "bg-foreground/20 hover:bg-foreground/50"
								}`}
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
	);
}
