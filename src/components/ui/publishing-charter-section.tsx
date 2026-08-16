"use client";

import type { ElementType, ReactNode } from "react";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { HeroActionButton } from "@/components/ui/hero-action-button";
import { SupportingTag, SectionBadge } from "@/components/ui/badge";

const easing = [0.22, 1, 0.36, 1] as const;

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: reduceMotion ? 0 : 0.55, delay, ease: easing }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export interface CharterCommitmentItem {
  number: string;
  icon: ElementType;
  title: string;
  text: string;
}

export interface SupportingBadgeItem {
  label: string;
  icon?: ElementType;
}

export interface PublishingCharterSectionProps {
  sectionNumber?: string;
  sectionLabel?: string;
  heading: string;
  description?: string;
  supporting?: ReactNode;
  supportingBadges?: SupportingBadgeItem[];
  buttonText?: string;
  buttonHref?: string;
  actions?: ReactNode;
  commitments: CharterCommitmentItem[];
  centerIcon?: ElementType;
  className?: string;
}

/**
 * PublishingCharterSection — a reusable split section component combining
 * a dark left branding panel with a 2x2 grid of commitments featuring an intersection node.
 */
export function PublishingCharterSection({
  sectionNumber = "03",
  sectionLabel = "Publishing charter",
  heading,
  description,
  supporting,
  supportingBadges,
  buttonText = "Read journal policies",
  buttonHref = "/policies",
  actions,
  commitments,
  centerIcon: CenterIcon = ShieldCheck,
  className = "",
}: PublishingCharterSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className={`relative overflow-hidden bg-white py-12 md:py-16 ${className}`}
      aria-label={heading}
    >
      <div className="container-x">
        <Reveal>
          <div className="grid overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_16px_48px_rgba(11,18,61,0.07)] lg:grid-cols-[0.38fr_0.62fr]">
            {/* Left Panel */}
            <div className="relative overflow-hidden bg-[color:var(--color-gb-blue-deep)] p-7 text-white sm:p-9 lg:p-10 xl:p-12">
              <div
                className="pointer-events-none absolute inset-0 hero-pattern opacity-[0.04]"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-[color:var(--color-gb-gold)]/10 blur-3xl"
                aria-hidden="true"
              />

              <div className="relative">
                {(sectionNumber || sectionLabel) && (
                  <SectionBadge
                    number={sectionNumber}
                    label={sectionLabel}
                    variant="dark"
                  />
                )}

                <h2 className="mt-6 max-w-md font-academic text-3xl font-bold leading-[1.16] tracking-[-0.035em] text-white md:text-4xl lg:text-[2.3rem]">
                  {heading}
                </h2>
                {description && (
                  <p className="mt-5 max-w-md text-[13px] leading-7 text-white/65">
                    {description}
                  </p>
                )}

                {supportingBadges && supportingBadges.length > 0 ? (
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    {supportingBadges.map(({ label, icon: BadgeIcon }) => (
                      <SupportingTag key={label} icon={BadgeIcon}>
                        {label}
                      </SupportingTag>
                    ))}
                  </div>
                ) : supporting ? (
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    {supporting}
                  </div>
                ) : null}

                {actions ? (
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    {actions}
                  </div>
                ) : buttonText && buttonHref ? (
                  <HeroActionButton
                    href={buttonHref}
                    variant="white"
                    hasArrow
                    className="mt-7 shadow-[0_10px_24px_rgba(0,0,0,0.16)]"
                  >
                    {buttonText}
                  </HeroActionButton>
                ) : null}
              </div>
            </div>

            {/* Right 2x2 Grid */}
            <div className="relative">
              <motion.ol
                aria-label="Commitments grid"
                initial={reduceMotion ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true, amount: 0.12 }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: reduceMotion ? 0 : 0.07,
                    },
                  },
                }}
                className="grid grid-cols-2 gap-px border-t border-slate-200 bg-slate-200 lg:border-l lg:border-t-0"
              >
                {commitments.map(({ number, icon: Icon, title, text }) => (
                  <motion.li
                    key={number}
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: reduceMotion ? 0 : 0.45,
                          ease: easing,
                        },
                      },
                    }}
                    className="group relative flex min-h-[170px] flex-col overflow-hidden bg-white p-4 transition-colors duration-200 hover:bg-slate-50/80 sm:min-h-[210px] sm:p-6 md:p-7"
                  >
                    <div className="flex items-center justify-between gap-3 sm:gap-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)] shadow-[0_6px_18px_rgba(11,18,61,0.06)] sm:h-12 sm:w-12 sm:rounded-2xl">
                        <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" aria-hidden="true" />
                      </span>
                      <span className="font-mono text-[10px] font-extrabold tracking-[0.12em] text-[color:var(--color-gb-gold-dark)]">
                        {number}
                      </span>
                    </div>

                    <h3 className="mt-3.5 text-xs font-extrabold leading-snug tracking-tight text-[color:var(--color-gb-blue-deep)] sm:mt-5 sm:text-[15px]">
                      {title}
                    </h3>
                    <p className="mt-2 text-[11px] leading-5 text-slate-600 sm:mt-2.5 sm:text-xs sm:leading-6">
                      {text}
                    </p>
                  </motion.li>
                ))}
              </motion.ol>

              {/* Central grid intersection line connection node */}
              {CenterIcon && (
                <div
                  className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2"
                  aria-hidden="true"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-amber-300/90 bg-white text-[color:var(--color-gb-gold-dark)] shadow-xs">
                    <CenterIcon className="h-3.5 w-3.5" />
                  </span>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}