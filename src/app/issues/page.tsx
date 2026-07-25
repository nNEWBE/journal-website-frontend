"use client";

import { useState, useMemo } from "react";
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
  Search,
  Filter,
  Layers,
  CheckCircle2,
  Award,
  BookMarked,
  X,
  Grid,
  List as ListIcon,
  ChevronRight,
  Check,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { issues } from "@/lib/data";
import { PageHeroBanner } from "@/components/layout/page-hero-banner";
import { HeroActionButton } from "@/components/ui/hero-action-button";

export default function IssuesPage() {
  const currentIssue = issues[0];
  const allYears = useMemo(() => [...new Set(issues.map((i) => i.year))].sort((a, b) => Number(b) - Number(a)), []);
  const totalArticles = issues.reduce((sum, i) => sum + i.articleCount, 0);

  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter issues based on selected year and search query
  const filteredIssues = useMemo(() => {
    return issues.filter((iss) => {
      const matchesYear = selectedYear === "all" || iss.year === selectedYear;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        iss.theme.toLowerCase().includes(q) ||
        iss.volume.toLowerCase().includes(q) ||
        iss.issue.toLowerCase().includes(q) ||
        iss.month.toLowerCase().includes(q) ||
        iss.year.includes(q) ||
        iss.articles.some((a) => a.title.toLowerCase().includes(q) || a.topic.toLowerCase().includes(q));

      return matchesYear && matchesSearch;
    });
  }, [selectedYear, searchQuery]);

  // Group filtered issues by year
  const groupedIssuesByYear = useMemo(() => {
    const years = [...new Set(filteredIssues.map((i) => i.year))].sort((a, b) => Number(b) - Number(a));
    return years.map((yr) => ({
      year: yr,
      yearIssues: filteredIssues.filter((i) => i.year === yr),
    }));
  }, [filteredIssues]);

  return (
    <PageShell>
      {/* ── Hero ──────────────────────────────────── */}
      <PageHeroBanner
        badgeLabel="Journal Archive"
        badgeIcon={Library}
        title="Issues & volumes"
        description="Browse the complete publication record by year, volume, and issue. Every edition brings together peer-reviewed research from across the university's academic community."
        tags={[
          { label: "Peer-reviewed editions", icon: ShieldCheck },
          { label: "Open access", icon: Globe2 },
          { label: "Biannual (Jan & Jul)", icon: CalendarDays },
        ]}
        stats={[
          { val: String(issues.length), label: "Published issues" },
          { val: String(allYears.length), label: "Archive years" },
          { val: String(totalArticles), label: "Published articles" },
          { val: currentIssue.volume, label: "Current volume" },
        ]}
      />

      {/* ── Featured Edition (Current Issue Highlight) ─────────────────── */}
      <section className="container-x py-12 md:py-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--color-gb-gold-dark)]">
              <BookOpen className="h-3.5 w-3.5" />
              Featured Edition
            </p>
            <h2 className="mt-1.5 font-academic text-2xl font-bold tracking-tight text-[color:var(--color-gb-blue-deep)] md:text-3xl">
              Latest published issue
            </h2>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200/90 bg-white px-3.5 py-1.5 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="font-mono text-xs font-bold text-slate-700">
              {currentIssue.volume} · {currentIssue.issue} ({currentIssue.month})
            </span>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all duration-300 hover:border-slate-300 hover:shadow-md md:p-6">
          <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-stretch">
            {/* Cover image with 3D Spine & Glow */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-slate-950 shadow-md lg:h-full lg:w-60">
              <Image
                src={currentIssue.articles[0]?.image || "/covers/medical.png"}
                alt={currentIssue.theme}
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 240px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              {/* 3D Spine overlay */}
              <span className="pointer-events-none absolute inset-y-0 left-0 z-20 w-4 bg-gradient-to-r from-black/80 via-black/30 to-transparent border-r border-white/10" />
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-[color:var(--color-gb-blue-deep)]/90 via-slate-950/20 to-transparent" />

              <div className="absolute top-3 right-3 z-20">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-950/80 px-2.5 py-1 text-[9.5px] font-black uppercase tracking-wider text-emerald-300 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Current Issue
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 z-20">
                <div className="rounded-lg border border-white/15 bg-slate-950/80 p-2.5 backdrop-blur-md">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-slate-300">
                    {currentIssue.volume} · {currentIssue.issue}
                  </p>
                  <p className="text-xs font-bold text-white mt-0.5">{currentIssue.month}</p>
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div className="flex flex-col justify-between py-1">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-[color:var(--color-gb-blue-soft)] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[color:var(--color-gb-blue)]">
                    <BookOpen className="h-3 w-3" />
                    Now Publishing
                  </span>
                  <span className="rounded-md border border-slate-200/80 bg-slate-100/80 px-2.5 py-1 font-mono text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                    ISSN 2959-1082
                  </span>
                  <span className="rounded-md border border-amber-200/80 bg-amber-50 px-2.5 py-1 font-mono text-[10px] font-bold text-amber-800">
                    {currentIssue.articleCount} Peer-Reviewed Articles
                  </span>
                </div>

                <Link href="/issues/current" className="group/title inline-block">
                  <h3 className="mt-3.5 font-academic text-2xl font-bold leading-tight text-[color:var(--color-gb-blue-deep)] transition-colors group-hover/title:text-[color:var(--color-gb-blue)] md:text-3xl">
                    {currentIssue.theme}
                  </h3>
                </Link>

                <p className="mt-3 max-w-2xl text-xs leading-relaxed text-slate-600 md:text-sm">
                  Explore a cross-disciplinary collection focused on public wellbeing, institutional stewardship,
                  and resilient systems. Featuring empirical research, review articles, and field evaluations from university researchers.
                </p>

                {/* Featured Articles Quick Preview List */}
                {currentIssue.articles && currentIssue.articles.length > 0 && (
                  <div className="mt-4 rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-xs">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Included Research Articles:
                    </p>
                    <div className="space-y-2">
                      {currentIssue.articles.slice(0, 2).map((art) => (
                        <Link
                          key={art.id}
                          href={`/articles/${art.slug}`}
                          className="group/art flex items-start justify-between gap-3 text-xs font-semibold text-slate-700 hover:text-[color:var(--color-gb-blue)]"
                        >
                          <span className="flex items-start gap-2 line-clamp-1">
                            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-gb-gold)]" />
                            <span className="group-hover/art:underline">{art.title}</span>
                          </span>
                          <span className="shrink-0 font-mono text-[10px] text-slate-400">
                            {art.type}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action bar */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-4">
                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Double-blind Reviewed
                  </span>
                  <span className="hidden sm:flex items-center gap-1.5">
                    <Globe2 className="h-4 w-4 text-[color:var(--color-gb-blue)]" />
                    Open Access (CC BY 4.0)
                  </span>
                </div>

                <Link
                  href="/issues/current"
                  className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--color-gb-blue-deep)] px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-[color:var(--color-gb-blue)] hover:shadow-lg hover:gap-3"
                >
                  <span>Explore current issue</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Archive by Year Section ───────────────────────── */}
      <section className="border-t border-slate-200/80 bg-slate-50/70 py-12 md:py-16">
        <div className="container-x">
          {/* Section Header */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-slate-200/80 pb-6">
            <div>
              <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--color-gb-gold-dark)]">
                <FileArchive className="h-3.5 w-3.5" />
                Publication Record
              </p>
              <h2 className="mt-2 font-academic text-2xl font-bold tracking-tight text-[color:var(--color-gb-blue-deep)] md:text-3xl">
                Browse Archive by Year
              </h2>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-slate-500">
              Access full volumes and past editions. Every published article remains open-access, permanently archived, and fully indexable.
            </p>
          </div>

          {/* Interactive Filter Toolbar */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200/90 bg-white p-3 shadow-xs">
            {/* Year Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedYear("all")}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  selectedYear === "all"
                    ? "bg-[color:var(--color-gb-blue-deep)] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                }`}
              >
                All Years ({issues.length})
              </button>
              {allYears.map((year) => {
                const count = issues.filter((i) => i.year === year).length;
                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => setSelectedYear(year)}
                    className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                      selectedYear === year
                        ? "bg-[color:var(--color-gb-blue-deep)] text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                    }`}
                  >
                    {year} ({count})
                  </button>
                );
              })}
            </div>

            {/* Search and Layout Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter issues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200/90 bg-slate-50/80 py-1.5 pl-8 pr-7 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-[color:var(--color-gb-blue)] focus:bg-white focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* View Switcher */}
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                  className={`rounded-md p-1.5 transition-colors ${
                    viewMode === "grid" ? "bg-white text-[color:var(--color-gb-blue-deep)] shadow-2xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Grid className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  title="List View"
                  className={`rounded-md p-1.5 transition-colors ${
                    viewMode === "list" ? "bg-white text-[color:var(--color-gb-blue-deep)] shadow-2xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <ListIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {groupedIssuesByYear.length === 0 && (
            <div className="my-12 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-3 font-academic text-lg font-bold text-slate-800">No issues found</h3>
              <p className="mt-1 text-xs text-slate-500">
                No published issues matched your search query &quot;{searchQuery}&quot;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedYear("all");
                  setSearchQuery("");
                }}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[color:var(--color-gb-blue)] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Archives Grouped by Year */}
          <div className="space-y-12">
            {groupedIssuesByYear.map(({ year, yearIssues }) => {
              const firstIssue = yearIssues[0];
              const volumeLabel = firstIssue ? firstIssue.volume : `Volume ${year}`;

              return (
                <div key={year} className="space-y-5">
                  {/* Year Header Strip */}
                  <div className="flex items-center justify-between border-b border-slate-200/90 pb-3.5">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-11 min-w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[color:var(--color-gb-blue-deep)] to-[color:var(--color-gb-blue-dark)] px-3.5 font-mono text-base font-black text-amber-300 shadow-sm border border-amber-400/20">
                        {year}
                      </div>
                      <div>
                        <h3 id={`archive-year-${year}`} className="font-academic text-lg font-bold text-[color:var(--color-gb-blue-deep)]">
                          {year} Volume Archive
                        </h3>
                        <p className="text-xs font-medium text-slate-500">
                          {yearIssues.length} Published Edition{yearIssues.length === 1 ? "" : "s"} · {volumeLabel}
                        </p>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-2">
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-xs font-bold text-slate-600 shadow-2xs">
                        {volumeLabel}
                      </span>
                    </div>
                  </div>

                  {/* Issues Display: Grid or List */}
                  {viewMode === "grid" ? (
                    <div className="grid gap-6 sm:grid-cols-2">
                      {yearIssues.map((iss) => {
                        const isCurrent = iss.id === currentIssue.id;

                        return (
                          <Link
                            key={iss.id}
                            href={isCurrent ? "/issues/current" : "/articles"}
                            className={`group relative flex overflow-hidden rounded-2xl border transition-all duration-300 ${
                              isCurrent
                                ? "border-slate-200 bg-white shadow-xs hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5"
                                : "border-slate-200/80 bg-white shadow-2xs hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5"
                            }`}
                          >
                            {/* 3D Cover Thumbnail with Month Badge */}
                            <div className="p-3 shrink-0">
                              <div className="relative aspect-[3/4] w-28 sm:w-32 h-full overflow-hidden rounded-xl bg-slate-950 shadow-sm">
                                <Image
                                  src={iss.articles[0]?.image || "/covers/medical.png"}
                                  alt={iss.theme}
                                  fill
                                  sizes="(max-width: 639px) 112px, 128px"
                                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                />
                                {/* 3D Spine overlay */}
                                <span className="pointer-events-none absolute inset-y-0 left-0 z-20 w-2.5 bg-gradient-to-r from-black/80 via-black/30 to-transparent border-r border-white/10" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                                
                                <div className="absolute bottom-2 left-2 right-2 z-20">
                                  <span className="block rounded bg-slate-900/80 px-1.5 py-0.5 text-center font-mono text-[9.5px] font-bold text-white backdrop-blur-xs truncate">
                                    {iss.month}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Card Content */}
                            <div className="flex flex-1 flex-col justify-between p-4 pl-1 sm:p-5 sm:pl-2">
                              <div>
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-mono text-[10.5px] font-black uppercase tracking-wider text-[color:var(--color-gb-gold-dark)]">
                                    {iss.issue}
                                  </span>
                                  {isCurrent ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-700">
                                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                      Current Issue
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                                      <FileText className="h-2.5 w-2.5 text-slate-400" />
                                      Archived
                                    </span>
                                  )}
                                </div>

                                <h4 className="mt-2 font-academic text-base font-bold leading-snug text-[color:var(--color-gb-blue-deep)] transition-colors group-hover:text-[color:var(--color-gb-blue)] line-clamp-2">
                                  {iss.theme}
                                </h4>

                                <p className="mt-1.5 text-xs text-slate-500 font-mono">
                                  {iss.volume} · {iss.month}
                                </p>
                              </div>

                              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                                <span className="text-xs font-semibold text-slate-600">
                                  <strong className="font-bold text-[color:var(--color-gb-blue-deep)]">{iss.articleCount}</strong> Articles
                                </span>

                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-bold text-white transition-all group-hover:bg-[color:var(--color-gb-blue)] group-hover:gap-2">
                                  <span>Read issue</span>
                                  <ArrowRight className="h-3 w-3" />
                                </span>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    /* Compact List View */
                    <div className="space-y-3">
                      {yearIssues.map((iss) => {
                        const isCurrent = iss.id === currentIssue.id;

                        return (
                          <Link
                            key={iss.id}
                            href={isCurrent ? "/issues/current" : "/articles"}
                            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs transition-all hover:border-[color:var(--color-gb-blue)]/40 hover:shadow-md"
                          >
                            <div className="flex items-center gap-4">
                              <div className="relative aspect-[3/4] h-14 overflow-hidden rounded-md bg-slate-900 shrink-0">
                                <Image
                                  src={iss.articles[0]?.image || "/covers/medical.png"}
                                  alt={iss.theme}
                                  fill
                                  className="object-cover"
                                />
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-[color:var(--color-gb-gold-dark)]">
                                    {iss.volume} · {iss.issue}
                                  </span>
                                  <span className="text-xs text-slate-400">({iss.month})</span>
                                  {isCurrent && (
                                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-extrabold text-emerald-800 uppercase">
                                      Current
                                    </span>
                                  )}
                                </div>
                                <h4 className="mt-0.5 font-academic text-sm font-bold text-[color:var(--color-gb-blue-deep)] group-hover:text-[color:var(--color-gb-blue)]">
                                  {iss.theme}
                                </h4>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
                              <span className="text-xs font-semibold text-slate-500">
                                {iss.articleCount} Articles
                              </span>
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-[color:var(--color-gb-blue)] group-hover:translate-x-0.5 transition-transform">
                                Explore <ChevronRight className="h-3.5 w-3.5" />
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Archival Standards & Open Access Banner ───────────────────── */}
      <section className="container-x py-12">
        <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-500/10 via-slate-50 to-blue-500/10 p-6 md:p-8 shadow-xs">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[color:var(--color-gb-gold-dark)] shadow-xs">
                <Globe2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-academic text-sm font-bold text-[color:var(--color-gb-blue-deep)]">
                  Open Access & CC BY 4.0
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  All articles are immediately available without subscription barriers, licensing under Creative Commons.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[color:var(--color-gb-blue)] shadow-xs">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-academic text-sm font-bold text-[color:var(--color-gb-blue-deep)]">
                  Permanent Preservation
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  Every issue and article is assigned a Crossref DOI and archived in digital repositories for long-term accessibility.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-xs">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-academic text-sm font-bold text-[color:var(--color-gb-blue-deep)]">
                  Rigorous Peer Review
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  All published papers undergo double-blind peer review by qualified editorial board members and specialists.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

