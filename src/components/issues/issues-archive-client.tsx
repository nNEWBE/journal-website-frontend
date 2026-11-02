"use client";

import { Fragment, useState, useMemo, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Archive,
  ArrowUpRight,
  Award,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Clock,
  FileText,
  Globe2,
  Grid,
  Library,
  List as ListIcon,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { FadeIn } from "@/components/layout/page-transition";
import {
  ButtonLink,
  EmptyState,
  FeatureCard,
  FeatureGrid,
  JournalCtaPanel,
  PageHero,
  PageSection,
  SectionHeader,
  type HeroSpec,
} from "@/components/site";
import { type Article, type Issue } from "@/lib/data";
import type { ResolvedPage } from "@/lib/cms/page-content";
import { cmsIcon } from "@/lib/cms/icons";
import type issuesDefaults from "@/lib/cms/defaults/issues.json";
import { issueDateLabel, volumeIssueLabel } from "./issue-labels";

const STANDARD_FALLBACK_ICONS = [Globe2, ShieldCheck, Award];
const COVER_PLACEHOLDER = "/covers/medical.png";

interface IssuesArchiveClientProps {
  initialIssues: Issue[];
  content: ResolvedPage<typeof issuesDefaults>;
}

/** Title shown for an issue: its theme, else its volume/issue label. */
function issueTitle(iss: Issue) {
  return iss.theme || volumeIssueLabel(iss, " · ") || issueDateLabel(iss);
}

export function IssuesArchiveClient({ initialIssues, content }: IssuesArchiveClientProps) {
  const heroSection = content.hero;
  const heroMeta = heroSection.meta;
  const featured = content.featured;
  const featuredMeta = featured.meta;
  const archive = content.archive;
  const archiveMeta = archive.meta;
  const standards = content.standards;
  const standardCards = Array.isArray(standards.meta.cards) ? standards.meta.cards : [];

  const issuesList = initialIssues;
  const currentIssue = issuesList[0];
  const allYears = useMemo(
    () =>
      [...new Set(issuesList.map((i) => i.year).filter(Boolean))].sort((a, b) => Number(b) - Number(a)),
    [issuesList]
  );
  const totalArticles = issuesList.reduce((sum, i) => sum + i.articleCount, 0);

  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter issues based on selected year and search query
  const filteredIssues = useMemo(() => {
    return issuesList.filter((iss) => {
      const matchesYear = selectedYear === "all" || iss.year === selectedYear;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        iss.theme.toLowerCase().includes(q) ||
        iss.volume.toLowerCase().includes(q) ||
        iss.issue.toLowerCase().includes(q) ||
        iss.month.toLowerCase().includes(q) ||
        iss.year.includes(q) ||
        (iss.articles || []).some(
          (a: Article) =>
            (a.title || "").toLowerCase().includes(q) || (a.topic || "").toLowerCase().includes(q)
        );

      return matchesYear && matchesSearch;
    });
  }, [issuesList, selectedYear, searchQuery]);

  // Group filtered issues by year
  const groupedIssuesByYear = useMemo(() => {
    const years = [...new Set(filteredIssues.map((i) => i.year))].sort((a, b) => Number(b) - Number(a));
    return years.map((yr) => ({
      year: yr,
      yearIssues: filteredIssues.filter((i) => i.year === yr),
    }));
  }, [filteredIssues]);

  const heroSpecs: HeroSpec[] = [
    {
      label: heroMeta.currentEditionLabel,
      value: (currentIssue && volumeIssueLabel(currentIssue, " · ")) || heroMeta.noCurrentEditionText || "—",
      tone: "accent",
    },
    { label: heroMeta.totalIssuesLabel, value: String(issuesList.length) },
    { label: heroMeta.historicalSpanLabel, value: String(allYears.length) },
    { label: heroMeta.catalogedArticlesLabel, value: String(totalArticles) },
  ];

  const filterButtonClass = (active: boolean) =>
    `px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition-all cursor-pointer border ${
      active ? "bg-gb-navy text-white border-gb-navy" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
    }`;

  const issueHref = (iss: Issue) => (currentIssue && iss.id === currentIssue.id ? "/issues/current" : "/articles");

  const renderers: Record<string, () => ReactNode> = {
    /* ── 1. Hero ── */
    hero: () => (
      <FadeIn delay={0.05}>
        <PageHero
          section={heroSection}
          ariaLabel="Issues & Volumes Hero"
          eyebrowIcon={Library}
          highlightIcons={[CalendarDays, Globe2, ShieldCheck]}
          specsBefore={heroSpecs}
        />
      </FadeIn>
    ),

    /* ── 2. Featured edition: the latest issue ── */
    featured: () => (
      <PageSection tone="tint" ariaLabel="Latest published issue">
        <SectionHeader
          eyebrow={featured.subtitle}
          title={featured.title}
          aside={
            currentIssue && (volumeIssueLabel(currentIssue) || issueDateLabel(currentIssue)) ? (
              <span className="shrink-0 bg-white px-3.5 py-1.5 border border-slate-200/90 shadow-2xs font-mono text-xs font-bold text-slate-800">
                {[volumeIssueLabel(currentIssue, " · "), issueDateLabel(currentIssue)].filter(Boolean).join(" — ")}
              </span>
            ) : undefined
          }
        />

        {currentIssue ? (
          <div className="bg-white border border-slate-200/90 p-6 sm:p-8 lg:p-10 shadow-2xs">
            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 lg:gap-10 items-start">
              <div className="relative aspect-3/4 w-full max-w-65 mx-auto lg:mx-0 overflow-hidden bg-slate-950 shadow-sm border border-slate-200/80">
                <Image
                  src={currentIssue.coverImage || COVER_PLACEHOLDER}
                  alt=""
                  fill
                  priority
                  sizes="260px"
                  className="object-cover"
                />
                <span className="pointer-events-none absolute inset-y-0 left-0 z-20 w-4 bg-linear-to-r from-black/80 via-black/30 to-transparent border-r border-white/10" />
                <div className="absolute inset-0 z-10 bg-linear-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                <div className="absolute top-3 right-3 z-20">
                  <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-400/40 px-2.5 py-1 text-[9.5px] font-mono font-bold uppercase tracking-wider text-emerald-300 backdrop-blur-md">
                    {featuredMeta.coverBadge}
                  </span>
                </div>

                {(volumeIssueLabel(currentIssue) || issueDateLabel(currentIssue)) && (
                  <div className="absolute bottom-3 left-3 right-3 z-20 bg-slate-950/85 p-2.5 border border-white/15 backdrop-blur-md">
                    <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-slate-300">
                      {volumeIssueLabel(currentIssue, " · ")}
                    </p>
                    <p className="text-xs font-bold text-white mt-0.5">{issueDateLabel(currentIssue)}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-gb-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                      <BookOpen className="h-3 w-3" />
                      {featuredMeta.statusBadge}
                    </span>
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider border border-slate-200/80">
                      {featuredMeta.issnBadge}
                    </span>
                    <span className="bg-amber-50 text-amber-900 px-2.5 py-0.5 font-mono text-[10px] font-bold border border-amber-200">
                      {currentIssue.articleCount} {featuredMeta.articleCountSuffix}
                    </span>
                  </div>

                  <Link href="/issues/current" className="group/title inline-block">
                    <h3 className="mt-3.5 font-academic text-2xl sm:text-3xl font-medium leading-tight text-slate-950 group-hover/title:text-gb-accent transition-colors">
                      {issueTitle(currentIssue)}
                    </h3>
                  </Link>

                  <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-slate-600 max-w-3xl">
                    {currentIssue.editorNote || featured.content}
                  </p>

                  {currentIssue.articles && currentIssue.articles.length > 0 && (
                    <div className="mt-5 bg-slate-50/70 border border-slate-200/80 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                        {featuredMeta.selectedArticlesLabel}
                      </p>
                      <ul className="space-y-2">
                        {currentIssue.articles.slice(0, 3).map((art: Article) => (
                          <li key={art.id}>
                            <Link
                              href={`/articles/${art.slug}`}
                              className="group/art flex items-start justify-between gap-3 text-xs font-semibold text-slate-700 hover:text-gb-accent transition-colors"
                            >
                              <span className="flex items-start gap-2 line-clamp-1">
                                <span className="mt-1 h-1.5 w-1.5 shrink-0 bg-gb-accent" />
                                <span className="group-hover/art:underline">{art.title}</span>
                              </span>
                              {art.type && (
                                <span className="shrink-0 font-mono text-[10.5px] text-slate-400">{art.type}</span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      {featuredMeta.reviewLabel}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Globe2 className="h-4 w-4 text-gb-accent" />
                      {featuredMeta.licenseLabel}
                    </span>
                  </div>

                  {featuredMeta.cta?.label && (
                    <ButtonLink href={featuredMeta.cta.href || "/issues/current"} icon={ArrowUpRight}>
                      {featuredMeta.cta.label}
                    </ButtonLink>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState icon={BookOpen} title={featuredMeta.emptyTitle} text={featuredMeta.emptyText} />
        )}
      </PageSection>
    ),

    /* ── 3. Archive directory by year ── */
    archive: () => (
      <PageSection tone="white" id="volume-archive" ariaLabel="Volume archive">
        <SectionHeader eyebrow={archive.subtitle} title={archive.title} intro={archive.content} />

        {issuesList.length > 0 && (
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/80 border border-slate-200/90 p-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button type="button" onClick={() => setSelectedYear("all")} className={filterButtonClass(selectedYear === "all")}>
                {archiveMeta.allYearsLabel} ({issuesList.length})
              </button>
              {allYears.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setSelectedYear(year)}
                  className={filterButtonClass(selectedYear === year)}
                >
                  {year} ({issuesList.filter((i) => i.year === year).length})
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  aria-label={archiveMeta.searchPlaceholder}
                  placeholder={archiveMeta.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 py-1.5 pl-8 pr-7 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-gb-accent focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    aria-label={archiveMeta.clearFiltersLabel}
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
                  aria-pressed={viewMode === "grid"}
                  className={`p-1.5 transition-colors ${viewMode === "grid" ? "bg-slate-100 text-gb-navy" : "text-slate-500 hover:text-slate-900"}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  title="List View"
                  aria-pressed={viewMode === "list"}
                  className={`p-1.5 transition-colors ${viewMode === "list" ? "bg-slate-100 text-gb-navy" : "text-slate-500 hover:text-slate-900"}`}
                >
                  <ListIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {groupedIssuesByYear.length === 0 &&
          (issuesList.length === 0 ? (
            <EmptyState icon={Archive} title={archiveMeta.emptyTitle} text={archiveMeta.noIssuesText} />
          ) : (
            <EmptyState
              icon={BookOpen}
              title={archiveMeta.emptyTitle}
              text={searchQuery ? `${archiveMeta.emptyText} “${searchQuery}”.` : archiveMeta.emptyText}
            >
              <button
                type="button"
                onClick={() => {
                  setSelectedYear("all");
                  setSearchQuery("");
                }}
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-5 py-3 text-xs font-semibold tracking-wide transition-colors cursor-pointer"
              >
                {archiveMeta.clearFiltersLabel}
              </button>
            </EmptyState>
          ))}

        <div className="space-y-12">
          {groupedIssuesByYear.map(({ year, yearIssues }) => {
            const volumeLabel = yearIssues.find((i) => i.volume)?.volume || "";

            return (
              <div key={year || "undated"} className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200/90 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-gb-navy text-white flex items-center justify-center font-mono font-bold text-xs">
                      {year || "—"}
                    </div>
                    <div>
                      <h3 className="font-academic text-lg font-medium text-slate-950">
                        {year ? `${year} ${archiveMeta.yearHeadingSuffix}` : archiveMeta.yearHeadingSuffix}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">
                        {yearIssues.length} {yearIssues.length === 1 ? archiveMeta.editionSingular : archiveMeta.editionPlural}
                        {volumeLabel && ` · ${volumeLabel}`}
                      </p>
                    </div>
                  </div>
                </div>

                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {yearIssues.map((iss) => {
                      const isCurrent = currentIssue ? iss.id === currentIssue.id : false;
                      return (
                        <Link
                          key={iss.id}
                          href={issueHref(iss)}
                          className="bg-white border border-slate-200/90 p-5 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-all group"
                        >
                          <div className="flex items-start gap-4">
                            <div className="relative aspect-3/4 w-24 shrink-0 overflow-hidden bg-slate-950 border border-slate-200/90 shadow-2xs">
                              <Image
                                src={iss.coverImage || COVER_PLACEHOLDER}
                                alt=""
                                fill
                                sizes="96px"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <span className="pointer-events-none absolute inset-y-0 left-0 z-20 w-2.5 bg-linear-to-r from-black/80 via-black/30 to-transparent border-r border-white/10" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                {iss.issue ? (
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-gb-accent bg-blue-50 px-2 py-0.5 border border-blue-100">
                                    {iss.issue}
                                  </span>
                                ) : (
                                  <span />
                                )}
                                <span
                                  className={
                                    isCurrent
                                      ? "text-[9.5px] font-bold uppercase text-emerald-700"
                                      : "text-[9.5px] font-mono text-slate-400 uppercase"
                                  }
                                >
                                  {isCurrent ? archiveMeta.currentLabel : archiveMeta.archivedLabel}
                                </span>
                              </div>

                              <h4 className="mt-2 font-academic text-base font-medium text-slate-950 group-hover:text-gb-accent transition-colors leading-snug line-clamp-2">
                                {issueTitle(iss)}
                              </h4>

                              <p className="mt-1 text-xs text-slate-500 font-mono">
                                {[iss.volume, iss.month].filter(Boolean).join(" · ")}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-slate-600 font-medium">
                              <strong className="text-slate-950 font-bold">{iss.articleCount}</strong> {archiveMeta.articlesLabel}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-gb-accent group-hover:underline">
                              <span>{archiveMeta.readIssueLabel}</span>
                              <ArrowUpRight className="h-3 w-3" />
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {yearIssues.map((iss) => {
                      const isCurrent = currentIssue ? iss.id === currentIssue.id : false;
                      return (
                        <Link
                          key={iss.id}
                          href={issueHref(iss)}
                          className="bg-white border border-slate-200/90 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:border-slate-300 transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative aspect-3/4 h-14 overflow-hidden bg-slate-950 shrink-0 border border-slate-200">
                              <Image src={iss.coverImage || COVER_PLACEHOLDER} alt="" fill sizes="56px" className="object-cover" />
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                {volumeIssueLabel(iss) && (
                                  <span className="font-mono text-xs font-bold text-gb-accent">{volumeIssueLabel(iss, " · ")}</span>
                                )}
                                {iss.month && <span className="text-xs text-slate-400 font-mono">({iss.month})</span>}
                                {isCurrent && (
                                  <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 text-[9px] font-bold uppercase">
                                    {archiveMeta.currentLabel}
                                  </span>
                                )}
                              </div>
                              <h4 className="mt-0.5 font-academic text-sm font-medium text-slate-950 group-hover:text-gb-accent transition-colors">
                                {issueTitle(iss)}
                              </h4>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0 text-xs">
                            <span className="text-slate-500 font-mono">
                              {iss.articleCount} {archiveMeta.articlesLabel}
                            </span>
                            <span className="inline-flex items-center gap-1 font-semibold text-gb-accent group-hover:translate-x-0.5 transition-transform">
                              {archiveMeta.exploreLabel} <ChevronRight className="h-3.5 w-3.5" />
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
      </PageSection>
    ),

    /* ── 4. Preservation & open access standards ── */
    standards: () => (
      <PageSection tone="tint" ariaLabel="Preservation standards">
        <SectionHeader eyebrow={standards.subtitle} title={standards.title} intro={standards.content} />
        <FeatureGrid columns={3}>
          {standardCards.map((card, idx) => (
            <FeatureCard
              key={`${card.title}-${idx}`}
              icon={cmsIcon(card.icon, STANDARD_FALLBACK_ICONS[idx] ?? ShieldCheck)}
              iconStyle="solid"
              title={card.title}
              description={card.text}
            />
          ))}
        </FeatureGrid>
      </PageSection>
    ),

    /* ── 5. Closing call for papers ── */
    cta: () => (
      <JournalCtaPanel
        section={content.cta}
        ariaLabel="Call for Papers CTA"
        badgeFallbackIcon={FileText}
        pillFallbackIcons={[Clock, Globe2, ShieldCheck]}
      />
    ),
  };

  return (
    <PageShell>
      {content._order.map((key) => (
        <Fragment key={key}>{renderers[key]?.()}</Fragment>
      ))}
    </PageShell>
  );
}
