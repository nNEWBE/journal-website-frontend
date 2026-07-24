import React from "react";
import Image from "next/image";
import { CalendarDays, LucideIcon } from "lucide-react";

export type HeroStat = {
  val: string;
  label: string;
};

export type HeroTag = {
  label: string;
  icon?: LucideIcon;
};

export type HeroCoverCard = {
  imageSrc: string;
  title: string;
  date?: string;
  footerLeft?: string;
  footerRight?: string;
};

export type PageHeroBannerProps = {
  badgeLabel: string;
  badgeIcon?: LucideIcon;
  subBadge?: string;
  title: React.ReactNode;
  description: string;
  tags?: HeroTag[];
  stats?: HeroStat[];
  actions?: React.ReactNode;
  coverCard?: HeroCoverCard;
  children?: React.ReactNode;
};

export function PageHeroBanner({
  badgeLabel,
  badgeIcon: BadgeIcon,
  subBadge,
  title,
  description,
  tags,
  stats,
  actions,
  coverCard,
  children,
}: PageHeroBannerProps) {
  const hasRightCol = (stats && stats.length > 0) || Boolean(coverCard);

  return (
    <section className="relative overflow-hidden bg-[color:var(--color-gb-blue-deep)]">
      <div className="pointer-events-none absolute inset-0 hero-pattern opacity-[0.035]" />
      <div className="pointer-events-none absolute -top-32 -right-32 h-[520px] w-[520px] rounded-full bg-[color:var(--color-gb-blue)] opacity-[0.13] blur-[90px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[280px] w-[280px] rounded-full bg-[color:var(--color-gb-gold)] opacity-[0.07] blur-[80px]" />

      <div className="container-x relative py-7 md:py-9">
        <div
          className={`grid gap-7 ${
            hasRightCol ? (coverCard ? "lg:grid-cols-[1fr_360px] lg:items-center" : "lg:grid-cols-[1fr_auto] lg:items-center") : ""
          }`}
        >
          {/* Left column */}
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/70 backdrop-blur-sm">
                {BadgeIcon && <BadgeIcon className="h-3 w-3 text-amber-300" />}
                {badgeLabel}
              </span>
              {subBadge && (
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
                  {subBadge}
                </span>
              )}
            </div>

            <h1 className="mt-3 font-academic text-2xl font-bold leading-snug tracking-[-0.02em] text-white md:text-3xl lg:text-4xl">
              {title}
            </h1>
            <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-white/60">
              {description}
            </p>

            {/* Action buttons if provided */}
            {actions && <div className="mt-5 flex flex-wrap items-center gap-3">{actions}</div>}

            {/* Stats row under actions if coverCard is present */}
            {coverCard && stats && stats.length > 0 && (
              <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-2.5 backdrop-blur-sm max-w-lg">
                {stats.map((s) => (
                  <div key={s.label} className="px-2 py-1">
                    <p className="font-academic text-base font-black text-white">{s.val}</p>
                    <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-wider text-white/40">{s.label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Tags row */}
            {tags && tags.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-white/10 pt-3.5 text-[10px] font-bold text-white/50">
                {tags.map((t) => {
                  const TagIcon = t.icon;
                  return (
                    <span key={t.label} className="inline-flex items-center gap-1.5">
                      {TagIcon && <TagIcon className="h-3 w-3 text-amber-300" />}
                      {t.label}
                    </span>
                  );
                })}
              </div>
            )}

            {children}
          </div>

          {/* Right column: Stats grid OR Cover card */}
          {coverCard ? (
            <div className="mx-auto w-full max-w-sm lg:max-w-none">
              <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.05] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.28)] backdrop-blur-md">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-900">
                  <Image
                    src={coverCard.imageSrc}
                    alt={coverCard.title}
                    fill
                    priority
                    sizes="(max-width: 1023px) 100vw, 360px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060b2f]/95 via-[#060b2f]/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3.5">
                    {coverCard.date && (
                      <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-amber-300">
                        <CalendarDays className="h-3 w-3" />
                        {coverCard.date}
                      </div>
                    )}
                    <p className="mt-1 font-academic text-sm font-bold leading-snug text-white line-clamp-2">
                      {coverCard.title}
                    </p>
                  </div>
                </div>
                {(coverCard.footerLeft || coverCard.footerRight) && (
                  <div className="flex items-center justify-between px-2 pt-2 pb-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white/40">
                    <span>{coverCard.footerLeft}</span>
                    <span>{coverCard.footerRight}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            stats &&
            stats.length > 0 && (
              <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-sm sm:grid-cols-4 lg:grid-cols-2 lg:w-[320px]">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                    <p className="font-academic text-lg font-black text-white">{s.val}</p>
                    <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/40">{s.label}</p>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
