"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  BookmarkCheck,
  BookOpen,
  CalendarDays,
  Check,
  Download,
  Eye,
  FileText,
  Globe2,
  Info,
  Quote,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Article } from "@/lib/data";

type CurrentIssue = {
  id: string;
  volume: string;
  issue: string;
  month: string;
  theme: string;
  articleCount: number;
  articles: Article[];
};

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.06 },
  },
};

const journalDetails = [
  { label: "ISSN Online", value: "2959-1082", mono: true },
  { label: "ISSN Print", value: "2959-1074", mono: true },
  { label: "Publication", value: "Semi-annual" },
  { label: "Peer review", value: "Double blind" },
];

const indexes = [
  "Google Scholar",
  "BanglaJOL",
  "Crossref",
  "DOAJ",
  "ResearchGate",
  "LOCKSS",
];

export function HomeJournalShowcase({
  featuredArticle,
  currentIssue,
}: {
  featuredArticle: Article;
  currentIssue: CurrentIssue;
}) {
  return (
    <section className="journal-showcase relative overflow-hidden py-16 md:py-20">
      <div className="showcase-aurora pointer-events-none absolute inset-0" />
      <div className="container-x relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={stagger}
          className="grid items-start gap-7 lg:grid-cols-[minmax(0,1.48fr)_minmax(310px,0.52fr)]"
        >
          <motion.article
            variants={reveal}
            className="editorial-card group relative overflow-hidden rounded-[28px] border border-white/80 bg-white p-2 shadow-[0_24px_70px_rgba(17,27,82,0.10)]"
          >
            <div className="relative overflow-hidden rounded-[22px] border border-slate-200/70 bg-[linear-gradient(135deg,#f9fbff_0%,#ffffff_58%,#fffaf0_100%)] p-5 sm:p-7 lg:p-8">
              <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[color:var(--color-gb-gold)]/[0.07] blur-3xl transition-transform duration-700 group-hover:scale-125" />
              <div className="pointer-events-none absolute -bottom-36 left-1/3 h-72 w-72 rounded-full bg-[color:var(--color-gb-blue)]/[0.07] blur-3xl transition-transform duration-700 group-hover:scale-110" />

              <div className="relative mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="feature-kicker-icon flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--color-gb-blue-deep)] text-white shadow-lg shadow-blue-950/15">
                    <BookmarkCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--color-gb-gold-dark)]">
                      Editor&apos;s selection
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-slate-500">
                      Featured research
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-emerald-800">
                  <Globe2 className="h-3.5 w-3.5" />
                  Open access
                </span>
              </div>

              <div className="relative grid gap-7 md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[230px_minmax(0,1fr)]">
                <Link
                  href={`/articles/${featuredArticle.slug}`}
                  className="feature-cover group/cover relative mx-auto block aspect-[4/5] w-full max-w-[230px] overflow-hidden rounded-2xl bg-slate-900 shadow-[0_24px_46px_rgba(11,18,61,0.22)] focus-ring md:mx-0"
                >
                  <Image
                    src={featuredArticle.image || "/covers/medical.png"}
                    alt=""
                    fill
                    sizes="(max-width: 767px) 230px, 230px"
                    className="object-cover transition-transform duration-700 ease-out group-hover/cover:scale-[1.055]"
                  />
                  <span className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/30 to-transparent" />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color:var(--color-gb-blue-deep)]/45 via-transparent to-white/5 opacity-70 transition-opacity duration-500 group-hover/cover:opacity-35" />
                  <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-950/55 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-white backdrop-blur-md">
                    <FileText className="h-3 w-3" />
                    {featuredArticle.type}
                  </span>
                </Link>

                <div className="flex min-w-0 flex-col justify-center">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-amber-800">
                      {featuredArticle.topic}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      {featuredArticle.publishedAt}
                    </span>
                  </div>

                  <Link
                    href={`/articles/${featuredArticle.slug}`}
                    className="focus-ring rounded-sm"
                  >
                    <h2 className="font-academic text-[1.65rem] font-bold leading-[1.17] tracking-[-0.025em] text-[color:var(--color-gb-blue-deep)] transition-colors duration-300 hover:text-[color:var(--color-gb-blue)] sm:text-3xl">
                      {featuredArticle.title}
                    </h2>
                  </Link>

                  <p className="mt-3 text-xs font-semibold leading-relaxed text-slate-500">
                    <span className="text-slate-400">By</span>{" "}
                    {featuredArticle.authors.join(", ")}
                  </p>

                  <div className="relative mt-5 border-l-2 border-[color:var(--color-gb-gold)]/60 pl-4">
                    <Quote className="absolute -left-2.5 -top-3 h-5 w-5 bg-white p-0.5 text-[color:var(--color-gb-gold)]" />
                    <p className="line-clamp-3 text-[13px] leading-6 text-slate-600">
                      {featuredArticle.abstract}
                    </p>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-2">
                    {[
                      {
                        icon: Eye,
                        value: featuredArticle.metrics.views.toLocaleString(),
                        label: "Views",
                      },
                      {
                        icon: Download,
                        value: featuredArticle.metrics.downloads.toLocaleString(),
                        label: "Downloads",
                      },
                      {
                        icon: BookOpen,
                        value: featuredArticle.metrics.citations.toLocaleString(),
                        label: "Citations",
                      },
                    ].map((metric) => {
                      const Icon = metric.icon;
                      return (
                        <div
                          key={metric.label}
                          className="metric-chip rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2.5 backdrop-blur-sm"
                        >
                          <div className="flex items-center gap-1.5">
                            <Icon className="h-3.5 w-3.5 text-[color:var(--color-gb-blue)]" />
                            <span className="text-sm font-black text-[color:var(--color-gb-blue-deep)]">
                              {metric.value}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
                            {metric.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex flex-col gap-3 border-t border-slate-200/80 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="truncate font-mono text-[9px] font-medium text-slate-400">
                      DOI: {featuredArticle.doi}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {featuredArticle.pdf && (
                        <a
                          href={featuredArticle.pdf}
                          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-[11px] font-extrabold text-[color:var(--color-gb-blue-deep)] shadow-sm hover:-translate-y-0.5 hover:border-[color:var(--color-gb-blue)]/40 hover:shadow-md focus-ring"
                          download
                        >
                          <Download className="h-3.5 w-3.5" />
                          PDF
                        </a>
                      )}
                      <Link
                        href={`/articles/${featuredArticle.slug}`}
                        className="group/button inline-flex min-h-10 items-center gap-2 rounded-full bg-[color:var(--color-gb-blue-deep)] px-5 text-[11px] font-extrabold text-white shadow-lg shadow-blue-950/20 hover:-translate-y-0.5 hover:bg-[color:var(--color-gb-blue)] focus-ring"
                      >
                        Read article
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.article>

          <motion.aside variants={stagger} className="space-y-5 lg:sticky lg:top-24">
            <motion.div
              variants={reveal}
              className="journal-detail-card overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_18px_50px_rgba(17,27,82,0.08)]"
            >
              <div className="bg-[color:var(--color-gb-blue-deep)] px-5 py-5 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-300">
                      Publication record
                    </p>
                    <h3 className="mt-1.5 font-academic text-xl font-bold">
                      Journal at a glance
                    </h3>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-amber-300">
                    <Info className="h-4 w-4" />
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4 text-[10px] font-semibold text-white/60">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  Verified academic metadata
                </div>
              </div>
              <dl className="divide-y divide-slate-100 px-5">
                {journalDetails.map((detail) => (
                  <div
                    key={detail.label}
                    className="journal-detail-row flex items-center justify-between gap-4 py-4"
                  >
                    <dt className="text-[11px] font-semibold text-slate-500">
                      {detail.label}
                    </dt>
                    <dd
                      className={`text-right text-[11px] font-extrabold text-[color:var(--color-gb-blue-deep)] ${
                        detail.mono ? "font-mono tracking-tight" : ""
                      }`}
                    >
                      {detail.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mx-5 mb-5 rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Published by
                </p>
                <p className="mt-1 text-xs font-extrabold text-[color:var(--color-gb-blue-deep)]">
                  Gono Bishwabidyalay Press
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={reveal}
              className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_rgba(17,27,82,0.08)]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
                  <Globe2 className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.11em] text-[color:var(--color-gb-blue-deep)]">
                    Indexed & discoverable
                  </h3>
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    Global scholarly databases
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {indexes.map((item) => (
                  <div
                    key={item}
                    className="index-pill relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-center text-[9px] font-black uppercase tracking-[0.04em] text-[color:var(--color-gb-blue-deep)]"
                  >
                    <span className="relative z-10">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.aside>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={stagger}
          className="mt-16 md:mt-20"
        >
          <motion.div
            variants={reveal}
            className="flex flex-col gap-6 border-b border-slate-200 pb-7 md:flex-row md:items-end md:justify-between"
          >
            <div className="max-w-3xl">
              <div className="current-issue-badge group mb-4 inline-flex items-center rounded-full border border-slate-200 bg-white p-1.5 pr-3 shadow-[0_8px_24px_rgba(17,27,82,0.08)]">
                <span className="current-issue-badge-icon flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--color-gb-blue-deep)] text-white shadow-md shadow-blue-950/15">
                  <BookOpen className="h-3.5 w-3.5" />
                </span>
                <span className="ml-2.5 text-[10px] font-black uppercase tracking-[0.16em] text-[color:var(--color-gb-blue-deep)]">
                  Current issue
                </span>
                <span className="mx-2.5 h-4 w-px bg-slate-200" />
                <span className="inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[color:var(--color-gb-gold-dark)]">
                  <CalendarDays className="h-3 w-3" />
                  Latest edition
                </span>
              </div>
              <h2 className="font-academic text-3xl font-bold leading-tight tracking-[-0.025em] text-[color:var(--color-gb-blue-deep)] md:text-[2.6rem]">
                {currentIssue.theme}
              </h2>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-bold text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-[color:var(--color-gb-blue)]" />
                  {currentIssue.volume}, {currentIssue.issue}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-[color:var(--color-gb-blue)]" />
                  Published {currentIssue.month}
                </span>
                <span>{currentIssue.articleCount} papers</span>
              </div>
            </div>
            <Link
              href="/issues/current"
              className="group/issue inline-flex min-h-11 w-fit items-center gap-3 rounded-full border border-slate-200 bg-white px-5 text-xs font-extrabold text-[color:var(--color-gb-blue-deep)] shadow-sm hover:-translate-y-0.5 hover:border-[color:var(--color-gb-blue)]/40 hover:shadow-lg focus-ring"
            >
              Explore full issue
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)] transition-colors group-hover/issue:bg-[color:var(--color-gb-blue)] group-hover/issue:text-white">
                <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover/issue:translate-x-0.5" />
              </span>
            </Link>
          </motion.div>

          <motion.div
            variants={stagger}
            className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {currentIssue.articles.map((article, index) => (
              <motion.article
                key={article.id}
                variants={reveal}
                className="issue-paper-card group flex min-h-full flex-col overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-[0_14px_40px_rgba(17,27,82,0.06)]"
              >
                <Link
                  href={`/articles/${article.slug}`}
                  className="relative block aspect-[16/10] overflow-hidden bg-slate-900 focus-ring"
                >
                  <Image
                    src={article.image || "/covers/medical.png"}
                    alt=""
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-gb-blue-deep)]/75 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-slate-950/50 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.13em] text-white backdrop-blur-md">
                    Paper {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="absolute bottom-4 left-4 right-4 text-[10px] font-black uppercase tracking-[0.14em] text-white/80">
                    {article.topic}
                  </span>
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[color:var(--color-gb-gold-dark)]">
                    {article.type}
                  </p>
                  <Link
                    href={`/articles/${article.slug}`}
                    className="mt-2 block rounded-sm focus-ring"
                  >
                    <h3 className="font-academic text-lg font-bold leading-snug text-[color:var(--color-gb-blue-deep)] transition-colors duration-300 group-hover:text-[color:var(--color-gb-blue)]">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="mt-2 line-clamp-1 text-[10px] font-semibold text-slate-400">
                    {article.authors.join(", ")}
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <span className="truncate font-mono text-[8px] text-slate-400">
                      {article.doi}
                    </span>
                    <Link
                      href={`/articles/${article.slug}`}
                      aria-label={`Read ${article.title}`}
                      className="paper-arrow flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)] focus-ring"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
