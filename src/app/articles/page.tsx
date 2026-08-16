import { Metadata } from "next";
import Link from "next/link";
import {
  Archive,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock,
  FileSearch,
  FileText,
  Globe2,
  GraduationCap,
  Library,
  Mail,
  MapPin,
  Send,
  ShieldCheck,
  Tag,
  Users,
} from "lucide-react";
import { ArticleCard } from "@/components/articles/article-card";
import { ArticlesFilterForm } from "@/components/articles/articles-filter-form";
import { PageShell } from "@/components/layout/page-shell";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/layout/page-transition";
import {
  articles,
  articleTypes,
  filterArticles,
  topics,
} from "@/lib/data";
import { ArticlesHero } from "@/components/articles/articles-hero";

export const metadata: Metadata = {
  title: "Articles & Research Archive — GB Journal of Research",
  description:
    "Explore peer-reviewed research articles across health, pharmacy, agriculture, law, computing, and social welfare from the Gono Bishwabidyalay Journal of Research.",
};

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
      {/* ── 1. Hero Header ── */}
      <FadeIn delay={0.05}>
        <ArticlesHero
          totalArticles={articles.length}
          totalTopics={topics.length}
        />
      </FadeIn>

      {/* ── 2. Content & Filters ── */}
      <section className="bg-[#fbfcff] py-10 sm:py-14 border-b border-slate-200/80">
        <div className="container-x">
          {/* Filter form */}
          <FadeIn delay={0.1}>
            <ArticlesFilterForm
              initialQ={q}
              initialType={type}
              initialTopic={topic}
              articleTypes={articleTypes}
              topics={topics}
            />
          </FadeIn>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
            {/* Main Column: Results */}
            <div>
              <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-slate-200/90 pb-4">
                <div>
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#1e40af] flex items-center gap-1.5">
                    <FileSearch className="h-3.5 w-3.5" />
                    <span>{hasFilters ? "FILTERED CORPUS" : "ALL PUBLICATIONS"}</span>
                  </p>
                  <h2 className="mt-1 font-academic text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-slate-950">
                    {results.length} article{results.length === 1 ? "" : "s"} found
                  </h2>
                  {hasFilters && (
                    <p className="mt-1 text-xs text-slate-500 font-mono">
                      Filtered by: {[q, type, topic].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>

                {hasFilters ? (
                  <Link
                    href="/articles"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 hover:bg-rose-100 transition-colors"
                  >
                    <span>Clear all filters</span>
                  </Link>
                ) : (
                  <Link
                    href="/issues"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1e40af] bg-white border border-slate-200 px-3 py-1.5 hover:bg-slate-50 transition-colors shadow-2xs"
                  >
                    <span>Browse by issue</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>

              {results.length === 0 ? (
                <div className="border border-dashed border-slate-300 bg-white p-12 text-center">
                  <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
                  <h3 className="mt-3 font-academic text-lg font-bold text-slate-800">
                    No matching articles found
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-slate-500">
                    Try broader search keywords, select a different subject track, or reset all filters to explore the complete catalog.
                  </p>
                  <Link
                    href="/articles"
                    className="mt-5 inline-flex items-center gap-2 bg-[#0b1b3d] hover:bg-[#162c60] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <span>View All Articles</span>
                  </Link>
                </div>
              ) : (
                <StaggerContainer className="flex flex-col gap-5">
                  {results.map((article) => (
                    <StaggerItem key={article.id}>
                      <ArticleCard article={article} variant="editorial" />
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              )}
            </div>

            {/* Sidebar Column */}
            <aside className="space-y-6 lg:sticky lg:top-24">
              <FadeIn delay={0.2} direction="left">
                {/* Browse by subject */}
                <div className="bg-white border border-slate-200/90 p-5 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#1e40af] flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5" />
                      <span>Browse by Subject</span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {topics.map((t) => {
                      const isActive = topic === t;
                      return (
                        <Link
                          key={t}
                          href={`/articles?topic=${encodeURIComponent(t)}`}
                          className={`px-2.5 py-1 text-[11px] font-semibold transition-all border ${
                            isActive
                              ? "bg-[#0b1b3d] text-white border-[#0b1b3d]"
                              : "bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900"
                          }`}
                        >
                          {t}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Journal credentials widget */}
                <div className="bg-white border border-slate-200/90 p-5 shadow-2xs mt-6">
                  <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#1e40af] border-b border-slate-100 pb-3 mb-3">
                    Journal Specifications
                  </p>
                  <dl className="divide-y divide-slate-100 text-xs">
                    <div className="flex items-center justify-between py-2">
                      <dt className="text-slate-500">ISSN (Online)</dt>
                      <dd className="font-mono font-semibold text-slate-900">2959-1082</dd>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <dt className="text-slate-500">ISSN (Print)</dt>
                      <dd className="font-mono font-semibold text-slate-900">2959-1074</dd>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <dt className="text-slate-500">Review Model</dt>
                      <dd className="font-semibold text-slate-900">Double-Blind</dd>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <dt className="text-slate-500">Licensing</dt>
                      <dd className="font-semibold text-emerald-700">CC BY 4.0</dd>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <dt className="text-slate-500">DOI Prefix</dt>
                      <dd className="font-mono text-slate-900">10.5555/gbjr</dd>
                    </div>
                  </dl>
                </div>

                {/* Callout Box */}
                <div className="bg-[#0b1b3d] text-white p-5 shadow-2xs mt-6 border border-slate-800">
                  <div className="inline-flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/25 px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-amber-300">
                    <Send className="h-3 w-3" />
                    <span>Call for Papers</span>
                  </div>
                  <h3 className="mt-3 font-academic text-base font-medium text-white leading-snug">
                    Submit Your Original Research
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">
                    Fast-track double-blind review, permanent CrossRef DOI, and open access publication.
                  </p>
                  <Link
                    href="/dashboard/submissions/new"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#0b1b3d] px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
                  >
                    <span>Submit Manuscript</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </FadeIn>
            </aside>
          </div>
        </div>
      </section>

      {/* ── 3. Archival Standards & Open Access Trust Banner ── */}
      <section
        aria-label="Archival Standards"
        className="py-14 sm:py-20 bg-white border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-slate-50/70 border border-slate-200/90 p-6 flex flex-col justify-between shadow-2xs">
              <div>
                <span className="flex h-10 w-10 items-center justify-center bg-[#0b1b3d] text-white mb-4">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <h3 className="font-academic text-base font-medium text-slate-950">
                  Double-Blind Peer Review
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Independent expert appraisal by qualified subject specialists guarantees rigorous scholarly merit and reproducible findings.
                </p>
              </div>
            </div>

            <div className="bg-slate-50/70 border border-slate-200/90 p-6 flex flex-col justify-between shadow-2xs">
              <div>
                <span className="flex h-10 w-10 items-center justify-center bg-[#0b1b3d] text-white mb-4">
                  <Globe2 className="h-5 w-5" />
                </span>
                <h3 className="font-academic text-base font-medium text-slate-950">
                  Universal Open Access
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Free and unrestricted worldwide access under Creative Commons CC BY 4.0 with author-retained copyright.
                </p>
              </div>
            </div>

            <div className="bg-slate-50/70 border border-slate-200/90 p-6 flex flex-col justify-between shadow-2xs">
              <div>
                <span className="flex h-10 w-10 items-center justify-center bg-[#0b1b3d] text-white mb-4">
                  <Archive className="h-5 w-5" />
                </span>
                <h3 className="font-academic text-base font-medium text-slate-950">
                  Permanent DOI Resolution
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Persistent digital object identifiers and CrossMark metadata guarantee permanent citations and immutable records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Call for Manuscripts CTA ── */}
      <section
        aria-label="Call for Papers CTA"
        className="py-14 sm:py-20 bg-white"
      >
        <div className="container-x">
          <div className="relative overflow-hidden bg-[#060e22] text-white border border-slate-800 shadow-[0_20px_50px_rgba(3,8,22,0.45)] p-8 sm:p-12 lg:p-14">
            {/* Top gold-to-blue accent line */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-400 via-blue-500 to-transparent" />

            {/* Ambient background glow */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-600/10 blur-[100px]" />
            <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-amber-500/10 blur-[90px]" />

            <div className="relative grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-10 lg:gap-14 items-center">
              {/* Left Column: Call for Papers */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/25 text-amber-300 text-[10.5px] font-bold uppercase tracking-[0.18em]">
                  <FileText className="h-3.5 w-3.5" />
                  <span>CALL FOR PAPERS · VOL. 2026/2027</span>
                </div>

                <h2 className="mt-4 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.025em] text-white leading-[1.15]">
                  Publish Your Research with GB Journal
                </h2>

                <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  We welcome original research manuscripts, clinical reports, and critical reviews. Experience an author-centric double-blind review process with zero subscription barriers.
                </p>

                {/* Feature Pill Tags */}
                <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold">
                    <Clock className="h-3.5 w-3.5 text-amber-300" />
                    Prompt 14-Day Review Cycle
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold">
                    <Globe2 className="h-3.5 w-3.5 text-blue-400" />
                    Global Open Access Reach
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    Free Open Access Publishing
                  </span>
                </div>

                {/* Primary Actions */}
                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <Link
                    href="/dashboard/submissions/new"
                    className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#060e22] px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                  >
                    <span>Submit Your Manuscript</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/authors"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <span>Author Guidelines</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Editorial Secretariat Contact Card */}
              <div className="bg-white/[0.05] border border-white/12 p-6 sm:p-8 backdrop-blur-sm flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-amber-300">
                      EDITORIAL SECRETARIAT
                    </p>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      Desk
                    </span>
                  </div>

                  <h3 className="mt-3 font-academic text-xl font-medium text-white">
                    Editorial Desk & Inquiries
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    Have questions regarding manuscript formatting, track assignment, or referee nominations? Contact our editorial staff directly.
                  </p>

                  <div className="mt-5 space-y-3.5 border-t border-white/10 pt-4 text-xs text-slate-200">
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Editorial Email</p>
                        <a
                          href="mailto:editorial@gonobishwabidyalay.edu.bd"
                          className="text-xs text-white hover:text-amber-300 underline mt-0.5 block transition-colors"
                        >
                          editorial@gonobishwabidyalay.edu.bd
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Campus Location</p>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Gono Bishwabidyalay, Nolam, Savar, Dhaka 1344, Bangladesh
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 uppercase tracking-wider transition-colors"
                  >
                    <span>Contact Editorial Office</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
