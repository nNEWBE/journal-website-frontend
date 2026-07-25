import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FileSearch,
  Globe2,
  Library,
  Send,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { ArticleCard } from "@/components/articles/article-card";
import { ArticlesFilterForm } from "@/components/articles/articles-filter-form";
import { PageShell } from "@/components/layout/page-shell";
import {
  articles,
  articleTypes,
  filterArticles,
  topics,
} from "@/lib/data";

import { PageHeroBanner } from "@/components/layout/page-hero-banner";

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
      {/* ── Hero ─────────────────────────────────── */}
      <PageHeroBanner
        badgeLabel="Research archive"
        badgeIcon={Library}
        title={
          <>
            Discover research{" "}
            <span className="bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">
              with context and clarity
            </span>
          </>
        }
        description="Search the journal's peer-reviewed record by title, author, DOI, subject, or article type. Every publication includes citation metadata and a permanent article page."
        tags={[
          { label: "Peer reviewed", icon: ShieldCheck },
          { label: "Open access", icon: Globe2 },
          { label: "Interdisciplinary", icon: Tag },
        ]}
        stats={[
          { val: String(articles.length), label: "Indexed articles" },
          { val: String(topics.length), label: "Subject areas" },
          { val: "Open", label: "Access model" },
          { val: "Double", label: "Blind review" },
        ]}
      />

      {/* ── Content ─────────────────────────────── */}
      <section className="bg-[#f5f7fb] py-6 md:py-8">
        <div className="container-x">
          {/* Filter form */}
          <ArticlesFilterForm
            initialQ={q}
            initialType={type}
            initialTopic={topic}
            articleTypes={articleTypes}
            topics={topics}
          />

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
            {/* Results */}
            <div>
              <div className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[color:var(--color-gb-blue)]">
                    <FileSearch className="h-3.5 w-3.5" />
                    {hasFilters ? "Search results" : "All publications"}
                  </p>
                  <h2 className="mt-1.5 font-academic text-2xl font-bold tracking-tight text-[color:var(--color-gb-blue-deep)] md:text-3xl">
                    {results.length} article{results.length === 1 ? "" : "s"} found
                  </h2>
                  {hasFilters && (
                    <p className="mt-1.5 text-xs text-slate-500">
                      Filtered by: {[q, type, topic].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>

                {hasFilters ? (
                  <Link
                    href="/articles"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] font-bold text-rose-600 transition-colors hover:bg-rose-100"
                  >
                    Clear all filters
                  </Link>
                ) : (
                  <Link
                    href="/issues"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-[color:var(--color-gb-blue)] shadow-xs transition-all hover:border-[color:var(--color-gb-blue)]/25 hover:shadow-md"
                  >
                    Browse by issue
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>

              {results.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-16 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                    <FileSearch className="h-6 w-6 text-slate-300" />
                  </div>
                  <h2 className="mt-4 font-academic text-xl font-bold text-[color:var(--color-gb-blue-deep)]">
                    No matching articles
                  </h2>
                  <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-500">
                    Try a broader keyword, choose a different subject, or clear the current filters to view the complete archive.
                  </p>
                  <Link
                    href="/articles"
                    className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[color:var(--color-gb-blue-deep)] hover:bg-[color:var(--color-gb-blue)] px-5 text-xs font-black text-white shadow-xs transition-all"
                  >
                    View all articles
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
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

            {/* Sidebar */}
            <aside className="space-y-5 lg:sticky lg:top-24">
              {/* Browse by subject */}
              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
                <div className="border-b border-slate-100 bg-[color:var(--color-gb-blue-deep)] px-5 py-4">
                  <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-amber-300">
                    <Tag className="h-3.5 w-3.5" />
                    Browse by Subject
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 p-4">
                  {topics.map((t) => {
                    const isActive = topic === t;
                    return (
                      <Link
                        key={t}
                        href={`/articles?topic=${encodeURIComponent(t)}`}
                        className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all ${
                          isActive
                            ? "bg-[color:var(--color-gb-blue-deep)] text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                        }`}
                      >
                        {t}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* CTA */}
              <div className="relative overflow-hidden rounded-2xl bg-[color:var(--color-gb-blue-deep)] p-5 text-white">
                <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-400 opacity-10 blur-2xl" />
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-amber-400">
                  <Send className="h-3 w-3" />
                  Call for Manuscripts
                </span>
                <h4 className="mt-3 font-academic text-base font-bold text-white">
                  Publish your research with GBJR
                </h4>
                <p className="mt-2 text-[11px] leading-5 text-white/55">
                  Double-blind peer review, permanent Crossref DOI indexing, and open access dissemination.
                </p>
                <Link
                  href="/dashboard/submissions/new"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-black text-[color:var(--color-gb-blue-deep)] transition-all hover:bg-amber-300"
                >
                  <Send className="h-3.5 w-3.5" />
                  Submit manuscript
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Journal credentials */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[color:var(--color-gb-blue-deep)]">
                  Journal Credentials
                </p>
                <dl className="mt-4 divide-y divide-slate-100">
                  {[
                    ["ISSN (Online)", "2959-1082"],
                    ["ISSN (Print)",  "2959-1074"],
                    ["Review Policy", "Double Blind"],
                    ["License",       "CC BY 4.0"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between gap-4 py-2.5 text-[11px]">
                      <dt className="font-medium text-slate-400">{label}</dt>
                      <dd className={`font-bold ${label === "License" ? "text-emerald-700" : "text-slate-800"}`}>
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          </div>

          {/* Bottom trust banner */}
          <div className="mt-12 grid gap-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:grid-cols-3 md:p-6">
            {[
              { icon: ShieldCheck, title: "Peer reviewed",      text: "Independent double-blind editorial assessment." },
              { icon: Globe2,      title: "Openly accessible",  text: "Research prepared for broad scholarly discovery." },
              { icon: BookOpen,    title: "Citation ready",     text: "Stable DOI, issue, page, and author metadata." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color:var(--color-gb-blue-soft)]">
                  <Icon className="h-4 w-4 text-[color:var(--color-gb-blue)]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[color:var(--color-gb-blue-deep)]">{title}</h3>
                  <p className="mt-1 text-[11px] leading-5 text-slate-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
