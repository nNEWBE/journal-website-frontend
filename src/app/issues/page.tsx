"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Archive,
  ArrowUpRight,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileArchive,
  FileText,
  Filter,
  Globe2,
  Grid,
  Layers,
  Library,
  List as ListIcon,
  Mail,
  MapPin,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { FadeIn } from "@/components/layout/page-transition";
import { issues } from "@/lib/data";
import { IssuesHero } from "@/components/issues/issues-hero";

export default function IssuesPage() {
  const currentIssue = issues[0];
  const allYears = useMemo(
    () => [...new Set(issues.map((i) => i.year))].sort((a, b) => Number(b) - Number(a)),
    []
  );
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
        iss.articles.some(
          (a) => a.title.toLowerCase().includes(q) || a.topic.toLowerCase().includes(q)
        );

      return matchesYear && matchesSearch;
    });
  }, [selectedYear, searchQuery]);

  // Group filtered issues by year
  const groupedIssuesByYear = useMemo(() => {
    const years = [...new Set(filteredIssues.map((i) => i.year))].sort(
      (a, b) => Number(b) - Number(a)
    );
    return years.map((yr) => ({
      year: yr,
      yearIssues: filteredIssues.filter((i) => i.year === yr),
    }));
  }, [filteredIssues]);

  return (
    <PageShell>
      {/* ── 1. Hero Header ── */}
      <FadeIn delay={0.05}>
        <IssuesHero
          totalIssues={issues.length}
          totalArticles={totalArticles}
          currentVolume={`${currentIssue.volume} · ${currentIssue.issue}`}
          totalYears={allYears.length}
        />
      </FadeIn>

      {/* ── 2. Featured Edition: Current Issue Showcase ── */}
      <section
        aria-label="Current Issue Featured Showcase"
        className="py-14 sm:py-20 bg-[#fbfcff] border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                FEATURED EDITION
              </p>
              <h2 className="mt-2 font-academic text-2xl sm:text-3xl lg:text-[2.5rem] font-medium tracking-[-0.02em] text-slate-950">
                Latest Published Issue
              </h2>
            </div>
            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 border border-slate-200/90 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="font-mono text-xs font-bold text-slate-800">
                {currentIssue.volume} · {currentIssue.issue} ({currentIssue.month})
              </span>
            </div>
          </div>

          <div className="mt-10 bg-white border border-slate-200/90 p-6 sm:p-8 lg:p-10 shadow-2xs">
            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 lg:gap-10 items-start">
              {/* Journal 3D Cover Thumbnail */}
              <div className="relative aspect-[3/4] w-full max-w-[260px] mx-auto lg:mx-0 overflow-hidden bg-slate-950 shadow-sm border border-slate-200/80">
                <Image
                  src={currentIssue.articles[0]?.image || "/covers/medical.png"}
                  alt={currentIssue.theme}
                  fill
                  priority
                  sizes="(max-width: 1023px) 260px, 260px"
                  className="object-cover"
                />
                {/* 3D Spine effect */}
                <span className="pointer-events-none absolute inset-y-0 left-0 z-20 w-4 bg-gradient-to-r from-black/80 via-black/30 to-transparent border-r border-white/10" />
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                <div className="absolute top-3 right-3 z-20">
                  <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-400/40 px-2.5 py-1 text-[9.5px] font-mono font-bold uppercase tracking-wider text-emerald-300 backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Current Volume
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 z-20 bg-slate-950/85 p-2.5 border border-white/15 backdrop-blur-md">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-slate-300">
                    {currentIssue.volume} · {currentIssue.issue}
                  </p>
                  <p className="text-xs font-bold text-white mt-0.5">{currentIssue.month}</p>
                </div>
              </div>

              {/* Content Details */}
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-[#1e40af] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                      <BookOpen className="h-3 w-3" />
                      Now Publishing
                    </span>
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider border border-slate-200/80">
                      ISSN 2959-1082
                    </span>
                    <span className="bg-amber-50 text-amber-900 px-2.5 py-0.5 font-mono text-[10px] font-bold border border-amber-200">
                      {currentIssue.articleCount} Peer-Reviewed Articles
                    </span>
                  </div>

                  <Link href="/issues/current" className="group/title inline-block">
                    <h3 className="mt-3.5 font-academic text-2xl sm:text-3xl font-medium leading-tight text-slate-950 group-hover/title:text-[#1e40af] transition-colors">
                      {currentIssue.theme}
                    </h3>
                  </Link>

                  <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-slate-600 max-w-3xl">
                    Explore a curated multidisciplinary volume featuring empirical contributions, clinical investigations, and theoretical syntheses in community healthcare access, pharmacy stewardship, resilient agriculture, and public welfare.
                  </p>

                  {/* Included Articles Preview */}
                  {currentIssue.articles && currentIssue.articles.length > 0 && (
                    <div className="mt-5 bg-slate-50/70 border border-slate-200/80 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                        Selected Articles in this Issue:
                      </p>
                      <div className="space-y-2">
                        {currentIssue.articles.slice(0, 3).map((art) => (
                          <Link
                            key={art.id}
                            href={`/articles/${art.slug}`}
                            className="group/art flex items-start justify-between gap-3 text-xs font-semibold text-slate-700 hover:text-[#1e40af] transition-colors"
                          >
                            <span className="flex items-start gap-2 line-clamp-1">
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 bg-[#1e40af]" />
                              <span className="group-hover/art:underline">{art.title}</span>
                            </span>
                            <span className="shrink-0 font-mono text-[10.5px] text-slate-400">
                              {art.type}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Row */}
                <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      Double-blind Reviewed
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Globe2 className="h-4 w-4 text-[#1e40af]" />
                      Open Access (CC BY 4.0)
                    </span>
                  </div>

                  <Link
                    href="/issues/current"
                    className="inline-flex items-center gap-2 bg-[#0b1b3d] hover:bg-[#162c60] text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    <span>Read Full Issue</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Volume & Year Archive Directory ── */}
      <section
        id="volume-archive"
        aria-label="Volume Archive"
        className="py-14 sm:py-20 bg-white border-b border-slate-200/80 scroll-mt-20"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                ARCHIVAL DIRECTORY
              </p>
              <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
                Browse Archive by Year & Volume
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              Access all historical volumes and past editions. Every publication remains fully indexed, citable, and available without paywalls.
            </p>
          </div>

          {/* Interactive Filter Toolbar */}
          <div className="mt-8 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/80 border border-slate-200/90 p-3">
            {/* Year Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedYear("all")}
                className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition-all cursor-pointer border ${
                  selectedYear === "all"
                    ? "bg-[#0b1b3d] text-white border-[#0b1b3d]"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
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
                    className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition-all cursor-pointer border ${
                      selectedYear === year
                        ? "bg-[#0b1b3d] text-white border-[#0b1b3d]"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {year} ({count})
                  </button>
                );
              })}
            </div>

            {/* Search Input & View Switcher */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter issues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 py-1.5 pl-8 pr-7 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#1e40af] focus:outline-none"
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

              <div className="flex items-center border border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                  className={`p-1.5 transition-colors ${
                    viewMode === "grid" ? "bg-slate-100 text-[#0b1b3d]" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  title="List View"
                  className={`p-1.5 transition-colors ${
                    viewMode === "list" ? "bg-slate-100 text-[#0b1b3d]" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <ListIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {groupedIssuesByYear.length === 0 && (
            <div className="my-12 border border-dashed border-slate-300 bg-white p-12 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-3 font-academic text-lg font-bold text-slate-800">No issues found</h3>
              <p className="mt-1 text-xs text-slate-500">
                No published editions matched your search query &quot;{searchQuery}&quot;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedYear("all");
                  setSearchQuery("");
                }}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#1e40af] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Grouped Years */}
          <div className="space-y-12">
            {groupedIssuesByYear.map(({ year, yearIssues }) => {
              const firstIssue = yearIssues[0];
              const volumeLabel = firstIssue ? firstIssue.volume : `Volume ${year}`;

              return (
                <div key={year} className="space-y-6">
                  {/* Year Header */}
                  <div className="flex items-center justify-between border-b border-slate-200/90 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 bg-[#0b1b3d] text-white flex items-center justify-center font-mono font-bold text-xs">
                        {year}
                      </div>
                      <div>
                        <h3 className="font-academic text-lg font-medium text-slate-950">
                          {year} Volume Archive
                        </h3>
                        <p className="text-xs text-slate-500 font-mono">
                          {yearIssues.length} Published Edition{yearIssues.length === 1 ? "" : "s"} · {volumeLabel}
                        </p>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-mono font-semibold border border-slate-200">
                      {volumeLabel}
                    </span>
                  </div>

                  {/* Issues Display: Grid or List */}
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {yearIssues.map((iss) => {
                        const isCurrent = iss.id === currentIssue.id;
                        return (
                          <Link
                            key={iss.id}
                            href={isCurrent ? "/issues/current" : "/articles"}
                            className="bg-white border border-slate-200/90 p-5 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-all group"
                          >
                            <div>
                              <div className="flex items-start gap-4">
                                <div className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden bg-slate-950 border border-slate-200/90 shadow-2xs">
                                  <Image
                                    src={iss.articles[0]?.image || "/covers/medical.png"}
                                    alt={iss.theme}
                                    fill
                                    sizes="96px"
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                  <span className="pointer-events-none absolute inset-y-0 left-0 z-20 w-2.5 bg-gradient-to-r from-black/80 via-black/30 to-transparent border-r border-white/10" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1e40af] bg-blue-50 px-2 py-0.5 border border-blue-100">
                                      {iss.issue}
                                    </span>
                                    {isCurrent ? (
                                      <span className="text-[9.5px] font-bold uppercase text-emerald-700 flex items-center gap-1">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Current
                                      </span>
                                    ) : (
                                      <span className="text-[9.5px] font-mono text-slate-400 uppercase">
                                        Archived
                                      </span>
                                    )}
                                  </div>

                                  <h4 className="mt-2 font-academic text-base font-medium text-slate-950 group-hover:text-[#1e40af] transition-colors leading-snug line-clamp-2">
                                    {iss.theme}
                                  </h4>

                                  <p className="mt-1 text-xs text-slate-500 font-mono">
                                    {iss.volume} · {iss.month}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                              <span className="text-slate-600 font-medium">
                                <strong className="text-slate-950 font-bold">{iss.articleCount}</strong> Articles
                              </span>
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1e40af] group-hover:underline">
                                <span>Read issue</span>
                                <ArrowUpRight className="h-3 w-3" />
                              </span>
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
                            className="bg-white border border-slate-200/90 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:border-slate-300 transition-all group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="relative aspect-[3/4] h-14 overflow-hidden bg-slate-950 shrink-0 border border-slate-200">
                                <Image
                                  src={iss.articles[0]?.image || "/covers/medical.png"}
                                  alt={iss.theme}
                                  fill
                                  sizes="56px"
                                  className="object-cover"
                                />
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-[#1e40af]">
                                    {iss.volume} · {iss.issue}
                                  </span>
                                  <span className="text-xs text-slate-400 font-mono">({iss.month})</span>
                                  {isCurrent && (
                                    <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 text-[9px] font-bold uppercase">
                                      Current
                                    </span>
                                  )}
                                </div>
                                <h4 className="mt-0.5 font-academic text-sm font-medium text-slate-950 group-hover:text-[#1e40af] transition-colors">
                                  {iss.theme}
                                </h4>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0 text-xs">
                              <span className="text-slate-500 font-mono">{iss.articleCount} Articles</span>
                              <span className="inline-flex items-center gap-1 font-semibold text-[#1e40af] group-hover:translate-x-0.5 transition-transform">
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

      {/* ── 4. Digital Preservation & Open Access Standards ── */}
      <section
        aria-label="Preservation Standards"
        className="py-14 sm:py-20 bg-[#fbfcff] border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                PRESERVATION STANDARDS
              </p>
              <h2 className="mt-2 font-academic text-2xl sm:text-3xl lg:text-[2.5rem] font-medium tracking-[-0.02em] text-slate-950">
                Permanent Indexing & Open Access Guarantees
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              Every volume is safeguarded in international digital archives with permanent metadata resolution and unrestricted author copyright.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            <div className="bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="flex h-11 w-11 items-center justify-center bg-[#0b1b3d] text-white mb-5">
                  <Globe2 className="h-5 w-5" />
                </span>
                <h3 className="font-academic text-base sm:text-lg font-medium text-slate-950 leading-snug">
                  Open Access & CC BY 4.0
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-slate-600">
                  Articles are freely and immediately available worldwide without subscriptions or embargoes. Authors retain copyright in full.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="flex h-11 w-11 items-center justify-center bg-[#0b1b3d] text-white mb-5">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <h3 className="font-academic text-base sm:text-lg font-medium text-slate-950 leading-snug">
                  Permanent CrossRef DOI Archiving
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-slate-600">
                  Every published volume and article receives a persistent Crossref Digital Object Identifier for unbreakable scholarly citation.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="flex h-11 w-11 items-center justify-center bg-[#0b1b3d] text-white mb-5">
                  <Award className="h-5 w-5" />
                </span>
                <h3 className="font-academic text-base sm:text-lg font-medium text-slate-950 leading-snug">
                  Double-Blind Peer Review Rigor
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-slate-600">
                  All articles undergo rigorous double-blind assessment by independent disciplinary experts before inclusion in a published issue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Call for Upcoming Issue Manuscripts CTA ── */}
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
                  Submit Your Research for the Upcoming Volume
                </h2>

                <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  Submissions are actively invited across health sciences, clinical medicine, pharmacy, agriculture, law, computing, and social welfare for the upcoming biannual volume.
                </p>

                {/* Feature Pill Tags */}
                <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold">
                    <Clock className="h-3.5 w-3.5 text-amber-300" />
                    Rapid 14-Day Initial Review
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
                      Volume Desk
                    </span>
                  </div>

                  <h3 className="mt-3 font-academic text-xl font-medium text-white">
                    Special Issue & Volume Inquiries
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    Proposing a thematic special issue or seeking past volume prints? Contact the editorial staff directly.
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
