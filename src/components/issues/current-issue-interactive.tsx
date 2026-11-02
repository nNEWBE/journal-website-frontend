"use client";

import { Fragment, useState, useMemo, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Copy,
  Download,
  Eye,
  FileSearch,
  FileText,
  Library,
  LockOpen,
  Search,
  Send,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/layout/page-transition";
import type { Article } from "@/lib/data";
import type { ResolvedPage } from "@/lib/cms/page-content";
import type issuesCurrentDefaults from "@/lib/cms/defaults/issues-current.json";

const SIDEBAR_SECTION_KEYS = new Set([
  "specifications",
  "leadership",
  "call-for-papers",
  "previous-issues",
]);

/** Value styling of the static spec rows, by position (matches the original layout). */
const SPEC_ROW_VALUE_CLASSES = [
  "font-mono font-semibold text-slate-900",
  "font-mono font-semibold text-slate-900",
  "font-semibold text-slate-900",
  "font-semibold text-emerald-700",
  "font-mono text-slate-900",
];

interface CurrentIssueInteractiveProps {
  currentIssue: any;
  allArticles: Article[];
  otherIssues: any[];
  content: ResolvedPage<typeof issuesCurrentDefaults>;
}

export function CurrentIssueInteractive({
  currentIssue,
  allArticles,
  otherIssues,
  content,
}: CurrentIssueInteractiveProps) {
  const hero = content.hero;
  const heroMeta = hero.meta;
  const toc = content["table-of-contents"];
  const tocMeta = toc.meta;
  const specs = content.specifications;
  const specRows = Array.isArray(specs.meta.rows) ? specs.meta.rows : [];
  const leadership = content.leadership;
  const leaders = Array.isArray(leadership.meta.people) ? leadership.meta.people : [];
  const cfp = content["call-for-papers"];
  const previous = content["previous-issues"];

  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);

  // Extract unique topics in this issue
  const issueTopics: string[] = useMemo(() => {
    return Array.from(new Set(allArticles.map((a: Article) => a.topic)));
  }, [allArticles]);

  // Filter articles
  const filteredArticles = useMemo(() => {
    return allArticles.filter((article: Article) => {
      const matchesTopic =
        selectedTopic === "all" || article.topic === selectedTopic;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.abstract.toLowerCase().includes(q) ||
        article.authors.some((author: string) => author.toLowerCase().includes(q)) ||
        article.topic.toLowerCase().includes(q);

      return matchesTopic && matchesSearch;
    });
  }, [allArticles, selectedTopic, searchQuery]);

  const citationText = currentIssue
    ? `Gono Bishwabidyalay Journal of Research. (${currentIssue.year}). ${currentIssue.theme}. Vol. 4, No. 2, pp. 1-84. https://doi.org/10.5555/gbj.${currentIssue.year}.${currentIssue.id}`
    : "";

  const handleCopyCitation = () => {
    if (!citationText) return;
    navigator.clipboard.writeText(citationText);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2500);
  };


  const cfpCta = cfp.meta.cta;
  const leadershipCta = leadership.meta.cta;
  const allIssuesLink = previous.meta.allIssuesLink;

  const sidebarRenderers: Record<string, () => ReactNode> = {
    /* Journal Specifications */
    specifications: () => (
              <div className="bg-white border border-slate-200/90 p-5 shadow-2xs">
                <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#1e40af] border-b border-slate-100 pb-3 mb-3 flex items-center gap-1.5">
                  <Library className="h-3.5 w-3.5" />
                  <span>{specs.title}</span>
                </p>
                <dl className="divide-y divide-slate-100 text-xs">
                  <div className="flex items-center justify-between py-2">
                    <dt className="text-slate-500">{specs.meta.volumeIssueLabel}</dt>
                    <dd className="font-semibold text-slate-900">
                      {currentIssue.volume}, {currentIssue.issue}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <dt className="text-slate-500">{specs.meta.publicationDateLabel}</dt>
                    <dd className="font-semibold text-slate-900">
                      {currentIssue.month} {currentIssue.year}
                    </dd>
                  </div>
                  {specRows.map((row, idx) => (
                    <div key={`${row.label}-${idx}`} className="flex items-center justify-between py-2">
                      <dt className="text-slate-500">{row.label}</dt>
                      <dd className={SPEC_ROW_VALUE_CLASSES[idx] ?? "font-semibold text-slate-900"}>{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
    ),

    /* Editorial Leadership */
    leadership: () => (
              <div className="bg-white border border-slate-200/90 p-5 shadow-2xs">
                <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#1e40af] border-b border-slate-100 pb-3 mb-3 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  <span>{leadership.title}</span>
                </p>
                <div className="space-y-3 text-xs">
                  {leaders.map((person, idx) => (
                    <div key={`${person.name}-${idx}`} className={idx > 0 ? "pt-2 border-t border-slate-100" : undefined}>
                      <p className="font-academic font-bold text-slate-900">{person.name}</p>
                      <p className="text-[11px] text-slate-500">{person.role}</p>
                    </div>
                  ))}
                </div>
                {leadershipCta?.label && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <Link
                      href={leadershipCta.href || "/editorial-board"}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#1e40af] hover:underline"
                    >
                      <span>{leadershipCta.label}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </div>
    ),

    /* Call for Papers Box */
    "call-for-papers": () => (
              <div className="bg-[#0b1b3d] text-white p-5 shadow-2xs border border-slate-800">
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-300">
                  {cfp.subtitle}
                </p>
                <h4 className="mt-1.5 font-academic text-base font-medium text-white">
                  {cfp.title}
                </h4>
                <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                  {cfp.content}
                </p>
                {cfpCta?.label && (
                  <Link
                    href={cfpCta.href || "/dashboard/submissions/new"}
                    className="mt-4 inline-flex items-center gap-1.5 bg-[#1e40af] hover:bg-[#1e3a8a] text-white px-4 py-2 text-xs font-semibold transition-colors w-full justify-center"
                  >
                    <span>{cfpCta.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
    ),

    /* Previous Editions */
    "previous-issues": () =>
      otherIssues.length > 1 ? (
                <div className="bg-white border border-slate-200/90 p-5 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                    <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#1e40af]">
                      {previous.title}
                    </p>
                    {allIssuesLink?.label && (
                      <Link
                        href={allIssuesLink.href || "/issues"}
                        className="text-[11px] font-semibold text-[#1e40af] hover:underline"
                      >
                        {allIssuesLink.label}
                      </Link>
                    )}
                  </div>
                  <div className="space-y-2 text-xs">
                    {otherIssues.slice(1, 4).map((past: any) => (
                      <Link
                        key={past.id}
                        href="/issues"
                        className="block p-2.5 border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-colors group"
                      >
                        <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
                          <span>{past.volume} · {past.issue}</span>
                          <span>{past.month} {past.year}</span>
                        </div>
                        <p className="mt-1 font-academic font-medium text-slate-900 group-hover:text-[#1e40af] truncate">
                          {past.theme}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
      ) : null,
  };

  return (
    <PageShell>
      {/* 1. Header & Issue Showcase */}
      {hero.visible && (
      <section className="bg-white border-b border-slate-200/80 pt-8 pb-12 sm:pt-10 sm:pb-16">
        <div className="container-x">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-6">
            <Link href="/" className="hover:text-[#1e40af] transition-colors">
              {heroMeta.breadcrumbHomeLabel}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <Link href="/issues" className="hover:text-[#1e40af] transition-colors">
              {heroMeta.breadcrumbIssuesLabel}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">
              {currentIssue.volume}, {currentIssue.issue}
            </span>
          </div>

          {/* Section Header with Line Accent */}
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                {hero.subtitle}
              </span>
              <div className="h-px w-12 bg-slate-300" />
            </div>
            <h1 className="mt-3 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
              {currentIssue.theme}
            </h1>
          </div>

          {/* 2-Column Split: Magazine Cover + Metadata Specs */}
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr] gap-8 lg:gap-12 items-center">
            {/* Left Column: Magazine Issue Cover Card */}
            <FadeIn direction="up" delay={0.1}>
              <div className="relative mx-auto lg:mx-0 w-full max-w-67.5 sm:max-w-71.25 aspect-3/4 overflow-hidden bg-[#061026] text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)] border border-slate-200/80 group">
                <div className="absolute inset-0">
                  <Image
                    src={currentIssue.coverImageUrl || currentIssue.coverImage || "/covers/medical.png"}
                    alt="GB Journal of Research Cover"
                    fill
                    priority
                    sizes="290px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-b from-[#061026]/90 via-[#061026]/25 to-[#061026]/95" />
                </div>

                {/* Cover Header */}
                <div className="relative z-10 p-4 sm:p-4.5 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative h-8 w-8 bg-white/10 border border-white/20 p-1">
                      <Image
                        src={heroMeta.coverLogoImage || "/gb-logo-official.png"}
                        alt="GB Logo"
                        fill
                        sizes="32px"
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h2 className="font-academic text-base sm:text-lg font-bold tracking-wider text-white leading-tight">
                        {heroMeta.coverJournalName}
                      </h2>
                      <p className="text-[7.5px] font-bold uppercase tracking-[0.16em] text-cyan-300">
                        {heroMeta.coverJournalTagline}
                      </p>
                    </div>
                  </div>
                  <div className="text-right font-mono text-[7px] text-slate-300/80 leading-tight">
                    <p>{heroMeta.coverIssnLine}</p>
                    <p>{heroMeta.coverEissnLine}</p>
                  </div>
                </div>

                {/* Cover Bottom Content */}
                <div className="absolute bottom-0 inset-x-0 z-10 p-4 sm:p-4.5 flex flex-col justify-end">
                  <div className="mb-3">
                    <p className="text-[7.5px] font-bold uppercase tracking-[0.16em] text-cyan-300">
                      {heroMeta.coverThemeLabel}
                    </p>
                    <h3 className="mt-1 font-academic text-[11px] font-medium leading-[1.3] text-white/95 line-clamp-3">
                      {allArticles[0]?.title || currentIssue.theme}
                    </h3>
                  </div>

                  <div className="pt-2.5 border-t border-white/20 flex items-center justify-between font-mono text-[8px] text-white/80 font-bold uppercase tracking-wider">
                    <span>{currentIssue.volume} | {currentIssue.issue}</span>
                    <span>{currentIssue.month} {currentIssue.year}</span>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Right Column: Issue Details & Metadata */}
            <FadeIn direction="up" delay={0.15} className="flex flex-col justify-center">
              <p className="text-[11.5px] sm:text-xs font-bold uppercase tracking-[0.14em] text-[#1e40af]">
                {hero.title}
              </p>

              <h2 className="mt-2 font-academic lining-nums text-4xl sm:text-5xl font-medium leading-[1.1] tracking-[-0.02em] text-slate-950">
                {currentIssue.volume}, {currentIssue.issue}
              </h2>

              <p className="mt-1.5 text-sm sm:text-base font-medium text-slate-600">
                {heroMeta.publishedPrefix} {currentIssue.month} {currentIssue.year} · {heroMeta.accessLabel}
              </p>

              {/* Metadata 2-Column Spec Block */}
              <div className="mt-6 pt-6 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-slate-100 text-[#1e40af] border border-slate-200">
                    <BookOpen className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {heroMeta.publicationDateLabel}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {currentIssue.month} 15, {currentIssue.year}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:border-l sm:border-slate-200 sm:pl-6">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-slate-100 text-[#1e40af] border border-slate-200">
                    <FileText className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {heroMeta.issnLabel}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {heroMeta.issnValue}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description Body */}
              <p className="mt-6 text-xs sm:text-sm leading-relaxed text-slate-600">
                {currentIssue.editorNote || hero.content}
              </p>

              {/* Actions */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#table-of-contents"
                  className="inline-flex items-center gap-2 bg-[#0b1b3d] hover:bg-[#162c60] text-white px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <BookOpen className="h-4 w-4 text-white/90" />
                  <span>{heroMeta.browseArticlesLabel} ({allArticles.length})</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyCitation}
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-2xs"
                >
                  {copiedCitation ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span className="text-emerald-700">{heroMeta.citationCopiedLabel}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-slate-500" />
                      <span>{heroMeta.copyCitationLabel}</span>
                    </>
                  )}
                </button>

                {heroMeta.submitCta?.label && (
                  <Link
                    href={heroMeta.submitCta.href || "/dashboard/submissions/new"}
                    className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-[#1e40af] px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors"
                  >
                    <Send className="h-4 w-4" />
                    <span>{heroMeta.submitCta.label}</span>
                  </Link>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      )}

      {/* 2. Main Content Area */}
      <section id="table-of-contents" className="bg-[#fbfcff] py-10 sm:py-14 border-b border-slate-200/80">
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-8 items-start">
            {/* Left Column: Articles List */}
            {toc.visible && (
            <div>
              {/* Header Bar */}
              <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-slate-200/90 pb-4">
                <div>
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#1e40af] flex items-center gap-1.5">
                    <FileSearch className="h-3.5 w-3.5" />
                    <span>{toc.subtitle}</span>
                  </p>
                  <h2 className="mt-1 font-academic text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-slate-950">
                    {filteredArticles.length} {filteredArticles.length === 1 ? tocMeta.titleSingular : toc.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500">
                    {currentIssue.volume}, {currentIssue.issue} · {currentIssue.month} {currentIssue.year}
                  </span>
                </div>
              </div>

              {/* Search & Topic Filters */}
              <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder={tocMeta.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1e40af] transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {tocMeta.clearSearchLabel}
                    </button>
                  )}
                </div>

                {/* Topic Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  <button
                    type="button"
                    onClick={() => setSelectedTopic("all")}
                    className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
                      selectedTopic === "all"
                        ? "bg-[#0b1b3d] text-white border-[#0b1b3d]"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {tocMeta.allTopicsLabel} ({allArticles.length})
                  </button>
                  {issueTopics.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setSelectedTopic(topic)}
                      className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
                        selectedTopic === topic
                          ? "bg-[#0b1b3d] text-white border-[#0b1b3d]"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editorial Article Cards */}
              {filteredArticles.length === 0 ? (
                <div className="border border-dashed border-slate-300 bg-white p-12 text-center">
                  <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
                  <h3 className="mt-3 font-academic text-lg font-bold text-slate-800">
                    {tocMeta.emptyTitle}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {tocMeta.emptyText}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedTopic("all");
                    }}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#1e40af] bg-blue-50 border border-blue-200 px-3.5 py-1.5 hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    <span>{tocMeta.resetFiltersLabel}</span>
                  </button>
                </div>
              ) : (
                <StaggerContainer className="flex flex-col gap-5">
                  {filteredArticles.map((article: Article, idx: number) => (
                    <StaggerItem key={article.id}>
                      <article className="bg-white border border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition-all group">
                        <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4 sm:gap-5 items-start">
                          {/* Article Image Container */}
                          <Link
                            href={`/articles/${article.slug}`}
                            className="relative aspect-4/3 sm:aspect-3/4 w-full overflow-hidden bg-slate-950 border border-slate-200/80 shrink-0 block"
                          >
                            <Image
                              src={article.image || "/covers/medical.png"}
                              alt={article.title}
                              fill
                              sizes="(max-width: 639px) 100vw, 160px"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
                            <span className="absolute top-2 left-2 bg-slate-900/90 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 text-[9px] font-mono font-bold">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <span className="absolute bottom-2 left-2 right-2 inline-block bg-slate-900/90 text-white px-2 py-0.5 text-center text-[9px] font-bold uppercase tracking-wider truncate">
                              {article.topic}
                            </span>
                          </Link>

                          {/* Details */}
                          <div className="flex flex-col justify-between h-full min-w-0">
                            <div>
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="inline-flex items-center gap-1.5 bg-blue-50 text-[#1e40af] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider border border-blue-100">
                                    <FileText className="h-3 w-3" />
                                    {article.type}
                                  </span>
                                  <span className="inline-flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                                    <LockOpen className="h-3 w-3" />
                                    {tocMeta.openAccessLabel}
                                  </span>
                                </div>
                                <span className="inline-flex items-center gap-1 text-[10.5px] font-mono text-slate-500">
                                  {tocMeta.pagesLabel} {article.pages}
                                </span>
                              </div>

                              <Link href={`/articles/${article.slug}`} className="mt-2 block">
                                <h3 className="font-academic text-base sm:text-[18px] font-medium leading-snug text-slate-950 group-hover:text-[#1e40af] transition-colors line-clamp-2">
                                  {article.title}
                                </h3>
                              </Link>

                              <p className="mt-1 text-xs font-semibold text-slate-600 truncate">
                                {tocMeta.authorsPrefix} {article.authors.join(", ")}
                              </p>

                              <p className="mt-1.5 text-xs leading-relaxed text-slate-600 line-clamp-2">
                                {article.abstract}
                              </p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-3.5 text-xs text-slate-500">
                                <span className="inline-flex items-center gap-1.5 font-medium" title={`${(article.metrics?.views || 0).toLocaleString()} Total Views`}>
                                  <Eye className="h-3.5 w-3.5 text-slate-400" />
                                  <span>{(article.metrics?.views || 0).toLocaleString()} {article.metrics?.views === 1 ? tocMeta.viewSingular : tocMeta.viewPlural}</span>
                                </span>
                                <span className="inline-flex items-center gap-1.5 font-medium" title={`${(article.metrics?.downloads || 0).toLocaleString()} Total Downloads`}>
                                  <Download className="h-3.5 w-3.5 text-slate-400" />
                                  <span>{(article.metrics?.downloads || 0).toLocaleString()} {article.metrics?.downloads === 1 ? tocMeta.downloadSingular : tocMeta.downloadPlural}</span>
                                </span>
                                <span className="text-slate-400 hidden sm:inline">|</span>
                                <span className="text-slate-500 font-mono text-[11px] hidden sm:inline truncate max-w-35">
                                  {tocMeta.doiLabel} {article.doi}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/articles/${article.slug}`}
                                  aria-label={`Read ${article.title}`}
                                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#1e40af] hover:underline"
                                >
                                  <span>{tocMeta.readArticleLabel}</span>
                                  <ArrowUpRight className="h-3.5 w-3.5" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              )}
            </div>
            )}

            {/* Right Column: Sticky Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-24">
              {content._order
                .filter((key) => SIDEBAR_SECTION_KEYS.has(key))
                .map((key) => (
                  <Fragment key={key}>{sidebarRenderers[key]?.()}</Fragment>
                ))}
            </aside>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
