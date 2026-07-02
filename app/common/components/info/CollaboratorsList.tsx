"use client";

import React from "react";
import { useLanguage } from "@/app/common/context/LanguageContext";
import { collaborators } from "@/app/utils/storage/collaborators";
import SocialIcon from "@/app/common/components/info/SocialIcon";

export default function CollaboratorsList() {
	const { language, t } = useLanguage();

	return (
		<div>
			<div className="text-sm text-(--color-muted) mb-4">
				<p>{t("credits_desc")}</p>
			</div>
			<div className="flex flex-col gap-3">
				{collaborators.map((collaborator) => (
					<div
						key={collaborator.id}
						className="flex items-center justify-between p-3 rounded-xl border border-(--color-border) hover:bg-black/3 dark:hover:bg-white/5 transition-colors gap-4"
					>
						<div className="flex items-center gap-3 min-w-0">
							<div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm shrink-0">
								{collaborator.name.charAt(0)}
							</div>
							<div className="min-w-0">
								<div className="text-sm font-medium text-foreground wrap-break-word">
									{collaborator.name}
								</div>
								<div className="text-xs text-(--color-muted) wrap-break-word">
									{collaborator.role[language as "en" | "es"]}
								</div>
							</div>
						</div>
						{collaborator.socials && collaborator.socials.length > 0 && (
							<div className="flex gap-2 text-(--color-muted) shrink-0">
								{collaborator.socials.map((social, index) => (
									<a
										key={index}
										href={social.url}
										target="_blank"
										rel="noopener noreferrer"
										className="p-1 hover:text-foreground transition-colors"
									>
										<SocialIcon url={social.url} />
									</a>
								))}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
