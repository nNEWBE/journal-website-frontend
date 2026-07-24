"use client";

import type { ReactNode } from "react";
import {
  Archive,
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  FileCheck2,
  Gavel,
  SearchCheck,
  ShieldCheck,
  Users,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const easing = [0.22, 1, 0.36, 1] as const;

const processStepIcons = {
  archive: Archive,
  book: BookOpen,
  clipboard: ClipboardCheck,
  file: FileCheck2,
  gavel: Gavel,
  search: SearchCheck,
  shield: ShieldCheck,
  users: Users,
} as const;

export type ProcessStepIcon = keyof typeof processStepIcons;

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

export interface ProcessStep {
  number: string;
  icon: ProcessStepIcon;
  title: string;
  description: string;
}

export interface ProcessStepsProps {
  sectionLabel?: string;
  sectionNumber?: string;
  heading: string;
  description?: string;
  steps: ProcessStep[];
  bannerTitle?: string;
  footerNote?: string;
  badgeText?: string;
  className?: string;
}

export function ProcessSteps({
  sectionLabel,
  sectionNumber,
  heading,
  description,
  steps,
  bannerTitle = "Documented editorial pathway",
  footerNote = "A traceable route from initial files to the published record.",
  badgeText = "COPE-Aligned Practice",
  className = "",
}: ProcessStepsProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className={`relative overflow-hidden bg-[#f7f8fc] py-12 md:py-16 ${className}`}
    >

      <div className="container-x relative">
        <Reveal>
          <div>
            {(sectionNumber || sectionLabel) && (
              <div className="mb-4 flex items-center gap-2">
                {sectionNumber && (
                  <span className="font-mono text-[11px] font-extrabold tracking-[0.08em] text-slate-400">
                    {sectionNumber}
                  </span>
                )}
                {sectionLabel && (
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[color:var(--color-gb-gold-dark)]">
                    {sectionLabel}
                  </span>
                )}
              </div>
            )}

            <h2 className="max-w-3xl font-academic text-3xl font-bold leading-[1.14] tracking-[-0.035em] text-[color:var(--color-gb-blue-deep)] md:text-4xl lg:text-[2.65rem]">
              {heading}
            </h2>
            {description && (
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                {description}
              </p>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.08} className="mt-9 md:mt-10">
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_12px_40px_rgba(11,18,61,0.06)]">
            <div className="flex flex-col gap-2 bg-[color:var(--color-gb-blue-deep)] px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-white/90">
                <ShieldCheck
                  className="h-4 w-4 text-[color:var(--color-gb-gold)] shrink-0"
                  aria-hidden="true"
                />
                {bannerTitle}
              </p>
              <p className="text-xs font-semibold text-white/55">
                {steps.length} connected stages
              </p>
            </div>

            <div className="relative">
              <motion.ol
                aria-label={heading}
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
                className="relative lg:grid lg:grid-cols-5"
              >
                {steps.map(
                  ({ number, icon, title, description: stepDesc }, index) => {
                    const Icon =
                      typeof icon === "string" ? processStepIcons[icon] : icon;

                    return (
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
                      className="group relative grid grid-cols-[48px_minmax(0,1fr)] gap-4 px-5 py-5 lg:block lg:min-h-[286px] lg:border-r lg:border-slate-200 lg:px-6 lg:py-6 lg:last:border-r-0"
                    >
                      {/* Mobile vertical connector segment above icon badge */}
                      {index > 0 && (
                        <span
                          className="pointer-events-none absolute left-[43.5px] top-0 h-5 w-px bg-slate-200 lg:hidden"
                          aria-hidden="true"
                        />
                      )}

                      {/* Mobile vertical connector segment below icon badge */}
                      {index < steps.length - 1 && (
                        <span
                          className="pointer-events-none absolute bottom-0 left-[43.5px] top-[68px] w-px bg-slate-200 lg:hidden"
                          aria-hidden="true"
                        />
                      )}

                      <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-[color:var(--color-gb-blue)] shadow-[0_6px_18px_rgba(11,18,61,0.08)] transition-colors duration-300 group-hover:border-[color:var(--color-gb-gold)]/45 group-hover:bg-[color:var(--color-gb-blue-soft)] lg:hidden">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-500">
                            Stage {number}
                          </span>
                        </div>

                        <div className="relative mt-5 hidden h-12 items-center justify-center lg:flex">
                          <span
                            className={`pointer-events-none absolute top-1/2 h-px -translate-y-1/2 bg-slate-200 ${
                              index === 0
                                ? "left-1/2 -right-6"
                                : index === steps.length - 1
                                ? "-left-6 right-1/2"
                                : "-left-6 -right-6"
                            }`}
                            aria-hidden="true"
                          />

                          <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-[color:var(--color-gb-blue)] shadow-[0_6px_18px_rgba(11,18,61,0.08)] transition-all duration-300 group-hover:border-[color:var(--color-gb-gold)]/45 group-hover:bg-[color:var(--color-gb-blue-soft)]">
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </span>

                          {index < steps.length - 1 && (
                            <span
                              className="absolute -right-6 top-1/2 z-20 flex h-5 w-5 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-amber-300/80 bg-white text-[color:var(--color-gb-gold-dark)] shadow-xs"
                              aria-hidden="true"
                            >
                              <ArrowRight className="h-3 w-3" />
                            </span>
                          )}
                        </div>

                        <div className="mt-2 lg:mt-6">
                          <h3 className="text-[15px] font-extrabold leading-5 text-[color:var(--color-gb-blue-deep)]">
                            {title}
                          </h3>
                          <p className="mt-2.5 text-[13px] leading-6 text-slate-600">
                            {stepDesc}
                          </p>
                        </div>
                      </div>
                    </motion.li>
                    );
                  },
                )}
              </motion.ol>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200/80 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              {footerNote && (
                <p className="text-xs font-semibold text-slate-600">
                  {footerNote}
                </p>
              )}
              {badgeText && (
                <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200/90 bg-white px-3.5 py-1.5 shadow-2xs">
                  <ShieldCheck
                    className="h-4 w-4 text-[color:var(--color-gb-gold-dark)] shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-bold text-[color:var(--color-gb-blue-deep)]">
                    {badgeText}
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
