import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileSearch,
  Globe2,
  Library,
  Send,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { PageShell } from "@/components/page-shell";
import { ArticlesFilterForm } from "@/components/articles-filter-form";
import {
  articles,
  articleTypes,
  filterArticles,
  topics,
} from "@/lib/data";

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = String(params.q ?? "");
  const type = String(params.type ?? "");
  const topic = String(params.topic ?? "");
  const results = filterArticles(q, type, topic);
  const hasFilters = Boolean(q || type || topic);

  return (
    <PageShell>
      <section className="hero-masthead relative z-20 bg-gradient-to-br from-[#0b123d] via-[#111b52] to-[#0b123d] text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden hero-pattern" />
        <div className="container-x relative py-10 md:py-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white/70 backdrop-blur-md">
                <Library className="h-3.5 w-3.5 text-white/60" />
                <span>Research Archive</span>
              </span>
              <h1 className="mt-4 font-academic text-3xl font-bold leading-[1.08] tracking-[-0.03em] text-white sm:text-4xl md:text-[42px]">
                Discover research with context and clarity
              </h1>
              <p className="mt-3.5 max-w-xl text-xs leading-6 text-white/60 md:text-sm">
                Search the journal&apos;s peer-reviewed record by title, author,
                DOI, subject, or article type. Every publication includes
                citation metadata and a permanent article page.
              </p>
            </div>

            <div className="grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/15 bg-white/[0.06] p-4 shadow-[0_28px_70px_rgba(0,0,0,0.24)] backdrop-blur-md">
              <div className="px-2.5 text-center">
                <p className="text-2xl font-black tracking-tight text-white">
                  {articles.length}
                </p>
                <p className="mt-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-white/50">
                  Articles
                </p>
              </div>
              <div className="px-2.5 text-center">
                <p className="text-2xl font-black tracking-tight text-white">
                  {topics.length}
                </p>
                <p className="mt-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-white/50">
                  Subjects
                </p>
              </div>
              <div className="px-2.5 text-center">
                <p className="text-2xl font-black tracking-tight text-amber-400">
                  100%
                </p>
                <p className="mt-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-white/50">
                  Open Access
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <ArticlesFilterForm
              initialQ={q}
              initialType={type}
              initialTopic={topic}
              articleTypes={articleTypes}
              topics={topics}
            />
          </div>
        </div>
      </section>

      <section className="container-x py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[color:var(--color-gb-blue)]">
                  <FileSearch className="h-3.5 w-3.5" />
                  {hasFilters ? "Search results" : "All publications"}
                </p>
                <h2 className="mt-1.5 font-academic text-2xl font-bold tracking-[-0.02em] text-[color:var(--color-gb-blue-deep)] md:text-3xl">
                  {results.length} article{results.length === 1 ? "" : "s"} found
                </h2>
                {hasFilters && (
                  <p className="mt-1.5 text-xs text-slate-500">
                    Filtered by {[q, type, topic].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>

              {hasFilters ? (
                <Link
                  href="/articles"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-600 hover:text-rose-700 transition-colors"
                >
                  <span>Clear all filters</span>
                </Link>
              ) : (
                <Link
                  href="/issues"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[color:var(--color-gb-blue)] hover:text-[color:var(--color-gb-blue-deep)] transition-colors"
                >
                  <span>Browse by issue</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>

            {results.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-6 py-16 text-center">
                <FileSearch className="mx-auto h-8 w-8 text-slate-300" />
                <h2 className="mt-4 font-academic text-xl font-bold text-[color:var(--color-gb-blue-deep)]">
                  No matching articles
                </h2>
                <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-500">
                  Try a broader keyword, choose a different subject, or clear the
                  current filters to view the complete archive.
                </p>
                <Link
                  href="/articles"
                  className="mt-5 inline-flex min-h-10 items-center justify-center rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 text-xs font-black text-slate-950 shadow-xs transition-all hover:from-amber-300 hover:to-amber-400"
                >
                  <span>View all articles</span>
                </Link>
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-4">
                {results.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    variant="editorial"
                  />
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.1em] text-[color:var(--color-gb-blue-deep)]">
                <Tag className="h-3.5 w-3.5 text-[color:var(--color-gb-blue)]" />
                <span>Browse by Subject</span>
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {topics.map((t) => {
                  const isActive = topic === t;
                  return (
                    <Link
                      key={t}
                      href={`/articles?topic=${encodeURIComponent(t)}`}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-[color:var(--color-gb-blue-deep)] text-white shadow-xs"
                          : "bg-slate-100/80 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900"
                      }`}
                    >
                      {t}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-5 shadow-xs">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/15 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-amber-800">
                <Send className="h-3 w-3" />
                <span>Call for Manuscripts</span>
              </span>
              <h4 className="mt-3 font-academic text-base font-bold text-slate-900">
                Publish your research with GBJR
              </h4>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                Double-blind peer review, permanent Crossref DOI indexing, and open access dissemination.
              </p>
              <Link
                href="/dashboard/submissions/new"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2.5 text-xs font-black text-slate-950 shadow-xs transition-all hover:from-amber-300 hover:to-amber-400"
              >
                <span>Submit manuscript</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-black uppercase tracking-[0.1em] text-[color:var(--color-gb-blue-deep)]">
                Journal Credentials
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">ISSN (Online)</span>
                  <span className="font-mono font-bold text-slate-900">2959-1082</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">ISSN (Print)</span>
                  <span className="font-mono font-bold text-slate-900">2959-1074</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Review Policy</span>
                  <span className="font-semibold text-slate-900">Double Blind</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">License</span>
                  <span className="font-semibold text-emerald-700">CC BY 4.0</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-12 grid gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:grid-cols-3 md:p-6">
          {[
            {
              icon: ShieldCheck,
              title: "Peer reviewed",
              text: "Independent double-blind editorial assessment.",
            },
            {
              icon: Globe2,
              title: "Openly accessible",
              text: "Research prepared for broad scholarly discovery.",
            },
            {
              icon: BookOpen,
              title: "Citation ready",
              text: "Stable DOI, issue, page, and author metadata.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-xs font-bold text-[color:var(--color-gb-blue-deep)]">
                  {title}
                </h3>
                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
