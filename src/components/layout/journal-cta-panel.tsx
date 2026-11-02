import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, type LucideIcon } from "lucide-react";
import { cmsIcon } from "@/lib/cms/icons";
import type { ResolvedSection } from "@/lib/cms/page-content";

type CmsLink = { label: string; href: string };

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
  contactLink?: CmsLink;
}

/**
 * Dark CMS-driven banner shared by the articles, article detail and editorial board pages:
 * badge + heading + intro + feature pills + two buttons, and the editorial secretariat card.
 */
export function JournalCtaPanel({
  section,
  ariaLabel,
  badgeFallbackIcon,
  pillFallbackIcons,
  pillIconClasses,
}: {
  section: ResolvedSection<JournalCtaPanelMeta>;
  ariaLabel: string;
  badgeFallbackIcon: LucideIcon;
  pillFallbackIcons: LucideIcon[];
  pillIconClasses: string[];
}) {
  const meta = section.meta;
  const BadgeIcon = cmsIcon(meta.badgeIcon, badgeFallbackIcon);
  const pills = Array.isArray(meta.pills) ? meta.pills : [];
  const ctas = Array.isArray(meta.ctas) ? meta.ctas : [];
  const [primary, secondary] = ctas;

  return (
    <section aria-label={ariaLabel} className="py-14 sm:py-20 bg-white">
      <div className="container-x">
        <div className="relative overflow-hidden bg-[#060e22] text-white border border-slate-800 shadow-[0_20px_50px_rgba(3,8,22,0.45)] p-8 sm:p-12 lg:p-14">
          {/* Top gold-to-blue accent line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-amber-400 via-blue-500 to-transparent" />

          {/* Ambient background glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-600/10 blur-[100px]" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-amber-500/10 blur-[90px]" />

          <div className="relative grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-10 lg:gap-14 items-center">
            {/* Left Column */}
            <div>
              {section.subtitle && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/25 text-amber-300 text-[10.5px] font-bold uppercase tracking-[0.18em]">
                  <BadgeIcon className="h-3.5 w-3.5" />
                  <span>{section.subtitle}</span>
                </div>
              )}

              <h2 className="mt-4 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-tight text-white leading-[1.15]">
                {section.title}
              </h2>

              {section.content && (
                <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  {section.content}
                </p>
              )}

              {/* Feature Pill Tags */}
              {pills.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
                  {pills.map((pill, idx) => {
                    const Icon = cmsIcon(
                      pill.icon,
                      pillFallbackIcons[idx % pillFallbackIcons.length]
                    );
                    return (
                      <span
                        key={`${pill.label}-${idx}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold"
                      >
                        <Icon
                          className={`h-3.5 w-3.5 ${pillIconClasses[idx % pillIconClasses.length]}`}
                        />
                        {pill.label}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Primary Actions */}
              {(primary || secondary) && (
                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  {primary?.label && (
                    <Link
                      href={primary.href || "#"}
                      className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#060e22] px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                    >
                      <span>{primary.label}</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  )}
                  {secondary?.label && (
                    <Link
                      href={secondary.href || "#"}
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      <span>{secondary.label}</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Editorial Secretariat Contact Card */}
            <div className="bg-white/5 border border-white/12 p-6 sm:p-8 backdrop-blur-sm flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-amber-300">
                    {meta.contactEyebrow}
                  </p>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    {meta.contactTag}
                  </span>
                </div>

                <h3 className="mt-3 font-academic text-xl font-medium text-white">
                  {meta.contactTitle}
                </h3>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  {meta.contactText}
                </p>

                <div className="mt-5 space-y-3.5 border-t border-white/10 pt-4 text-xs text-slate-200">
                  {meta.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{meta.emailLabel}</p>
                        <a
                          href={`mailto:${meta.email}`}
                          className="text-xs text-white hover:text-amber-300 underline mt-0.5 block transition-colors"
                        >
                          {meta.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {meta.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{meta.locationLabel}</p>
                        <p className="text-xs text-slate-300 mt-0.5">
                          {meta.location}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
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
