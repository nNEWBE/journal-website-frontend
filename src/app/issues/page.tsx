import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  FileArchive,
  FileText,
  Globe2,
  Library,
  ShieldCheck,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { issues } from "@/lib/data";

import { PageHeroBanner } from "@/components/page-hero-banner";

export default function IssuesPage() {
  const currentIssue = issues[0];
  const years = [...new Set(issues.map((i) => i.year))];
  const totalArticles = issues.reduce((sum, i) => sum + i.articleCount, 0);

  return (
    <PageShell>
      {/* ── Hero ──────────────────────────────────── */}
      <PageHeroBanner
        badgeLabel="Journal Archive"
        badgeIcon={Library}
        title="Issues & volumes"
        description="Browse the complete publication record by year, volume, and issue. Each edition brings together peer-reviewed research from across the university's academic community."
        tags={[
          { label: "Peer-reviewed editions", icon: ShieldCheck },
          { label: "Open access", icon: Globe2 },
          { label: "January & July", icon: CalendarDays },
        ]}
        stats={[
          { val: String(issues.length), label: "Published issues" },
          { val: String(years.length), label: "Archive years" },
          { val: String(totalArticles), label: "Published articles" },
          { val: currentIssue.volume, label: "Current volume" },
        ]}
      />

      {/* ── Current Issue Feature ─────────────────── */}
      <section className="container-x py-14 md:py-18">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-[color:var(--color-gb-gold-dark)]">
              <BookOpen className="h-3.5 w-3.5" />
              Featured Edition
            </p>
            <h2 className="mt-1.5 font-academic text-2xl font-bold tracking-tight text-[color:var(--color-gb-blue-deep)] md:text-3xl">
              Current issue
            </h2>
          </div>
          <span className="hidden font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:block">
            {currentIssue.volume} · {currentIssue.issue}
          </span>
        </div>

        <div className="grid overflow-hidden rounded-3xl border border-slate-200/80 bg-[color:var(--color-gb-blue-deep)] shadow-[0_20px_60px_rgba(11,18,61,0.16)] lg:grid-cols-[0.85fr_1.15fr]">
          {/* Cover image */}
          <div className="relative min-h-[280px] overflow-hidden lg:min-h-[360px]">
            <Image
              src={currentIssue.articles[0]?.image || "/covers/medical.png"}
              alt={currentIssue.theme}
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060b2f]/70 via-[#060b2f]/20 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-slate-950/50 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                <CalendarDays className="h-3 w-3 text-amber-300" />
                {currentIssue.month}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="relative flex flex-col justify-center p-7 text-white md:p-10 lg:p-12">
            <div className="pointer-events-none absolute right-8 top-8 font-mono text-6xl font-black text-white/[0.05]">
              {currentIssue.year}
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-white/55">
              <BookOpen className="h-3 w-3 text-amber-300" />
              Now publishing
            </span>

            <h3 className="mt-5 max-w-lg font-academic text-2xl font-bold leading-tight text-white md:text-3xl">
              {currentIssue.theme}
            </h3>
            <p className="mt-3 max-w-md text-xs leading-6 text-white/50">
              Explore a cross-disciplinary collection focused on public wellbeing,
              institutional stewardship, and resilient systems.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-5 text-[10px] font-semibold text-white/40">
              <span>{currentIssue.volume}</span>
              <span>{currentIssue.issue}</span>
              <span>{currentIssue.articleCount} articles</span>
              <span>ISSN 2959-1082</span>
            </div>

            <Link
              href="/issues/current"
              className="mt-7 inline-flex min-h-[46px] w-fit items-center gap-2 rounded-xl bg-white px-6 text-sm font-extrabold text-[color:var(--color-gb-blue-deep)] shadow-sm transition-all hover:bg-amber-50 hover:-translate-y-0.5 hover:shadow-md"
            >
              Explore current issue
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Archive by year ───────────────────────── */}
      <section className="border-t border-slate-200 bg-[#f8fafc] py-10 md:py-14">
        <div className="container-x">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-slate-200/80 pb-5">
            <div>
              <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-[color:var(--color-gb-gold-dark)]">
                <FileArchive className="h-3.5 w-3.5" />
                Publication record
              </p>
              <h2 className="mt-1 font-academic text-2xl font-bold tracking-tight text-[color:var(--color-gb-blue-deep)] md:text-3xl">
                Browse the archive by year
              </h2>
            </div>
            <p className="max-w-md text-xs text-slate-500">
              Every edition is freely accessible. Select any issue to explore published papers.
            </p>
          </div>

          <div className="space-y-10">
            {years.map((year) => {
              const yearIssues = issues.filter((i) => i.year === year);
              return (
                <section
                  key={year}
                  aria-labelledby={`archive-year-${year}`}
                  className="rounded-2xl border border-slate-200/70 bg-white p-5 sm:p-7 shadow-xs"
                >
                  {/* Year Header Strip */}
                  <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--color-gb-blue-deep)] font-mono text-sm font-black text-white shadow-xs">
                        {year}
                      </div>
                      <div>
                        <h3 id={`archive-year-${year}`} className="text-sm font-bold text-[color:var(--color-gb-blue-deep)]">
                          {year} Volume Archive
                        </h3>
                        <p className="text-[10px] font-medium text-slate-400">
                          {yearIssues.length} Published Edition{yearIssues.length === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>
                    <span className="hidden sm:inline-flex rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500">
                      Volume {yearIssues[0]?.volume.replace("Vol ", "") || ""}
                    </span>
                  </div>

                  {/* Issue cards grid */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {yearIssues.map((iss) => {
                      const isCurrent = iss.id === currentIssue.id;

                      return (
                        <Link
                          key={iss.id}
                          href={isCurrent ? "/issues/current" : `/articles`}
                          className={`group relative flex flex-col justify-between rounded-xl border p-5 transition-all duration-200 ${
                            isCurrent
                              ? "border-[color:var(--color-gb-blue)]/30 bg-gradient-to-br from-white to-blue-50/40 shadow-sm hover:shadow-md"
                              : "border-slate-200/80 bg-slate-50/50 hover:border-slate-300 hover:bg-white hover:shadow-sm"
                          }`}
                        >
                          <div>
                            {/* Card top badges */}
                            <div className="flex items-center justify-between gap-2">
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[color:var(--color-gb-blue)]">
                                <CalendarDays className="h-3 w-3" />
                                {iss.month}
                              </span>
                              {isCurrent ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald-700">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  Current Issue
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                                  <FileText className="h-2.5 w-2.5" />
                                  Archived
                                </span>
                              )}
                            </div>

                            <h4 className="mt-3 font-academic text-base font-bold leading-snug text-[color:var(--color-gb-blue-deep)] group-hover:text-[color:var(--color-gb-blue)] transition-colors">
                              {iss.theme}
                            </h4>
                          </div>

                          <div className="mt-4 flex items-center justify-between border-t border-slate-200/60 pt-3">
                            <span className="text-[11px] font-medium text-slate-500">
                              {iss.volume} · {iss.issue} · <strong className="text-slate-700">{iss.articleCount} articles</strong>
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-[color:var(--color-gb-blue)] opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                              <span>Read</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
