"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  Download,
  Eye,
  FileSearch,
  FileText,
  Globe2,
  Hash,
  Library,
  LockOpen,
  Mail,
  Quote,
  Search,
  Send,
  ShieldCheck,
  Tag,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/layout/page-transition";
import { issues, type Article } from "@/lib/data";

export default function CurrentIssuePage() {
  const currentIssue = issues[0];
  const allArticles = currentIssue.articles;

  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);

  // Extract unique topics in this issue
  const issueTopics = useMemo(() => {
    return Array.from(new Set(allArticles.map((a) => a.topic)));
  }, [allArticles]);

  // Filter articles
  const filteredArticles = useMemo(() => {
    return allArticles.filter((article) => {
      const matchesTopic =
        selectedTopic === "all" || article.topic === selectedTopic;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.abstract.toLowerCase().includes(q) ||
        article.authors.some((author) => author.toLowerCase().includes(q)) ||
        article.topic.toLowerCase().includes(q);

      return matchesTopic && matchesSearch;
    });
  }, [allArticles, selectedTopic, searchQuery]);

  const totalViews = useMemo(
    () => allArticles.reduce((sum, a) => sum + (a.metrics?.views || 0), 0),
    [allArticles]
  );
  const totalDownloads = useMemo(
    () => allArticles.reduce((sum, a) => sum + (a.metrics?.downloads || 0), 0),
    [allArticles]
  );

  const citationText = `Gono Bishwabidyalay Journal of Research. (${currentIssue.year}). ${currentIssue.theme}. Vol. 4, No. 2, pp. 1-84. https://doi.org/10.5555/gbj.${currentIssue.year}.${currentIssue.id}`;

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(citationText);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2500);
  };

  return (
    <PageShell>
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & ISSUE SHOWCASE (MATCHING HOME PAGE CURRENT ISSUE)
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-200/80 pt-8 pb-12 sm:pt-10 sm:pb-16">
        <div className="container-x">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-6">
            <Link href="/" className="hover:text-[#1e40af] transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <Link href="/issues" className="hover:text-[#1e40af] transition-colors">Issues</Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">{currentIssue.volume}, {currentIssue.issue}</span>
          </div>

          {/* Section Header with Line Accent */}
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                CURRENT ISSUE
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
              <div className="relative mx-auto lg:mx-0 w-full max-w-[270px] sm:max-w-[285px] aspect-[3/4] overflow-hidden bg-[#061026] text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)] border border-slate-200/80 group">
                <div className="absolute inset-0">
                  <Image
                    src="/images/hero/molecular_inhibitors.jpg"
                    alt="GB Journal of Research Cover"
                    fill
                    priority
                    sizes="290px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#061026]/90 via-[#061026]/25 to-[#061026]/95" />
                </div>

                {/* Cover Header */}
                <div className="relative z-10 p-4 sm:p-4.5 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative h-8 w-8 bg-white/10 border border-white/20 p-1">
                      <Image
                        src="/gb-logo-official.png"
                        alt="GB Logo"
                        fill
                        sizes="32px"
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h2 className="font-academic text-base sm:text-lg font-bold tracking-wider text-white leading-tight">
                        GB JOURNAL
                      </h2>
                      <p className="text-[7.5px] font-bold uppercase tracking-[0.16em] text-cyan-300">
                        OF RESEARCH
                      </p>
                    </div>
                  </div>
                  <div className="text-right font-mono text-[7px] text-slate-300/80 leading-tight">
                    <p>ISSN 2959-1082</p>
                    <p>eISSN 2959-1074</p>
                  </div>
                </div>

                {/* Cover Bottom Content */}
                <div className="absolute bottom-0 inset-x-0 z-10 p-4 sm:p-4.5 flex flex-col justify-end">
                  <div className="mb-3">
                    <p className="text-[7.5px] font-bold uppercase tracking-[0.16em] text-cyan-300">
                      THEME & SPECIAL FOCUS
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
                Gono Bishwabidyalay Journal of Research
              </p>

              <h2 className="mt-2 font-academic lining-nums text-4xl sm:text-5xl font-medium leading-[1.1] tracking-[-0.02em] text-slate-950">
                {currentIssue.volume}, {currentIssue.issue}
              </h2>

              <p className="mt-1.5 text-sm sm:text-base font-medium text-slate-600">
                Published {currentIssue.month} {currentIssue.year} · Universal Open Access
              </p>

              {/* Metadata 2-Column Spec Block */}
              <div className="mt-6 pt-6 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-slate-100 text-[#1e40af] border border-slate-200">
                    <BookOpen className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Publication Date
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
                      ISSN Information
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      2959-1082 (Online) · 2959-1074 (Print)
                    </p>
                  </div>
                </div>
              </div>

              {/* Description Body */}
              <p className="mt-6 text-xs sm:text-sm leading-relaxed text-slate-600">
                This issue features peer-reviewed studies examining healthcare access in peri-urban Savar, pharmacy practice readiness for clinical antimicrobial stewardship, and mathematical crop modeling for climate-resilient agriculture.
              </p>

              {/* Actions */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#table-of-contents"
                  className="inline-flex items-center gap-2 bg-[#0b1b3d] hover:bg-[#162c60] text-white px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <BookOpen className="h-4 w-4 text-white/90" />
                  <span>Browse Articles ({allArticles.length})</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyCitation}
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-2xs"
                >
                  {copiedCitation ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span className="text-emerald-700">Citation Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-slate-500" />
                      <span>Copy Issue Citation</span>
                    </>
                  )}
                </button>

                <Link
                  href="/dashboard/submissions/new"
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-[#1e40af] px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors"
                >
                  <Send className="h-4 w-4" />
                  <span>Submit to Next Issue</span>
                </Link>
              </div>
            </FadeIn>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN CONTENT AREA: TABLE OF CONTENTS + SIDEBAR
      ───────────────────────────────────────────────────────────── */}
      <section id="table-of-contents" className="bg-[#fbfcff] py-10 sm:py-14 border-b border-slate-200/80">
        <div className="container-x">
          
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-8 items-start">
            
            {/* ── Left Column: Articles List ── */}
            <div>
              {/* Header Bar */}
              <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-slate-200/90 pb-4">
                <div>
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#1e40af] flex items-center gap-1.5">
                    <FileSearch className="h-3.5 w-3.5" />
                    <span>ISSUE TABLE OF CONTENTS</span>
                  </p>
                  <h2 className="mt-1 font-academic text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-slate-950">
                    {filteredArticles.length} Article{filteredArticles.length === 1 ? "" : "s"} Published
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500">
                    Vol. 4, No. 2 · July 2026
                  </span>
                </div>
              </div>

              {/* Search & Topic Filters */}
              <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search articles by title, author, or keyword..."
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
                      Clear
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
                    All ({allArticles.length})
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
                    No articles match your search
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Try broader search keywords or reset all filters.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedTopic("all");
                    }}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#1e40af] bg-blue-50 border border-blue-200 px-3.5 py-1.5 hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    <span>Reset filters</span>
                  </button>
                </div>
              ) : (
                <StaggerContainer className="flex flex-col gap-5">
                  {filteredArticles.map((article, idx) => (
                    <StaggerItem key={article.id}>
                      <article className="bg-white border border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition-all group">
                        <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4 sm:gap-5 items-start">
                          
                          {/* Article Image Container */}
                          <Link
                            href={`/articles/${article.slug}`}
                            className="relative aspect-[4/3] sm:aspect-[3/4] w-full overflow-hidden bg-slate-950 border border-slate-200/80 shrink-0 block"
                          >
                            <Image
                              src={article.image || "/covers/medical.png"}
                              alt={article.title}
                              fill
                              sizes="(max-width: 639px) 100vw, 160px"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
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
                                    Open Access
                                  </span>
                                </div>
                                <span className="inline-flex items-center gap-1 text-[10.5px] font-mono text-slate-500">
                                  Pages {article.pages}
                                </span>
                              </div>

                              <Link href={`/articles/${article.slug}`} className="mt-2 block">
                                <h3 className="font-academic text-base sm:text-[18px] font-medium leading-snug text-slate-950 group-hover:text-[#1e40af] transition-colors line-clamp-2">
                                  {article.title}
                                </h3>
                              </Link>

                              <p className="mt-1 text-xs font-semibold text-slate-600 truncate">
                                By {article.authors.join(", ")}
                              </p>

                              <p className="mt-1.5 text-xs leading-relaxed text-slate-600 line-clamp-2">
                                {article.abstract}
                              </p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-3 text-[10.5px] font-mono text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3 text-slate-400" />
                                  {article.metrics?.views.toLocaleString()} views
                                </span>
                                <span className="flex items-center gap-1">
                                  <Download className="h-3 w-3 text-slate-400" />
                                  {article.metrics?.downloads.toLocaleString()} pdfs
                                </span>
                                <span className="text-slate-400 hidden sm:inline">|</span>
                                <span className="text-slate-500 hidden sm:inline truncate max-w-[140px]">
                                  DOI: {article.doi}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/articles/${article.slug}`}
                                  aria-label={`Read ${article.title}`}
                                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#1e40af] hover:underline"
                                >
                                  <span>Read Full Article</span>
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

            {/* ── Right Column: Sticky Sidebar ── */}
            <aside className="space-y-6 lg:sticky lg:top-24">
              
              {/* Journal Specifications */}
              <div className="bg-white border border-slate-200/90 p-5 shadow-2xs">
                <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#1e40af] border-b border-slate-100 pb-3 mb-3 flex items-center gap-1.5">
                  <Library className="h-3.5 w-3.5" />
                  <span>Issue Specifications</span>
                </p>
                <dl className="divide-y divide-slate-100 text-xs">
                  <div className="flex items-center justify-between py-2">
                    <dt className="text-slate-500">Volume / Issue</dt>
                    <dd className="font-semibold text-slate-900">{currentIssue.volume}, {currentIssue.issue}</dd>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <dt className="text-slate-500">Publication Date</dt>
                    <dd className="font-semibold text-slate-900">{currentIssue.month} {currentIssue.year}</dd>
                  </div>
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
                    <dd className="font-semibold text-emerald-700">CC BY 4.0 Open Access</dd>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <dt className="text-slate-500">Digital DOI Prefix</dt>
                    <dd className="font-mono text-slate-900">10.5555/gbj.2026</dd>
                  </div>
                </dl>
              </div>

              {/* Editorial Leadership */}
              <div className="bg-white border border-slate-200/90 p-5 shadow-2xs">
                <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#1e40af] border-b border-slate-100 pb-3 mb-3 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  <span>Editorial Leadership</span>
                </p>
                <div className="space-y-3 text-xs">
                  <div>
                    <p className="font-academic font-bold text-slate-900">Prof. Dr. Laila Rahman, PhD</p>
                    <p className="text-[11px] text-slate-500">Editor-in-Chief · Faculty of Health Sciences</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <p className="font-academic font-bold text-slate-900">Prof. Saiful Islam, MPharm</p>
                    <p className="text-[11px] text-slate-500">Managing Editor · Department of Pharmacy</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <Link
                    href="/editorial-board"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1e40af] hover:underline"
                  >
                    <span>Full Editorial Board</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Call for Papers Box */}
              <div className="bg-[#0b1b3d] text-white p-5 shadow-2xs border border-slate-800">
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-300">
                  CALL FOR PAPERS
                </p>
                <h4 className="mt-1.5 font-academic text-base font-medium text-white">
                  Volume 5, Issue 1 (January 2027)
                </h4>
                <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                  Accepting manuscripts across Health, Pharmacy, Agriculture, and Computing.
                </p>
                <Link
                  href="/dashboard/submissions/new"
                  className="mt-4 inline-flex items-center gap-1.5 bg-[#1e40af] hover:bg-[#1e3a8a] text-white px-4 py-2 text-xs font-semibold transition-colors w-full justify-center"
                >
                  <span>Submit Manuscript</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Previous Editions */}
              <div className="bg-white border border-slate-200/90 p-5 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#1e40af]">
                    Previous Issues
                  </p>
                  <Link
                    href="/issues"
                    className="text-[11px] font-semibold text-[#1e40af] hover:underline"
                  >
                    All Issues
                  </Link>
                </div>
                <div className="space-y-2 text-xs">
                  {issues.slice(1, 4).map((past) => (
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

            </aside>

          </div>

        </div>
      </section>
    </PageShell>
  );
}
