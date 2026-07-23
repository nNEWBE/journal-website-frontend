import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  FileText,
  Library,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { issues } from "@/lib/data";

export default function IssuesPage() {
  const currentIssue = issues[0];
  const years = [...new Set(issues.map((issue) => issue.year))];
  const totalArticles = issues.reduce(
    (total, issue) => total + issue.articleCount,
    0,
  );

  return (
    <PageShell>
      <section className="relative overflow-hidden bg-[color:var(--color-gb-blue-deep)] text-white">
        <div className="pointer-events-none absolute inset-0 hero-pattern" />
        <div className="container-x relative grid gap-8 py-14 md:py-18 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white/70 backdrop-blur-md">
              <Library className="h-3.5 w-3.5 text-white/60" />
              <span>Journal Archive</span>
            </span>
            <h1 className="mt-5 font-academic text-4xl font-bold leading-[1.06] tracking-[-0.035em] text-white md:text-5xl">
              Issues and volumes
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60">
              Browse the complete publication record by year, volume, and
              issue. Each edition brings together peer-reviewed research from
              across the university&apos;s academic community.
            </p>
          </div>

          <div className="grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/15 bg-white/[0.06] px-2 py-5 shadow-[0_28px_70px_rgba(0,0,0,0.24)] backdrop-blur-md">
            <div className="px-4">
              <p className="text-2xl font-black text-white">
                {issues.length}
              </p>
              <p className="mt-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-white/50">
                Issues
              </p>
            </div>
            <div className="px-4">
              <p className="text-2xl font-black text-white">
                {years.length}
              </p>
              <p className="mt-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-white/50">
                Years
              </p>
            </div>
            <div className="px-4">
              <p className="text-2xl font-black text-white">
                {totalArticles}
              </p>
              <p className="mt-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-white/50">
                Papers
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-12 md:py-16">
        <div className="mb-6 flex items-end justify-between gap-6">
          <div>
            <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-[color:var(--color-gb-gold-dark)]">
              <BookOpen className="h-3.5 w-3.5" />
              Featured edition
            </p>
            <h2 className="mt-2 font-academic text-3xl font-bold tracking-[-0.025em] text-[color:var(--color-gb-blue-deep)]">
              Current issue
            </h2>
          </div>
          <span className="hidden font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 sm:block">
            {currentIssue.volume} / {currentIssue.issue}
          </span>
        </div>

        <div className="grid overflow-hidden rounded-[22px] border border-slate-200 bg-[color:var(--color-gb-blue-deep)] shadow-[0_22px_55px_rgba(17,27,82,0.12)] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[300px] overflow-hidden lg:min-h-[390px]">
            <Image
              src={currentIssue.articles[0]?.image || "/covers/medical.png"}
              alt=""
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060b2f]/65 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-lg border border-white/15 bg-slate-950/45 px-3 py-2 text-[9px] font-black uppercase tracking-[0.12em] text-white backdrop-blur-md">
              <CalendarDays className="h-3.5 w-3.5 text-amber-300" />
              {currentIssue.month}
            </div>
          </div>

          <div className="relative flex flex-col justify-center p-7 text-white md:p-10 lg:p-12">
            <div className="absolute right-8 top-8 font-mono text-5xl font-black text-white/[0.06]">
              {currentIssue.year}
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-white/60">
              <BookOpen className="h-3.5 w-3.5 text-amber-300" />
              Now publishing
            </span>
            <h2 className="mt-5 max-w-2xl font-academic text-3xl font-bold leading-tight text-white md:text-4xl">
              {currentIssue.theme}
            </h2>
            <p className="mt-4 max-w-xl text-xs leading-6 text-white/55">
              Explore a cross-disciplinary collection focused on public
              wellbeing, institutional stewardship, and resilient systems.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/10 pt-5 text-[10px] font-bold text-white/45">
              <span>{currentIssue.volume}</span>
              <span>{currentIssue.issue}</span>
              <span>{currentIssue.articleCount} articles</span>
            </div>

            <Link
              href="/issues/current"
              className="mt-7 inline-flex min-h-11 w-fit items-center gap-2 rounded-lg bg-white px-5 text-xs font-extrabold text-[color:var(--color-gb-blue-deep)] transition-colors hover:bg-amber-50 focus-ring"
            >
              Explore current issue
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-[#f7f8fc] py-12 md:py-16">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-[color:var(--color-gb-gold-dark)]">
              <Library className="h-3.5 w-3.5" />
              Publication record
            </p>
            <h2 className="mt-2 font-academic text-3xl font-bold tracking-[-0.025em] text-[color:var(--color-gb-blue-deep)]">
              Browse the archive by year
            </h2>
          </div>

          <div className="mt-10 space-y-12">
            {years.map((year) => {
              const yearIssues = issues.filter((issue) => issue.year === year);
              return (
                <section
                  key={year}
                  aria-labelledby={`archive-year-${year}`}
                  className="grid gap-5 md:grid-cols-[100px_minmax(0,1fr)]"
                >
                  <div>
                    <h3
                      id={`archive-year-${year}`}
                      className="font-mono text-xl font-black text-[color:var(--color-gb-blue-deep)]"
                    >
                      {year}
                    </h3>
                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      {yearIssues.length} editions
                    </p>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    {yearIssues.map((issue) => {
                      const isCurrent = issue.id === currentIssue.id;
                      const content = (
                        <>
                          <div className="flex items-start justify-between gap-4">
                            <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-[color:var(--color-gb-blue)]">
                              <CalendarDays className="h-3 w-3" />
                              {issue.month}
                            </span>
                            {isCurrent ? (
                              <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.08em] text-emerald-700">
                                <BookOpen className="h-3 w-3" />
                                Current
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.08em] text-slate-400">
                                <FileText className="h-3 w-3" />
                                Archived
                              </span>
                            )}
                          </div>
                          <h4 className="mt-4 font-academic text-xl font-bold leading-snug text-[color:var(--color-gb-blue-deep)]">
                            {issue.theme}
                          </h4>
                          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-[10px] font-semibold text-slate-400">
                            <span>
                              {issue.volume} · {issue.issue} · {issue.articleCount} articles
                            </span>
                            {isCurrent && (
                              <ArrowRight className="h-4 w-4 text-[color:var(--color-gb-blue)] transition-transform group-hover:translate-x-1" />
                            )}
                          </div>
                        </>
                      );

                      return isCurrent ? (
                        <Link
                          key={issue.id}
                          href="/issues/current"
                          className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-[color:var(--color-gb-blue)]/20 hover:shadow-[0_14px_34px_rgba(17,27,82,0.07)] focus-ring"
                        >
                          {content}
                        </Link>
                      ) : (
                        <article
                          key={issue.id}
                          className="rounded-2xl border border-slate-200 bg-white p-5"
                        >
                          {content}
                        </article>
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
