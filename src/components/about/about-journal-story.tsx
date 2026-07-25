"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ProcessSteps } from "@/components/ui/process-steps";
import type { ProcessStep } from "@/components/ui/process-steps";
import { HeroActionButton } from "@/components/ui/hero-action-button";
import { PublishingCharterSection } from "@/components/ui/publishing-charter-section";
import {
  Archive,
  ArrowRight,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Cpu,
  Globe2,
  GraduationCap,
  HeartPulse,
  Landmark,
  Library,
  Link2,
  PawPrint,
  Pill,
  Scale,
  ShieldCheck,
  Sprout,
  Stethoscope,
  Users,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const easing = [0.22, 1, 0.36, 1] as const;

const publishingCommitments = [
  {
    number: "01",
    icon: ClipboardCheck,
    title: "Independent peer review",
    text: "Research and review articles are assessed through a double-blind process by qualified subject specialists.",
  },
  {
    number: "02",
    icon: Globe2,
    title: "Open scholarly access",
    text: "Published work is available for reading and responsible reuse without a subscription barrier.",
  },
  {
    number: "03",
    icon: Scale,
    title: "Publication ethics",
    text: "Authorship, conflicts, funding, consent, corrections, and research integrity follow defined policies.",
  },
  {
    number: "04",
    icon: Archive,
    title: "Durable article records",
    text: "Every publication is prepared with stable metadata, an enduring record, and DOI information where applicable.",
  },
];

const editorialSteps: ProcessStep[] = [
  {
    number: "01",
    icon: "file",
    title: "Submission",
    description: "Files, metadata, authorship, and declarations enter one record.",
  },
  {
    number: "02",
    icon: "shield",
    title: "Screening",
    description: "Scope, completeness, ethics, and originality are checked.",
  },
  {
    number: "03",
    icon: "users",
    title: "Peer review",
    description: "Independent experts assess the scholarly contribution.",
  },
  {
    number: "04",
    icon: "clipboard",
    title: "Decision",
    description: "Reports and author revisions inform the editorial outcome.",
  },
  {
    number: "05",
    icon: "book",
    title: "Publication",
    description: "The version of record is prepared for open discovery.",
  },
];

const registries = [
  { icon: Link2, label: "Crossref DOI records" },
  { icon: GraduationCap, label: "Google Scholar-ready metadata" },
  { icon: Library, label: "BanglaJOL journal record" },
  { icon: Globe2, label: "Creative Commons licensing" },
  { icon: Scale, label: "COPE-aligned policies" },
  { icon: Archive, label: "Open archive access" },
];

const topicIcons = {
  "Public Health": HeartPulse,
  Pharmacy: Pill,
  "Medical Sciences": Stethoscope,
  "Veterinary Sciences": PawPrint,
  "Social Sciences": Users,
  "Law and Governance": Scale,
  Agriculture: Sprout,
  Technology: Cpu,
};

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
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: reduceMotion ? 0 : 0.6, delay, ease: easing }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AboutJournalStory({ topics }: { topics: string[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <section
        className="bg-[#fbfcff] py-12 md:py-16 lg:py-20"
        aria-labelledby="publishing-purpose-heading"
      >
        <div className="container-x grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-start lg:gap-16 xl:gap-20">
          <Reveal>
            <div className="flex items-center gap-2.5">
              <span
                className="font-mono text-[11px] font-extrabold tracking-[0.08em] text-slate-400"
                aria-hidden="true"
              >
                01
              </span>
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[color:var(--color-gb-gold-dark)]">
                Why we publish
              </span>
            </div>

            <h2
              id="publishing-purpose-heading"
              className="mt-5 max-w-lg font-academic text-3xl font-bold leading-[1.14] tracking-[-0.035em] text-[color:var(--color-gb-blue-deep)] md:text-4xl lg:text-[2.55rem]"
            >
              A university journal with a public purpose
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
              Scholarship is recorded, peer-reviewed, and made useful across research disciplines.
            </p>

            <blockquote className="mt-6 max-w-lg border-l-2 border-[color:var(--color-gb-gold)] pl-4">
              <p className="font-academic text-base font-bold leading-7 text-[color:var(--color-gb-blue-deep)]">
                &ldquo;Helping credible research travel from author to global reader through peer review.&rdquo;
              </p>
            </blockquote>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="max-w-2xl font-academic text-xl font-bold leading-snug tracking-[-0.02em] text-[color:var(--color-gb-blue-deep)] md:text-2xl">
              Advancing peer-reviewed research for academic, institutional, and public practice.
            </p>

            <div className="mt-6 grid border-t border-slate-200 sm:grid-cols-2">
              <article className="border-b border-slate-200 py-5 sm:border-r sm:pr-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
                    <BookOpen className="h-4.5 w-4.5" aria-hidden="true" />
                  </span>
                  <h3 className="font-academic text-base font-bold text-[color:var(--color-gb-blue-deep)]">
                    Publication scope
                  </h3>
                </div>
                <p className="mt-3 text-xs leading-6 text-slate-600">
                  Original research, reviews, case studies, and scholarly papers selected by academic merit.
                </p>
              </article>

              <article className="border-b border-slate-200 py-5 sm:pl-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
                    <Landmark className="h-4.5 w-4.5" aria-hidden="true" />
                  </span>
                  <h3 className="font-academic text-base font-bold text-[color:var(--color-gb-blue-deep)]">
                    Institutional stewardship
                  </h3>
                </div>
                <p className="mt-3 text-xs leading-6 text-slate-600">
                  Published by Gono Bishwabidyalay across science, health, technology, and social sciences.
                </p>
              </article>
            </div>

            <dl className="grid border-b border-slate-200 sm:grid-cols-3">
              {[
                {
                  value: String(topics.length),
                  label: "Academic fields",
                  icon: GraduationCap,
                },
                {
                  value: "2",
                  label: "Editions yearly",
                  icon: CalendarDays,
                },
                {
                  value: "Open",
                  label: "Reader access",
                  icon: Globe2,
                },
              ].map(({ value, label, icon: StatIcon }, index) => (
                <div
                  key={label}
                  className={`flex items-center justify-between py-4 sm:flex-col sm:items-start sm:justify-start sm:py-5 ${index === 0
                    ? "sm:pr-4"
                    : "border-t border-slate-200 sm:border-l sm:border-t-0 sm:px-4"
                    }`}
                >
                  <dt className="order-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-500 sm:order-2 sm:mt-2 sm:text-[9px]">
                    {label}
                  </dt>
                  <dd className="order-2 flex items-center gap-2.5 sm:order-1">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-[color:var(--color-gb-gold-dark)]">
                      <StatIcon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="font-academic text-xl font-bold text-[color:var(--color-gb-blue-deep)]">
                      {value}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[color:var(--color-gb-blue-deep)] py-12 text-white md:py-16">
        <div className="pointer-events-none absolute inset-0 hero-pattern opacity-[0.035]" />
        <div className="container-x relative grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] font-black text-white/25">
                02
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-300">
                Aims and scope
              </span>
            </div>
            <h2 className="mt-5 max-w-lg font-academic text-3xl font-bold leading-tight tracking-[-0.03em] text-white md:text-4xl">
              Research without disciplinary silos
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-white/55">
              The journal welcomes work rooted in a clear field as well as
              research that connects methods, evidence, and questions across
              disciplinary boundaries.
            </p>
            <Link
              href="/articles"
              className="mt-7 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-amber-300 focus-ring"
            >
              Explore published research
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Reveal>

          <motion.div
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: reduceMotion ? 0 : 0.06 },
              },
            }}
            className="grid border-l border-t border-white/10 sm:grid-cols-2"
          >
            {topics.map((topic) => {
              const Icon =
                topicIcons[topic as keyof typeof topicIcons] ?? BookOpen;

              return (
                <motion.div
                  key={topic}
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.45, ease: easing },
                    },
                  }}
                  className="group flex min-h-24 items-center gap-4 border-b border-r border-white/10 p-5 transition-colors hover:bg-white/[0.045]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-amber-300 transition-colors group-hover:bg-white/10">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="text-xs font-black leading-5 text-white/80">
                    {topic}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <PublishingCharterSection
        sectionNumber="03"
        sectionLabel="Publishing charter"
        heading="Standards readers and authors can rely on"
        description="Quality is not a decorative claim. It is a set of repeatable editorial responsibilities applied to every manuscript and every published record."
        buttonText="Read journal policies"
        buttonHref="/policies"
        commitments={publishingCommitments}
      />

      <ProcessSteps
        sectionNumber="04"
        sectionLabel="Editorial lifecycle"
        heading="How research becomes part of the scholarly record"
        description="Defined stages make responsibility visible while keeping authors informed from first upload to the version of record."
        steps={editorialSteps}
      />

      <section
        className="border-t border-slate-200/80 bg-[#f8f9fc] py-12 md:py-16"
        aria-labelledby="discovery-registries-heading"
      >
        <div className="container-x">
          <Reveal>
            <div className="grid overflow-hidden rounded-[28px] border border-slate-200/90 bg-white shadow-[0_20px_60px_rgba(11,18,61,0.08)] lg:grid-cols-[1.15fr_0.85fr]">
              <div className="p-6 sm:p-8 xl:p-10">
                <div className="flex items-center gap-2.5">
                  <span
                    className="font-mono text-[11px] font-extrabold tracking-[0.08em] text-slate-400"
                    aria-hidden="true"
                  >
                    05
                  </span>
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[color:var(--color-gb-gold-dark)]">
                    Discovery and registries
                  </span>
                </div>
                <h2
                  id="discovery-registries-heading"
                  className="mt-5 max-w-xl font-academic text-3xl font-bold leading-[1.16] tracking-[-0.035em] text-[color:var(--color-gb-blue-deep)] md:text-4xl"
                >
                  Prepared to be found and cited
                </h2>

                <div className="mt-7 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
                    <Library className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="text-sm font-extrabold text-[color:var(--color-gb-blue-deep)]">
                    Registry and access framework
                  </p>
                </div>

                <ul
                  className="mt-5 grid gap-3 sm:grid-cols-2"
                  aria-label="Discovery registries and publication standards"
                >
                  {registries.map(({ icon: Icon, label }) => (
                    <li
                      key={label}
                      className="flex min-h-16 items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 px-4 py-3.5"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[color:var(--color-gb-blue)] shadow-[0_4px_12px_rgba(11,18,61,0.06)]">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="text-[13px] font-bold leading-5 text-slate-700">
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <article
                className="m-2 flex flex-col justify-between rounded-[22px] bg-[color:var(--color-gb-blue-deep)] p-6 text-white sm:p-8 xl:p-10"
                aria-labelledby="institutional-stewardship-heading"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-amber-300">
                      <Landmark className="h-4.5 w-4.5" aria-hidden="true" />
                    </span>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-amber-300">
                      Institutional stewardship
                    </p>
                  </div>
                  <h3
                    id="institutional-stewardship-heading"
                    className="mt-5 max-w-lg font-academic text-2xl font-bold leading-[1.2] text-white md:text-3xl"
                  >
                    Published with academic responsibility
                  </h3>
                  <p className="mt-4 max-w-[58ch] text-sm leading-7 text-white/65">
                    Gono Bishwabidyalay supports the journal through defined
                    editorial roles, independent academic evaluation,
                    transparent policies, and long-term stewardship of the
                    publication record.
                  </p>
                </div>

                <div className="mt-7 flex flex-row items-center gap-2.5 sm:gap-3">
                  <HeroActionButton
                    href="/editorial-board"
                    variant="white"
                    hasArrow
                  >
                    <span className="sm:hidden">Governance</span>
                    <span className="hidden sm:inline">
                      Editorial governance
                    </span>
                  </HeroActionButton>
                  <HeroActionButton
                    href="/contact"
                    variant="secondary"
                    hasArrow
                  >
                    <span className="sm:hidden">Contact</span>
                    <span className="hidden sm:inline">Contact the office</span>
                  </HeroActionButton>
                </div>
              </article>
            </div>
          </Reveal>
        </div>

        <Reveal className="container-x mt-10">
          <div className="flex flex-col gap-5 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[color:var(--color-gb-gold-dark)]">
                Continue exploring
              </p>
              <h2 className="mt-2 font-academic text-2xl font-bold text-[color:var(--color-gb-blue-deep)]">
                Explore the journal&apos;s scholarly record
              </h2>
            </div>
            <div className="flex flex-row items-center gap-2.5 sm:gap-3">
              <HeroActionButton
                href="/issues/current"
                variant="dark"
                hasArrow
              >
                <span className="sm:hidden">Current issue</span>
                <span className="hidden sm:inline">Read current issue</span>
              </HeroActionButton>
              <HeroActionButton
                href="/contact"
                variant="outline"
              >
                <span className="sm:hidden">Contact</span>
                <span className="hidden sm:inline">Contact journal</span>
              </HeroActionButton>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

export default AboutJournalStory;
