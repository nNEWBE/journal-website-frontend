"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Globe2,
  LockOpen,
  Send,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const easing = [0.22, 1, 0.36, 1] as const;

export interface CtaBannerProps {
  badgeText?: string;
  badgeIcon?: React.ElementType;
  heading?: React.ReactNode;
  description?: string;
  features?: string[];
  primaryButtonText?: string;
  primaryButtonHref?: string;
  primaryButtonIcon?: React.ElementType;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  secondaryButtonIcon?: React.ElementType;
  trustNote?: string;
  className?: string;
  wrapperClassName?: string;
  children?: React.ReactNode;
}

const featureIcons: Record<string, React.ElementType> = {
  "Double-blind review": ShieldCheck,
  "Open access": LockOpen,
  "DOI registration": Globe2,
};

export function CtaBanner({
  badgeText = "Submissions are open · Vol. 2026/2027",
  badgeIcon: BadgeIcon = Send,
  heading,
  description = "Submit to a multidisciplinary, peer-reviewed journal committed to editorial care, rapid double-blind review, open access, and meaningful scholarly reach.",
  features = ["Double-blind review", "Open access", "DOI registration"],
  primaryButtonText = "Submit manuscript",
  primaryButtonHref = "/dashboard/submissions/new",
  primaryButtonIcon: PrimaryIcon = Send,
  secondaryButtonText = "Author guidelines",
  secondaryButtonHref = "/authors",
  secondaryButtonIcon: SecondaryIcon = BookOpen,
  trustNote = "COPE-aligned practice · Free open-access publication",
  className,
  wrapperClassName,
  children,
}: CtaBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: easing }}
      className={cn(
        "story-cta group relative overflow-hidden rounded-[30px] border border-white/15 bg-gradient-to-br from-[#060b22] via-[color:var(--color-gb-blue-deep)] to-[#0a1338] p-8 text-white shadow-[0_30px_80px_rgba(8,14,48,0.4)] sm:p-10 md:p-12 lg:p-14",
        wrapperClassName
      )}
    >
      {/* Top radiant border accent shimmer */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-300/70 via-blue-400/60 to-transparent" />

      {/* Atmospheric light glows */}
      <div className="story-cta-grid pointer-events-none absolute inset-0 opacity-[0.85]" />
      <div className="story-cta-glow pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[color:var(--color-gb-gold)]/20 blur-[90px]" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-[color:var(--color-gb-blue)]/30 blur-[90px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[110px]" />

      <div className={cn("relative flex flex-col gap-8", className)}>
        {/* Main Content Area */}
        <div className="max-w-3xl">
          {/* Status Eyebrow */}
          {badgeText && (
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-amber-300 backdrop-blur-md shadow-2xs">
              <span>{badgeText}</span>
            </div>
          )}

          {/* Headline with gold highlight accent */}
          {heading ? (
            typeof heading === "string" ? (
              <h2 className="mt-4 font-academic text-2xl font-bold leading-[1.16] tracking-[-0.025em] text-white sm:text-3xl md:text-4xl lg:text-[2.65rem]">
                {heading}
              </h2>
            ) : (
              heading
            )
          ) : (
            <h2 className="mt-4 font-academic text-2xl font-bold leading-[1.16] tracking-[-0.025em] text-white sm:text-3xl md:text-4xl lg:text-[2.65rem]">
              Your research deserves a{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100 bg-clip-text font-serif italic text-transparent">
                  rigorous path
                </span>
                <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-amber-300/70 to-transparent" />
              </span>{" "}
              to publication.
            </h2>
          )}

          {/* Description */}
          {description && (
            <p className="mt-4 max-w-2xl text-xs leading-6 text-white/70 sm:text-[13.5px] md:text-sm md:leading-7">
              {description}
            </p>
          )}

          {/* Glass Feature Badges */}
          {features && features.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3">
              {features.map((feature) => {
                const IconComponent = featureIcons[feature] || CheckCircle2;
                return (
                  <span
                    key={feature}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.06] px-3.5 py-1.5 text-[11px] font-bold text-white/85 backdrop-blur-md shadow-2xs transition-all hover:border-white/25 hover:bg-white/10"
                  >
                    <IconComponent className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    <span>{feature}</span>
                  </span>
                );
              })}
            </div>
          )}

          {children}
        </div>

        {/* Bottom Actions Row */}
        <div className="flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {primaryButtonText && primaryButtonHref && (
              <Link
                href={primaryButtonHref}
                className="group/btn relative inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-2xl bg-white px-7 text-xs font-black text-[color:var(--color-gb-blue-deep)] shadow-[0_12px_32px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-50 hover:shadow-[0_16px_40px_rgba(255,255,255,0.2)] active:scale-[0.98] focus-ring"
              >
                {PrimaryIcon && (
                  <PrimaryIcon className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                )}
                <span>{primaryButtonText}</span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </Link>
            )}

            {secondaryButtonText && secondaryButtonHref && (
              <Link
                href={secondaryButtonHref}
                className="group/sec inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-2xl border border-white/20 bg-white/10 px-6 text-xs font-extrabold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/20 active:scale-[0.98] focus-ring"
              >
                {SecondaryIcon && (
                  <SecondaryIcon className="h-3.5 w-3.5 shrink-0 text-amber-300" />
                )}
                <span>{secondaryButtonText}</span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover/sec:translate-x-0.5" />
              </Link>
            )}
          </div>

          {/* Trust Footer Note on Bottom Right */}
          {trustNote && (
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[11px] font-semibold text-white/60 backdrop-blur-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-300 shrink-0" />
              <span>{trustNote}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
