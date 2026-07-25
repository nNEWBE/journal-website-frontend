"use client";

import Link from "next/link";
import { ArrowUpRight, ClipboardCheck, Globe2, Library, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const easing = [0.22, 1, 0.36, 1] as const;

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: easing },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const capabilities = [
  {
    number: "01",
    icon: ClipboardCheck,
    title: "Rigorous peer review",
    text: "A transparent double-blind workflow from editorial screening through reviewer assessment and final decision.",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Editorial governance",
    text: "Clear assignments, conflict checks, decision records, and issue planning for editors and section leads.",
  },
  {
    number: "03",
    icon: Library,
    title: "Long-term archiving",
    text: "Persistent DOI records, searchable references, usage metrics, and durable access to the scholarly record.",
  },
  {
    number: "04",
    icon: Globe2,
    title: "Open scholarship",
    text: "Research published for broad discovery, responsible reuse, and meaningful academic and public reach.",
  },
];

interface HomeCapabilitiesSectionProps {
  topics?: string[];
}

export function HomeCapabilitiesSection({ topics = [] }: HomeCapabilitiesSectionProps) {
  return (
    <section className="story-topics relative overflow-hidden border-t border-slate-200/70 py-20 md:py-28">
      <div className="story-topics-orb pointer-events-none absolute -left-48 top-8 h-96 w-96 rounded-full blur-3xl" />
      <div className="container-x relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16"
        >
          <motion.div variants={reveal} className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center gap-3">
              <span className="story-number">01</span>
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--color-gb-gold-dark)]">
                Research gateway
              </span>
            </div>
            <h2 className="mt-5 max-w-lg font-academic text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-[color:var(--color-gb-blue-deep)] md:text-5xl">
              Explore knowledge across disciplines
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-600">
              Find peer-reviewed research by subject, then move seamlessly from
              abstract to evidence, references, metrics, and the full published
              paper.
            </p>
            <div className="mt-7 flex items-center gap-5 border-y border-slate-200 py-4">
              {[
                ["8", "Subject areas"],
                ["286", "Published papers"],
                ["Open", "Reader access"],
              ].map(([value, label], index) => (
                <div key={label} className="contents">
                  {index > 0 && <span className="h-8 w-px bg-slate-200" />}
                  <div>
                    <p
                      className={`text-xl font-black ${
                        value === "Open"
                          ? "text-emerald-700"
                          : "text-[color:var(--color-gb-blue-deep)]"
                      }`}
                    >
                      {value}
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      {label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {topics.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <Link
                    href={`/articles?topic=${encodeURIComponent(topic)}`}
                    key={topic}
                    className="topic-link group/topic inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-[0.04em] text-[color:var(--color-gb-blue-deep)] shadow-sm focus-ring"
                  >
                    {topic}
                    <ArrowUpRight className="h-3 w-3 text-slate-300 transition-all duration-300 group-hover/topic:-translate-y-0.5 group-hover/topic:translate-x-0.5 group-hover/topic:text-[color:var(--color-gb-blue)]" />
                  </Link>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div variants={stagger} className="grid gap-4 sm:grid-cols-2">
            {capabilities.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.article
                  variants={reveal}
                  key={item.title}
                  className={`capability-card group relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_48px_rgba(17,27,82,0.07)] ${
                    index % 2 === 1 ? "sm:translate-y-8" : ""
                  }`}
                >
                  <span className="absolute right-5 top-5 font-mono text-[10px] font-bold text-slate-300">
                    {item.number}
                  </span>
                  <div className="capability-icon flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-7 font-academic text-xl font-bold text-[color:var(--color-gb-blue-deep)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-xs leading-6 text-slate-500">
                    {item.text}
                  </p>
                  <div className="mt-6 h-px w-full overflow-hidden bg-slate-100">
                    <span className="capability-line block h-full w-full bg-gradient-to-r from-[color:var(--color-gb-gold)] to-[color:var(--color-gb-blue)]" />
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
