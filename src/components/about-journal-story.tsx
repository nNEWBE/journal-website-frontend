"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Archive,
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  Cpu,
  FileCheck2,
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

const editorialSteps = [
  {
    number: "01",
    icon: FileCheck2,
    title: "Submission",
    text: "Files, metadata, authorship, and declarations enter one record.",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Screening",
    text: "Scope, completeness, ethics, and originality are checked.",
  },
  {
    number: "03",
    icon: Users,
    title: "Peer review",
    text: "Independent experts assess the scholarly contribution.",
  },
  {
    number: "04",
    icon: ClipboardCheck,
    title: "Decision",
    text: "Reports and author revisions inform the editorial outcome.",
  },
  {
    number: "05",
    icon: BookOpen,
    title: "Publication",
    text: "The version of record is prepared for open discovery.",
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
      <section className="bg-white py-12 md:py-16">
        <div className="container-x grid gap-12 lg:grid-cols-[0.68fr_1.32fr] lg:items-start">
          <Reveal className="lg:sticky lg:top-24">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] font-black text-slate-300">
                01
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[color:var(--color-gb-gold-dark)]">
                Why we publish
              </span>
            </div>
            <h2 className="mt-5 max-w-md font-academic text-3xl font-bold leading-tight tracking-[-0.03em] text-[color:var(--color-gb-blue-deep)] md:text-4xl">
              A university journal with a public purpose
            </h2>
            <p className="mt-5 max-w-md text-xs leading-6 text-slate-500">
              Scholarship becomes more valuable when it is carefully assessed,
              permanently recorded, and made useful beyond a single discipline
              or campus.
            </p>
          </Reveal>

          <Reveal>
            <p className="font-academic text-2xl font-bold leading-[1.45] tracking-[-0.02em] text-[color:var(--color-gb-blue-deep)] md:text-[2rem]">
              We provide a credible home for research that advances knowledge
              and remains attentive to the needs of communities, institutions,
              and professional practice.
            </p>
            <div className="mt-8 grid gap-6 border-t border-slate-200 pt-8 md:grid-cols-2">
              <p className="text-sm leading-7 text-slate-600">
                The journal publishes original research, critical reviews, case
                studies, perspectives, and academic correspondence. Editorial
                decisions are based on scholarly merit, methodological clarity,
                ethical responsibility, and relevance to the journal&apos;s
                scope.
              </p>
              <p className="text-sm leading-7 text-slate-600">
                Published by Gono Bishwabidyalay, it creates a shared scholarly
                record across health, science, agriculture, technology, law,
                governance, and the social sciences.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-3 border-y border-slate-200 py-6">
              {[
                [String(topics.length), "Academic fields"],
                ["2", "Editions yearly"],
                ["Open", "Reader access"],
              ].map(([value, label], index) => (
                <div
                  key={label}
                  className={index === 0 ? "" : "border-l border-slate-200 pl-5"}
                >
                  <p className="font-academic text-2xl font-bold text-[color:var(--color-gb-blue-deep)]">
                    {value}
                  </p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <blockquote className="mt-10 border-l-2 border-[color:var(--color-gb-gold)] pl-6 font-academic text-xl font-bold leading-relaxed text-[color:var(--color-gb-blue-deep)] md:text-2xl">
              &ldquo;Our purpose is to help credible research travel&mdash;from
              the researcher, through rigorous review, to every reader it can
              serve.&rdquo;
            </blockquote>
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

      <section className="border-b border-slate-200 bg-[#f7f8fc] py-12 md:py-16">
        <div className="container-x grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <Reveal className="lg:sticky lg:top-24">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] font-black text-slate-300">
                03
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[color:var(--color-gb-gold-dark)]">
                Publishing charter
              </span>
            </div>
            <h2 className="mt-5 max-w-md font-academic text-3xl font-bold leading-tight tracking-[-0.03em] text-[color:var(--color-gb-blue-deep)] md:text-4xl">
              Standards readers and authors can rely on
            </h2>
            <p className="mt-5 max-w-md text-xs leading-6 text-slate-500">
              Quality is not a decorative claim. It is a set of repeatable
              editorial responsibilities applied to every manuscript and every
              published record.
            </p>
            <Link
              href="/policies"
              className="mt-7 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-[color:var(--color-gb-blue)] focus-ring"
            >
              Read journal policies
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Reveal>

          <Reveal className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {publishingCommitments.map(
              ({ number, icon: Icon, title, text }) => (
                <article
                  key={number}
                  className="group grid grid-cols-[32px_42px_minmax(0,1fr)] gap-4 border-b border-slate-100 p-5 transition-colors last:border-b-0 hover:bg-[#f9faff] md:p-6"
                >
                  <span className="pt-2 font-mono text-[9px] font-black text-slate-300">
                    {number}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)] transition-colors group-hover:bg-white group-hover:shadow-sm">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-[color:var(--color-gb-blue-deep)]">
                      {title}
                    </h3>
                    <p className="mt-2 text-xs leading-6 text-slate-500">
                      {text}
                    </p>
                  </div>
                </article>
              ),
            )}
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        <div className="container-x">
          <Reveal className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] font-black text-slate-300">
                04
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[color:var(--color-gb-gold-dark)]">
                Editorial lifecycle
              </span>
            </div>
            <h2 className="mt-5 font-academic text-3xl font-bold leading-tight tracking-[-0.03em] text-[color:var(--color-gb-blue-deep)] md:text-4xl">
              How research becomes part of the scholarly record
            </h2>
            <p className="mt-4 max-w-2xl text-xs leading-6 text-slate-500">
              Defined stages make responsibility visible while keeping authors
              informed from first upload to the version of record.
            </p>
          </Reveal>

          <div className="relative mt-12 grid gap-9 md:grid-cols-5 md:gap-6">
            <div className="pointer-events-none absolute bottom-8 left-[21px] top-[21px] w-px bg-slate-200 md:hidden" />
            <div className="pointer-events-none absolute left-[5%] right-[5%] top-[21px] hidden h-px bg-slate-200 md:block" />
            {editorialSteps.map(({ number, icon: Icon, title, text }, index) => (
              <Reveal key={number} delay={index * 0.07}>
                <article className="relative">
                  <div className="relative flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-[color:var(--color-gb-blue)] shadow-sm">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-[9px] font-black text-slate-300">
                      {number}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xs font-black text-[color:var(--color-gb-blue-deep)]">
                    {title}
                  </h3>
                  <p className="mt-2 max-w-[220px] text-xs leading-6 text-slate-500">
                    {text}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-[#f7f8fc] py-12 md:py-16">
        <div className="container-x grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal className="rounded-[20px] border border-slate-200 bg-white p-6 md:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
                <Library className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[color:var(--color-gb-gold-dark)]">
                  Discovery and registries
                </p>
                <h2 className="mt-1 font-academic text-2xl font-bold text-[color:var(--color-gb-blue-deep)]">
                  Prepared to be found and cited
                </h2>
              </div>
            </div>
            <div className="mt-7 grid gap-x-6 sm:grid-cols-2">
              {registries.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 border-b border-slate-100 py-3.5 text-xs font-bold text-slate-600"
                >
                  <Icon
                    className="h-3.5 w-3.5 text-[color:var(--color-gb-blue)]"
                    aria-hidden="true"
                  />
                  {label}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal
            delay={0.08}
            className="relative overflow-hidden rounded-[20px] bg-[color:var(--color-gb-blue-deep)] p-7 text-white md:p-8"
          >
            <div className="pointer-events-none absolute inset-0 hero-pattern opacity-[0.035]" />
            <div className="relative">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-amber-300">
                <Landmark className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-6 text-[9px] font-black uppercase tracking-[0.14em] text-amber-300">
                Institutional stewardship
              </p>
              <h2 className="mt-3 max-w-md font-academic text-3xl font-bold leading-tight text-white">
                Published with academic responsibility
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-white/55">
                Gono Bishwabidyalay supports the journal through defined
                editorial roles, independent academic evaluation, transparent
                policies, and long-term stewardship of the publication record.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/editorial-board"
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-white px-4 text-[10px] font-extrabold text-[color:var(--color-gb-blue-deep)] transition-colors hover:bg-amber-50 focus-ring"
                >
                  Editorial governance
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-4 text-[10px] font-extrabold text-white transition-colors hover:bg-white/10 focus-ring"
                >
                  Contact the office
                </Link>
              </div>
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
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/issues/current"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[color:var(--color-gb-blue-deep)] px-5 text-xs font-extrabold text-white transition-colors hover:bg-[color:var(--color-gb-blue)] focus-ring"
              >
                Read the current issue
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-xs font-extrabold text-[color:var(--color-gb-blue-deep)] transition-colors hover:border-[color:var(--color-gb-blue)]/25 hover:bg-[color:var(--color-gb-blue-soft)]/30 focus-ring"
              >
                Contact the journal
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

export default AboutJournalStory;
