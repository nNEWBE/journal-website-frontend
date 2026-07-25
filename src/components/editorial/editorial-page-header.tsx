import React, { ElementType, ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { PolicyFrameworkCard, PolicyFrameworkCardProps } from "@/components/ui/policy-framework-card";
import { SupportingTag } from "@/components/ui/badge";

export type SupportingItem = {
  label: string;
  icon?: ElementType;
};

export type EditorialPageHeaderProps = {
  icon: LucideIcon;
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
  supporting?: ReactNode;
  supportingBadges?: SupportingItem[];
  aside?: ReactNode;
  frameworkCard?: PolicyFrameworkCardProps;
  className?: string;
};

export function EditorialPageHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  actions,
  supporting,
  supportingBadges,
  aside,
  frameworkCard,
  className = "",
}: EditorialPageHeaderProps) {
  const asideContent = aside || (frameworkCard ? <PolicyFrameworkCard {...frameworkCard} /> : null);

  return (
    <section className={`relative overflow-hidden bg-[color:var(--color-gb-blue-deep)] text-white ${className}`}>
      <div className="pointer-events-none absolute inset-0 hero-pattern opacity-[0.035]" />
      <div className="pointer-events-none absolute -top-32 -right-32 h-[520px] w-[520px] rounded-full bg-[color:var(--color-gb-blue)] opacity-[0.13] blur-[90px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[280px] w-[280px] rounded-full bg-[color:var(--color-gb-gold)] opacity-[0.07] blur-[80px]" />

      <div
        className={`container-x relative grid gap-8 py-12 md:py-16 ${
          asideContent
            ? "lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center"
            : ""
        }`}
      >
        <div className={asideContent ? "max-w-2xl" : "mx-auto max-w-3xl text-center"}>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
            <Icon className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
            {eyebrow}
          </span>

          <h1 className="mt-4 font-academic text-3xl font-bold leading-tight tracking-[-0.025em] text-white md:text-4xl lg:text-5xl">
            {title}
          </h1>

          <div
            className={`mt-4 text-xs leading-relaxed text-white/60 md:text-sm ${
              asideContent ? "max-w-xl" : "mx-auto max-w-2xl"
            }`}
          >
            {description}
          </div>

          {actions && (
            <div
              className={`mt-6 flex flex-wrap items-center gap-3 ${
                asideContent ? "" : "justify-center"
              }`}
            >
              {actions}
            </div>
          )}

          {(supportingBadges || supporting) && (
            <div
              className={`mt-6 flex flex-wrap items-center gap-2 border-t border-white/10 pt-5 ${
                asideContent ? "" : "justify-center"
              }`}
            >
              {supportingBadges
                ? supportingBadges.map(({ label, icon: BadgeIcon }) => (
                    <SupportingTag key={label} icon={BadgeIcon}>
                      {label}
                    </SupportingTag>
                  ))
                : supporting}
            </div>
          )}
        </div>

        {asideContent && <div className="w-full">{asideContent}</div>}
      </div>
    </section>
  );
}

export const EditorialHeroSection = EditorialPageHeader;
