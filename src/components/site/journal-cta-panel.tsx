import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Clock, Mail, MapPin, Send, type LucideIcon } from "lucide-react";
import { cmsIcon } from "@/lib/cms/icons";
import type { ResolvedSection } from "@/lib/cms/page-content";
import { ButtonLink } from "./button-link";

type CmsLink = { label: string; href: string };

/** CMS meta shape of every page's closing "cta" section. */
export interface JournalCtaPanelMeta {
  badgeIcon?: string;
  pills?: { icon?: string; label: string }[];
  ctas?: CmsLink[];
  contactEyebrow?: string;
  contactTag?: string;
  contactTitle?: string;
  contactText?: string;
  emailLabel?: string;
  email?: string;
  locationLabel?: string;
  location?: string;
  responseLabel?: string;
  response?: string;
  contactLink?: CmsLink;
}

const PILL_ICON_CLASSES = ["text-emerald-400", "text-blue-400", "text-amber-400"];

/**
 * The dark closing band every public page ends with: badge, heading, intro, feature
 * pills and two actions, beside the editorial secretariat contact card.
 */
export function JournalCtaPanel({
  section,
  ariaLabel = "Call for papers",
  badgeFallbackIcon = Send,
  pillFallbackIcons = [CheckCircle2],
}: {
  section: ResolvedSection<JournalCtaPanelMeta>;
  ariaLabel?: string;
  badgeFallbackIcon?: LucideIcon;
  pillFallbackIcons?: LucideIcon[];
}) {
  const meta = section.meta;
  const BadgeIcon = cmsIcon(meta.badgeIcon, badgeFallbackIcon);
  const pills = Array.isArray(meta.pills) ? meta.pills : [];
  const ctas = Array.isArray(meta.ctas) ? meta.ctas : [];
  const [primary, secondary] = ctas;

  const contactRows = [
    meta.email && {
      icon: Mail,
      label: meta.emailLabel,
      value: (
        <a href={`mailto:${meta.email}`} className="text-xs text-white hover:text-amber-300 underline mt-0.5 block transition-colors">
          {meta.email}
        </a>
      ),
    },
    meta.location && {
      icon: MapPin,
      label: meta.locationLabel,
      value: <p className="text-xs text-slate-300 mt-0.5">{meta.location}</p>,
    },
    meta.response && {
      icon: Clock,
      label: meta.responseLabel,
      value: <p className="text-xs text-slate-300 mt-0.5">{meta.response}</p>,
    },
  ].filter(Boolean) as { icon: LucideIcon; label?: string; value: React.ReactNode }[];

  return (
    <section aria-label={ariaLabel} className="py-14 sm:py-20 bg-white">
      <div className="container-x">
        <div className="relative overflow-hidden bg-gb-night text-white border border-slate-800 shadow-[0_20px_50px_rgba(3,8,22,0.45)] p-8 sm:p-12 lg:p-14">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-amber-400 via-blue-500 to-transparent" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 bg-blue-600/10 blur-[100px]" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 bg-amber-500/10 blur-[90px]" />

          <div className="relative grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-10 lg:gap-14 items-center">
            <div>
              {section.subtitle && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/25 text-amber-300 text-[10.5px] font-bold uppercase tracking-[0.18em]">
                  <BadgeIcon className="h-3.5 w-3.5" />
                  <span>{section.subtitle}</span>
                </div>
              )}

              <h2 className="mt-4 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-white leading-[1.15]">
                {section.title}
              </h2>

              {section.content && (
                <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">{section.content}</p>
              )}

              {pills.length > 0 && (
                <ul className="mt-6 flex flex-wrap items-center gap-2 text-xs">
                  {pills.map((pill, idx) => {
                    const Icon = cmsIcon(pill.icon, pillFallbackIcons[idx % pillFallbackIcons.length]);
                    return (
                      <li
                        key={`${pill.label}-${idx}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold"
                      >
                        <Icon className={`h-3.5 w-3.5 ${PILL_ICON_CLASSES[idx % PILL_ICON_CLASSES.length]}`} />
                        {pill.label}
                      </li>
                    );
                  })}
                </ul>
              )}

              {(primary?.label || secondary?.label) && (
                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  {primary?.label && (
                    <ButtonLink href={primary.href} variant="accent" icon={ArrowUpRight}>
                      {primary.label}
                    </ButtonLink>
                  )}
                  {secondary?.label && (
                    <ButtonLink href={secondary.href} variant="inverse" icon={ArrowUpRight}>
                      {secondary.label}
                    </ButtonLink>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white/5 border border-white/12 p-6 sm:p-8 backdrop-blur-sm flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-amber-300">{meta.contactEyebrow}</p>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{meta.contactTag}</span>
                </div>

                <h3 className="mt-3 font-academic text-xl font-medium text-white">{meta.contactTitle}</h3>
                {meta.contactText && <p className="mt-2 text-xs text-slate-300 leading-relaxed">{meta.contactText}</p>}

                {contactRows.length > 0 && (
                  <div className="mt-5 space-y-3.5 border-t border-white/10 pt-4 text-xs text-slate-200">
                    {contactRows.map(({ icon: Icon, label, value }, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Icon className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          {label && <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{label}</p>}
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {meta.contactLink?.label && (
                <div className="mt-6 pt-4 border-t border-white/10">
                  <Link
                    href={meta.contactLink.href || "/contact"}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 uppercase tracking-wider transition-colors"
                  >
                    <span>{meta.contactLink.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
