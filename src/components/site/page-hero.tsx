import type { ReactNode } from "react";
import { ArrowUpRight, BookOpen, Landmark, ShieldCheck, type LucideIcon } from "lucide-react";
import type { ResolvedSection } from "@/lib/cms/page-content";
import { CmsText } from "@/lib/cms/cms-text";
import { cmsIcon } from "@/lib/cms/icons";
import { ButtonLink, type ButtonLinkVariant } from "./button-link";

export type SpecTone = "default" | "mono" | "accent" | "success";

export interface HeroSpec {
  label: string;
  value: string;
  tone?: SpecTone | string;
}

/** CMS meta shape every page hero uses (src/lib/cms/defaults/<page>.json → sections.hero.meta). */
export interface PageHeroMeta {
  badgeIcon?: string;
  institution?: string;
  highlights?: { icon?: string; label: string }[];
  ctas?: { label: string; href: string; icon?: string; variant?: string }[];
  cardMonogram?: string;
  cardEyebrow?: string;
  cardTitle?: string;
  cardBadge?: string;
  specs?: HeroSpec[];
  noteLabel?: string;
  noteText?: string;
}

const SPEC_TONE_CLASSES: Record<SpecTone, string> = {
  default: "font-semibold text-slate-900 text-right",
  mono: "font-mono font-bold text-slate-900",
  accent: "font-mono font-bold text-gb-accent",
  success: "font-semibold text-emerald-700",
};

const CTA_VARIANTS: ButtonLinkVariant[] = ["primary", "secondary", "tertiary"];

/**
 * The hero every content page opens with: eyebrow, h1, intro, highlight row and
 * actions on the left; the journal "specification" card on the right.
 */
export function PageHero({
  section,
  ariaLabel,
  eyebrowIcon = BookOpen,
  highlightIcons = [ShieldCheck],
  specsBefore = [],
  children,
}: {
  section: ResolvedSection<PageHeroMeta>;
  ariaLabel: string;
  /** Fallback icon for the eyebrow badge (overridden by meta.badgeIcon). */
  eyebrowIcon?: LucideIcon;
  /** Fallback icons for the highlight row, by position. */
  highlightIcons?: LucideIcon[];
  /** Live rows (e.g. counts from the API) shown above the CMS spec rows. */
  specsBefore?: HeroSpec[];
  /** Extra content under the actions. */
  children?: ReactNode;
}) {
  const meta = section.meta;
  const EyebrowIcon = cmsIcon(meta.badgeIcon, eyebrowIcon);
  const highlights = Array.isArray(meta.highlights) ? meta.highlights : [];
  const ctas = Array.isArray(meta.ctas) ? meta.ctas : [];
  const specs = [...specsBefore, ...(Array.isArray(meta.specs) ? meta.specs : [])];
  const hasCard = Boolean(meta.cardTitle || specs.length > 0);

  return (
    <section aria-label={ariaLabel} className="border-b border-slate-200/90 bg-white py-12 sm:py-16 lg:py-20">
      <div className="container-x">
        <div
          className={
            hasCard
              ? "grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-10 lg:gap-14 items-start"
              : "max-w-4xl"
          }
        >
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              {section.subtitle && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-gb-accent text-[10px] font-bold uppercase tracking-[0.16em] border border-slate-200/80">
                  <EyebrowIcon className="h-3.5 w-3.5" />
                  {section.subtitle}
                </span>
              )}
              {meta.institution && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                  <Landmark className="h-3.5 w-3.5 text-slate-400" />
                  {meta.institution}
                </span>
              )}
            </div>

            <h1 className="mt-5 font-academic text-3xl sm:text-4xl lg:text-[2.85rem] font-medium leading-[1.12] tracking-[-0.025em] text-slate-950">
              {section.title}
            </h1>

            {section.content && (
              <p className="mt-5 text-sm sm:text-base leading-relaxed text-slate-600 max-w-2xl">
                <CmsText text={section.content} strongClassName="text-slate-900 font-semibold" />
              </p>
            )}

            {highlights.length > 0 && (
              <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-5">
                {highlights.map((item, idx) => {
                  const Icon = cmsIcon(item.icon, highlightIcons[idx % highlightIcons.length] ?? ShieldCheck);
                  return (
                    <li key={`${item.label}-${idx}`} className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-gb-accent" />
                      <span className="font-semibold text-slate-900">{item.label}</span>
                    </li>
                  );
                })}
              </ul>
            )}

            {ctas.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {ctas.map((cta, idx) => {
                  const variant = (CTA_VARIANTS as string[]).includes(cta.variant || "")
                    ? (cta.variant as ButtonLinkVariant)
                    : CTA_VARIANTS[Math.min(idx, CTA_VARIANTS.length - 1)];
                  const Icon = cmsIcon(cta.icon, variant === "primary" ? ArrowUpRight : BookOpen);
                  return (
                    <ButtonLink key={`${cta.label}-${idx}`} href={cta.href} variant={variant} icon={Icon}>
                      {cta.label}
                    </ButtonLink>
                  );
                })}
              </div>
            )}

            {children}
          </div>

          {hasCard && (
            <div className="bg-slate-50/70 border border-slate-200/90 p-6 sm:p-7">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
                <div className="flex items-center gap-2.5">
                  {meta.cardMonogram && (
                    <div className="h-8 w-8 bg-gb-navy text-white flex items-center justify-center font-bold text-xs">
                      {meta.cardMonogram}
                    </div>
                  )}
                  <div>
                    {meta.cardEyebrow && (
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gb-accent">{meta.cardEyebrow}</p>
                    )}
                    {meta.cardTitle && <p className="font-ui text-sm font-bold text-slate-900">{meta.cardTitle}</p>}
                  </div>
                </div>
                {meta.cardBadge && (
                  <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                    {meta.cardBadge}
                  </span>
                )}
              </div>

              {specs.length > 0 && (
                <dl className="mt-4 divide-y divide-slate-200/70 text-xs">
                  {specs.map((spec, idx) => (
                    <div key={`${spec.label}-${idx}`} className="py-2.5 flex items-center justify-between gap-4">
                      <dt className="text-slate-500 font-medium">{spec.label}</dt>
                      <dd className={SPEC_TONE_CLASSES[(spec.tone as SpecTone) || "default"] ?? SPEC_TONE_CLASSES.default}>
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {(meta.noteLabel || meta.noteText) && (
                <div className="mt-5 bg-white p-3.5 border border-slate-200/80 text-[11px] text-slate-600 leading-relaxed">
                  {meta.noteLabel && <span className="font-bold text-slate-900 block mb-0.5">{meta.noteLabel}</span>}
                  {meta.noteText}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
