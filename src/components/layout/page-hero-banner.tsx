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
    <section className="relative overflow-hidden bg-[color:var(--color-gb-blue-deep)] py-14 text-white md:py-18">
      <div className="pointer-events-none absolute inset-0 hero-pattern opacity-[0.035]" />
      <div className="pointer-events-none absolute -top-32 -right-32 h-[520px] w-[520px] rounded-full bg-[color:var(--color-gb-blue)] opacity-[0.13] blur-[90px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[280px] w-[280px] rounded-full bg-[color:var(--color-gb-gold)] opacity-[0.07] blur-[80px]" />

      <div className="container-x relative">
        <div
          className={`grid gap-8 ${
            hasRightCol
              ? coverCard
                ? "lg:grid-cols-[1fr_380px] lg:items-center"
                : "lg:grid-cols-[1fr_auto] lg:items-center"
              : ""
          }`}
        >
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/15 px-3.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-300 backdrop-blur-md shadow-2xs">
                {BadgeIcon && <BadgeIcon className="h-3.5 w-3.5 text-amber-300" />}
                {badgeLabel}
              </span>
              {subBadge && (
                <span className="rounded-md border border-white/15 bg-white/10 px-2.5 py-0.5 font-mono text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/70 backdrop-blur-sm">
                  {subBadge}
                </span>
              )}
            </div>

            <h1 className="mt-4 font-academic text-3xl font-bold leading-[1.18] tracking-tight text-white sm:text-4xl md:text-[2.6rem]">
              {title}
            </h1>
            <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-slate-200/90 max-w-xl">
              {description}
            </p>

            {actions && <div className="mt-6 flex flex-wrap items-center gap-3">{actions}</div>}

            {tags && tags.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/10 pt-4 text-[10px] font-bold text-white/60">
                {tags.map((t) => {
                  const TagIcon = t.icon;
                  return (
                    <span key={t.label} className="inline-flex items-center gap-1.5">
                      {TagIcon && <TagIcon className="h-3.5 w-3.5 text-amber-300" />}
                      {t.label}
                    </span>
                  );
                })}
              </div>
            )}

            {children}
          </div>

          {coverCard ? (
            <div className="mx-auto w-full max-w-sm lg:max-w-none space-y-3">
              <div className="group/cover relative overflow-hidden rounded-[24px] border border-white/25 bg-white/[0.08] p-2.5 shadow-[0_24px_60px_rgba(11,18,61,0.25)] backdrop-blur-xl transition-all hover:border-amber-400/40 hover:bg-white/[0.12]">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] bg-[color:var(--color-gb-blue-deep)]">
                  <Image
                    src={coverCard.imageSrc}
                    alt={coverCard.title}
                    fill
                    priority
                    sizes="(max-width: 1023px) 100vw, 380px"
                    className="object-cover transition-transform duration-700 ease-out group-hover/cover:scale-[1.05]"
                  />
                  <span className="pointer-events-none absolute inset-y-0 left-0 z-20 w-3.5 bg-gradient-to-r from-[#060b2f]/90 via-black/40 to-transparent border-r border-white/15" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1448]/90 via-[#0b1448]/30 to-transparent z-10" />

                  <div className="absolute inset-x-0 bottom-0 z-20 p-4 pl-6">
                    {coverCard.date && (
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/20 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-amber-300 backdrop-blur-md shadow-xs">
                        <CalendarDays className="h-3 w-3" />
                        {coverCard.date}
                      </div>
                    )}
                    <p className="mt-2 font-academic text-sm font-bold leading-snug text-white line-clamp-2">
                      {coverCard.title}
                    </p>
                  </div>
                </div>
                {(coverCard.footerLeft || coverCard.footerRight) && (
                  <div className="flex items-center justify-between px-3 pt-2.5 pb-1 text-[9px] font-black uppercase tracking-[0.18em] text-white/70">
                    <span>{coverCard.footerLeft}</span>
                    <span className="font-mono text-amber-300">{coverCard.footerRight}</span>
                  </div>
                )}
              </div>

              {stats && stats.length > 0 && (
                <div className="flex items-center justify-around divide-x divide-white/15 rounded-2xl border border-white/15 bg-white/[0.06] p-3 shadow-md backdrop-blur-md">
                  {stats.map((s) => (
                    <div key={s.label} className="flex-1 text-center px-2">
                      <p className="font-academic text-lg font-black text-amber-300 sm:text-xl">{s.val}</p>
                      <p className="mt-0.5 text-[8.5px] font-extrabold uppercase tracking-[0.14em] text-white/60">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}
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
