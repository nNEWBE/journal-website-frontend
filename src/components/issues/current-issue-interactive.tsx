"use client";

import { Fragment, useState, useMemo, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  Copy,
  Download,
  Eye,
  FileText,
  Globe2,
  Library,
  LockOpen,
  Search,
  Send,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/layout/page-transition";
import { ButtonLink, EmptyState, JournalCtaPanel, PageSection, SectionHeader } from "@/components/site";
import type { Article } from "@/lib/data";
import { issueDateLabel, volumeIssueLabel } from "./issue-labels";
import type { ResolvedPage } from "@/lib/cms/page-content";
import type issuesCurrentDefaults from "@/lib/cms/defaults/issues-current.json";

const SIDEBAR_SECTION_KEYS = new Set(["specifications", "leadership", "previous-issues"]);

const SPEC_TONE_CLASSES: Record<string, string> = {
  default: "font-semibold text-slate-900",
  mono: "font-mono font-semibold text-slate-900",
  success: "font-semibold text-emerald-700",
};

const JOURNAL_NAME = "Gono Bishwabidyalay Journal of Research";

/** "pp. 1–84" when every article has a numeric page range, otherwise "". */
function issuePageRange(articles: Article[]) {
  if (articles.length === 0) return "";
  let first = Infinity;
  let last = -Infinity;
  for (const article of articles) {
    const match = /^\s*(\d+)\s*[-–]\s*(\d+)\s*$/.exec(article.pages || "");
    if (!match) return "";
    first = Math.min(first, Number(match[1]));
    last = Math.max(last, Number(match[2]));
  }
  return `pp. ${first}–${last}`;
}

/** Issue citation built only from the data the issue actually has. */
function buildIssueCitation(issue: any, articles: Article[]) {
  const head = issue.year ? `${JOURNAL_NAME} (${issue.year}).` : `${JOURNAL_NAME}.`;
  const theme = issue.theme ? `${String(issue.theme).replace(/\.$/, "")}.` : "";
  const location = [volumeIssueLabel(issue), issuePageRange(articles)].filter(Boolean).join(", ");
  return [head, theme, location && `${location}.`].filter(Boolean).join(" ");
}

function SidebarCard({
  icon: Icon,
  title,
  action,
  children,
}: {
  icon?: LucideIcon;
  title: string;
  action?: { label: string; href: string };
  children: ReactNode;
}) {
  return (
    <div className="bg-white border border-slate-200/90 p-5 shadow-2xs">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
        <p className="text-[10.5px] font-bold uppercase tracking-wider text-gb-accent flex items-center gap-1.5">
          {Icon && <Icon className="h-3.5 w-3.5" />}
          <span>{title}</span>
        </p>
        {action?.label && (
          <Link href={action.href || "#"} className="text-[11px] font-semibold text-gb-accent hover:underline">
            {action.label}
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

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
  const leadershipCta = leadership.meta.cta;
  const previous = content["previous-issues"];
  const allIssuesLink = previous.meta.allIssuesLink;

  const issueLabel = volumeIssueLabel(currentIssue);
  const issueDate = issueDateLabel(currentIssue);
  const issueTitle = currentIssue.theme || issueLabel || hero.title;
  const previousIssues = otherIssues.filter((iss: any) => iss.id !== currentIssue.id).slice(0, 3);

  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);

  // Extract unique topics in this issue
  const issueTopics: string[] = useMemo(() => {
    return Array.from(new Set(allArticles.map((a: Article) => a.topic).filter(Boolean)));
  }, [allArticles]);

  // Filter articles
  const filteredArticles = useMemo(() => {
    return allArticles.filter((article: Article) => {
      const matchesTopic = selectedTopic === "all" || article.topic === selectedTopic;
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

  const citationText = buildIssueCitation(currentIssue, allArticles);

  const handleCopyCitation = () => {
    if (!citationText) return;
    navigator.clipboard.writeText(citationText);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2500);
  };

  const filterButtonClass = (active: boolean) =>
    `px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
      active ? "bg-gb-navy text-white border-gb-navy" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
    }`;

  const sidebarRenderers: Record<string, () => ReactNode> = {
    specifications: () => (
      <SidebarCard icon={Library} title={specs.title}>
        <dl className="divide-y divide-slate-100 text-xs">
          <div className="flex items-center justify-between gap-4 py-2">
            <dt className="text-slate-500">{specs.meta.volumeIssueLabel}</dt>
            <dd className="font-semibold text-slate-900 text-right">{issueLabel || "—"}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-2">
            <dt className="text-slate-500">{specs.meta.publicationDateLabel}</dt>
            <dd className="font-semibold text-slate-900 text-right">{issueDate || "—"}</dd>
          </div>
          {specRows.map((row: { label: string; value: string; tone?: string }, idx) => (
            <div key={`${row.label}-${idx}`} className="flex items-center justify-between gap-4 py-2">
              <dt className="text-slate-500">{row.label}</dt>
              <dd className={`text-right ${SPEC_TONE_CLASSES[row.tone || "default"] ?? SPEC_TONE_CLASSES.default}`}>
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </SidebarCard>
    ),

    leadership: () => (
      <SidebarCard icon={Users} title={leadership.title}>
        {leadership.content && <p className="text-xs leading-relaxed text-slate-600">{leadership.content}</p>}
        {leadershipCta?.label && (
          <Link
            href={leadershipCta.href || "/editorial-board"}
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gb-accent hover:underline"
          >
            <span>{leadershipCta.label}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </SidebarCard>
    ),

    "previous-issues": () =>
      previousIssues.length > 0 ? (
        <SidebarCard title={previous.title} action={allIssuesLink}>
          <div className="space-y-2 text-xs">
            {previousIssues.map((past: any) => (
              <Link
                key={past.id}
                href="/issues"
                className="block p-2.5 border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center justify-between gap-2 font-mono text-[10px] text-slate-400">
                  <span>{volumeIssueLabel(past)}</span>
                  <span>{issueDateLabel(past)}</span>
                </div>
                <p className="mt-1 font-academic font-medium text-slate-900 group-hover:text-gb-accent truncate">
                  {past.theme || volumeIssueLabel(past)}
                </p>
              </Link>
            ))}
          </div>
        </SidebarCard>
      ) : null,
  };

  return (
    <PageShell>
      {/* 1. Issue header: breadcrumb, cover and issue details */}
      {hero.visible && (
        <section aria-label="Current issue" className="bg-white border-b border-slate-200/80 pt-8 pb-12 sm:pt-10 sm:pb-16">
          <div className="container-x">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-6">
              <Link href="/" className="hover:text-gb-accent transition-colors">
                {heroMeta.breadcrumbHomeLabel}
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <Link href="/issues" className="hover:text-gb-accent transition-colors">
                {heroMeta.breadcrumbIssuesLabel}
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-slate-900 font-semibold">{issueLabel || hero.subtitle}</span>
            </nav>

            <div className="mb-8 sm:mb-10">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-gb-accent">{hero.subtitle}</span>
                <div className="h-px w-12 bg-slate-300" />
              </div>
              <h1 className="mt-3 font-academic text-3xl sm:text-4xl lg:text-[2.85rem] font-medium leading-[1.12] tracking-[-0.025em] text-slate-950">
                {issueTitle}
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr] gap-8 lg:gap-12 items-center">
              {/* Issue cover */}
              <FadeIn direction="up" delay={0.1}>
                <div className="relative mx-auto lg:mx-0 w-full max-w-67.5 sm:max-w-71.25 aspect-3/4 overflow-hidden bg-gb-night text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)] border border-slate-200/80 group">
                  <div className="absolute inset-0">
                    <Image
                      src={currentIssue.coverImageUrl || currentIssue.coverImage || "/covers/medical.png"}
                      alt={`${JOURNAL_NAME} cover${issueLabel ? `, ${issueLabel}` : ""}`}
                      fill
                      priority
                      sizes="290px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-gb-night/90 via-gb-night/25 to-gb-night/95" />
                  </div>

                  <div className="relative z-10 p-4 sm:p-4.5 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="relative h-8 w-8 bg-white/10 border border-white/20 p-1">
                        <Image
                          src={heroMeta.coverLogoImage || "/gb-logo-official.png"}
                          alt=""
                          fill
                          sizes="32px"
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-academic text-base sm:text-lg font-bold tracking-wider text-white leading-tight">
                          {heroMeta.coverJournalName}
                        </p>
                        <p className="text-[7.5px] font-bold uppercase tracking-[0.16em] text-cyan-300">
                          {heroMeta.coverJournalTagline}
                        </p>
                      </div>
                    </div>
                    <div className="text-right font-mono text-[7px] text-slate-300/80 leading-tight">
                      <p>{heroMeta.coverOnlineIssnLine}</p>
                      <p>{heroMeta.coverPrintIssnLine}</p>
                    </div>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 z-10 p-4 sm:p-4.5 flex flex-col justify-end">
                    {currentIssue.theme && (
                      <div className="mb-3">
                        <p className="text-[7.5px] font-bold uppercase tracking-[0.16em] text-cyan-300">
                          {heroMeta.coverThemeLabel}
                        </p>
                        <p className="mt-1 font-academic text-[11px] font-medium leading-[1.3] text-white/95 line-clamp-3">
                          {currentIssue.theme}
                        </p>
                      </div>
                    )}
                    {(issueLabel || issueDate) && (
                      <div className="pt-2.5 border-t border-white/20 flex items-center justify-between gap-2 font-mono text-[8px] text-white/80 font-bold uppercase tracking-wider">
                        <span>{volumeIssueLabel(currentIssue, " | ")}</span>
                        <span>{issueDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>

              {/* Issue details */}
              <FadeIn direction="up" delay={0.15} className="flex flex-col justify-center">
                <p className="text-[11.5px] sm:text-xs font-bold uppercase tracking-[0.14em] text-gb-accent">{hero.title}</p>

                {issueLabel && (
                  <p className="mt-2 font-academic lining-nums text-4xl sm:text-5xl font-medium leading-[1.1] tracking-[-0.02em] text-slate-950">
                    {issueLabel}
                  </p>
                )}

                <p className="mt-1.5 text-sm sm:text-base font-medium text-slate-600">
                  {[issueDate && `${heroMeta.publishedPrefix} ${issueDate}`, heroMeta.accessLabel].filter(Boolean).join(" · ")}
                </p>

                <dl className="mt-6 pt-6 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-slate-100 text-gb-accent border border-slate-200">
                      <CalendarDays className="h-4 w-4" />
                    </span>
                    <div>
                      <dt className="text-xs font-bold text-slate-800">{heroMeta.publicationDateLabel}</dt>
                      <dd className="text-xs text-slate-600 mt-0.5">{issueDate || "—"}</dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:border-l sm:border-slate-200 sm:pl-6">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-slate-100 text-gb-accent border border-slate-200">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div>
                      <dt className="text-xs font-bold text-slate-800">{heroMeta.articlesLabel}</dt>
                      <dd className="text-xs text-slate-600 mt-0.5">{allArticles.length}</dd>
                    </div>
                  </div>
                </dl>

                <p className="mt-6 text-xs sm:text-sm leading-relaxed text-slate-600">
                  {currentIssue.editorNote || hero.content}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <ButtonLink href="#table-of-contents" variant="primary" icon={BookOpen} iconPosition="start">
                    {heroMeta.browseArticlesLabel} ({allArticles.length})
                  </ButtonLink>

                  <button
                    type="button"
                    onClick={handleCopyCitation}
                    className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-5 py-3 text-xs font-semibold tracking-wide transition-colors cursor-pointer"
                  >
                    {copiedCitation ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-700">{heroMeta.citationCopiedLabel}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-slate-500" />
                        <span>{heroMeta.copyCitationLabel}</span>
                      </>
                    )}
                  </button>

                  {heroMeta.submitCta?.label && (
                    <ButtonLink href={heroMeta.submitCta.href || "/dashboard/submissions/new"} variant="tertiary" icon={Send}>
                      {heroMeta.submitCta.label}
                    </ButtonLink>
                  )}
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
      )}

      {/* 2. Table of contents + sidebar */}
      <PageSection tone="tint" id="table-of-contents" ariaLabel="Issue table of contents">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-8 items-start">
          {toc.visible ? (
            <div>
              <SectionHeader
                eyebrow={toc.subtitle}
                title={`${filteredArticles.length} ${filteredArticles.length === 1 ? tocMeta.titleSingular : toc.title}`}
                aside={
                  issueLabel || issueDate ? (
                    <span className="text-xs font-mono text-slate-500 shrink-0">
                      {[issueLabel, issueDate].filter(Boolean).join(" · ")}
                    </span>
                  ) : undefined
                }
              />

              {/* Search & topic filters */}
              <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    aria-label={tocMeta.searchPlaceholder}
                    placeholder={tocMeta.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-gb-accent transition-all"
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

                {issueTopics.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    <button type="button" onClick={() => setSelectedTopic("all")} className={filterButtonClass(selectedTopic === "all")}>
                      {tocMeta.allTopicsLabel} ({allArticles.length})
                    </button>
                    {issueTopics.map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => setSelectedTopic(topic)}
                        className={filterButtonClass(selectedTopic === topic)}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {filteredArticles.length === 0 ? (
                <EmptyState icon={BookOpen} title={tocMeta.emptyTitle} text={tocMeta.emptyText}>
                  {(searchQuery || selectedTopic !== "all") && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedTopic("all");
                      }}
                      className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-5 py-3 text-xs font-semibold tracking-wide transition-colors cursor-pointer"
                    >
                      {tocMeta.resetFiltersLabel}
                    </button>
                  )}
                </EmptyState>
              ) : (
                <StaggerContainer className="flex flex-col gap-5">
                  {filteredArticles.map((article: Article, idx: number) => (
                    <StaggerItem key={article.id}>
                      <article className="bg-white border border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition-all group">
                        <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4 sm:gap-5 items-start">
                          <Link
                            href={`/articles/${article.slug}`}
                            tabIndex={-1}
                            aria-hidden="true"
                            className="relative aspect-4/3 sm:aspect-3/4 w-full overflow-hidden bg-slate-950 border border-slate-200/80 shrink-0 block"
                          >
                            <Image
                              src={article.image || "/covers/medical.png"}
                              alt=""
                              fill
                              sizes="(max-width: 639px) 100vw, 160px"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
                            <span className="absolute top-2 left-2 bg-slate-900/90 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 text-[9px] font-mono font-bold">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            {article.topic && (
                              <span className="absolute bottom-2 left-2 right-2 inline-block bg-slate-900/90 text-white px-2 py-0.5 text-center text-[9px] font-bold uppercase tracking-wider truncate">
                                {article.topic}
                              </span>
                            )}
                          </Link>

                          <div className="flex flex-col justify-between h-full min-w-0">
                            <div>
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  {article.type && (
                                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-gb-accent px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider border border-blue-100">
                                      <FileText className="h-3 w-3" />
                                      {article.type}
                                    </span>
                                  )}
                                  <span className="inline-flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                                    <LockOpen className="h-3 w-3" />
                                    {tocMeta.openAccessLabel}
                                  </span>
                                </div>
                                {article.pages && (
                                  <span className="inline-flex items-center gap-1 text-[10.5px] font-mono text-slate-500">
                                    {tocMeta.pagesLabel} {article.pages}
                                  </span>
                                )}
                              </div>

                              <Link href={`/articles/${article.slug}`} className="mt-2 block">
                                <h3 className="font-academic text-base sm:text-[18px] font-medium leading-snug text-slate-950 group-hover:text-gb-accent transition-colors line-clamp-2">
                                  {article.title}
                                </h3>
                              </Link>

                              {article.authors.length > 0 && (
                                <p className="mt-1 text-xs font-semibold text-slate-600 truncate">
                                  {tocMeta.authorsPrefix} {article.authors.join(", ")}
                                </p>
                              )}

                              {article.abstract && (
                                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 line-clamp-2">{article.abstract}</p>
                              )}
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-3.5 text-xs text-slate-500">
                                <span className="inline-flex items-center gap-1.5 font-medium">
                                  <Eye className="h-3.5 w-3.5 text-slate-400" />
                                  <span>
                                    {(article.metrics?.views || 0).toLocaleString()}{" "}
                                    {article.metrics?.views === 1 ? tocMeta.viewSingular : tocMeta.viewPlural}
                                  </span>
                                </span>
                                <span className="inline-flex items-center gap-1.5 font-medium">
                                  <Download className="h-3.5 w-3.5 text-slate-400" />
                                  <span>
                                    {(article.metrics?.downloads || 0).toLocaleString()}{" "}
                                    {article.metrics?.downloads === 1 ? tocMeta.downloadSingular : tocMeta.downloadPlural}
                                  </span>
                                </span>
                                {article.doi && (
                                  <>
                                    <span className="text-slate-400 hidden sm:inline">|</span>
                                    <span className="text-slate-500 font-mono text-[11px] hidden sm:inline truncate max-w-35">
                                      {tocMeta.doiLabel} {article.doi}
                                    </span>
                                  </>
                                )}
                              </div>

                              <Link
                                href={`/articles/${article.slug}`}
                                aria-label={`Read ${article.title}`}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-gb-accent hover:underline"
                              >
                                <span>{tocMeta.readArticleLabel}</span>
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </article>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              )}
            </div>
          ) : (
            <div />
          )}

          <aside className="space-y-6 lg:sticky lg:top-24">
            {content._order
              .filter((key) => SIDEBAR_SECTION_KEYS.has(key))
              .map((key) => (
                <Fragment key={key}>{sidebarRenderers[key]?.()}</Fragment>
              ))}
          </aside>
        </div>
      </PageSection>

      {/* 3. Closing call for papers */}
      {content.cta.visible && (
        <JournalCtaPanel
          section={content.cta}
          ariaLabel="Call for Papers CTA"
          badgeFallbackIcon={FileText}
          pillFallbackIcons={[Clock, Globe2, ShieldCheck]}
        />
      )}
    </PageShell>
  );
}
