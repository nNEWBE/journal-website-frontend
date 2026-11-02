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
  type Article,
} from "@/lib/data";
import { getBackendUrl } from "@/lib/backend-url";
import { getPageContent } from "@/lib/cms/page-content";
import articlesDefaults from "@/lib/cms/defaults/articles.json";
import {
  ArticlesStandardsBand,
  ArticlesSubjectsCard,
} from "@/components/articles/articles-listing-blocks";
import { JournalCtaPanel, PageHero, type HeroSpec } from "@/components/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Articles & Research Archive | GB Journal of Research",
  description:
    "Explore peer-reviewed research articles across health, pharmacy, agriculture, law, computing, and social welfare from the Gono Bishwabidyalay Journal of Research.",
};

async function fetchTopicsFromDb(): Promise<string[]> {
  try {
    const backendUrl = getBackendUrl();
    const res = await fetch(`${backendUrl}/api/v1/topics`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.filter((t: any) => typeof t === "string" && t.trim().length > 0);
      }
    }
  } catch (err) {
    console.error("Failed to fetch topics from DB:", err);
  }
  return topics;
}

async function fetchArticleTypesFromDb(): Promise<string[]> {
  try {
    const backendUrl = getBackendUrl();
    const res = await fetch(`${backendUrl}/api/v1/article-types`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.filter((t: any) => typeof t === "string" && t.trim().length > 0);
      }
    }
  } catch (err) {
    console.error("Failed to fetch article types from DB:", err);
  }
  return articleTypes;
}

async function fetchArticlesFromDb(
  q?: string,
  type?: string,
  topic?: string
): Promise<Article[]> {
  try {
    const backendUrl = getBackendUrl();
    const query = new URLSearchParams();
    if (q) query.set("query", q);
    if (type && type !== "All Categories" && type !== "All Types") query.set("type", type);
    if (topic && topic !== "All Topics") query.set("topic", topic);
    query.set("size", "100");

    const res = await fetch(`${backendUrl}/api/v1/articles?${query.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) return [];
    const data = await res.json();
    const items = data.content || [];

    return items.map((item: any) => {
      const authorsList: string[] = Array.isArray(item.authors)
        ? item.authors.map((a: any) => (typeof a === "string" ? a : a.name || ""))
        : typeof item.authors === "string"
          ? (item.authors.includes(",")
            ? item.authors.split(",").map((s: string) => s.trim())
            : [item.authors.trim()])
          : [];

      return {
        id: item.articleId || String(item.id || item.slug),
        slug: item.slug,
        title: item.title,
        type: item.type || "Research Article",
        topic: item.topic || "General",
        department: item.department || "Academic Research",
        authors: authorsList,
        abstract: item.abstract || item.abstractText || "",
        issue: item.issue || item.issueLabel || "Current Issue",
        volume: item.volume || item.volumeLabel || "Volume 4",
        pages: item.pages || "1-10",
        doi: item.doi || "10.5555/gbj.2026.001",
        publishedAt: item.publishedAt || "2026",
        metrics: {
          views: item.metrics?.views ?? 0,
          downloads: item.metrics?.downloads ?? 0,
          citations: item.metrics?.citations ?? 0,
        },
        keywords: Array.isArray(item.keywords) ? item.keywords : [],
        sections: [],
        image: item.image || item.imageUrl || "/covers/medical.png",
        pdf: item.pdf || item.pdfUrl || "",
      };
    });
  } catch (err) {
    console.error("Failed to fetch articles from DB:", err);
    return [];
  }
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const contentPromise = getPageContent(articlesDefaults);
  const params = await searchParams;
  const q = String(params.q ?? "");
  const type = String(params.type ?? "");
  const topic = String(params.topic ?? "");
  const [results, availableTopics, availableArticleTypes] = await Promise.all([
    fetchArticlesFromDb(q, type, topic),
    fetchTopicsFromDb(),
    fetchArticleTypesFromDb(),
  ]);
  const hasFilters = Boolean(q || type || topic);
  const content = await contentPromise;
  const resultsCopy = content.results;

  const heroSpecs: HeroSpec[] = [
    {
      label: content.hero.meta.articlesLabel || "Published articles",
      value: String(results.length),
      tone: "accent",
    },
    {
      label: content.hero.meta.topicsLabel || "Subject areas",
      value: String(availableTopics.length),
    },
  ];

  return (
    <PageShell>
      {/* ── 1. Hero Header ── */}
      {content.hero.visible && (
        <FadeIn delay={0.05}>
          <PageHero
            section={content.hero}
            ariaLabel="Articles & Publications Hero"
            eyebrowIcon={FileSearch}
            highlightIcons={[ShieldCheck, Globe2, Clock]}
            specsBefore={heroSpecs}
          />
        </FadeIn>
      )}

      {/* ── 2. Content & Filters ── */}
      <section className="bg-gb-tint py-10 sm:py-14 border-b border-slate-200/80">
        <div className="container-x">
          {/* Filter form */}
          <FadeIn delay={0.1}>
            <ArticlesFilterForm
              key={`filter-${q}-${type}-${topic}`}
              initialQ={q}
              initialType={type}
              initialTopic={topic}
              articleTypes={availableArticleTypes}
              topics={availableTopics}
              labels={resultsCopy.meta}
            />
          </FadeIn>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
            {/* Main Column: Results */}
            <div>
              {resultsCopy.visible && (
                <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-slate-200/90 pb-4">
                  <div>
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-gb-accent flex items-center gap-1.5">
                      <FileSearch className="h-3.5 w-3.5" />
                      <span>{hasFilters ? resultsCopy.subtitle : resultsCopy.title}</span>
                    </p>
                    <h2 className="mt-1 font-academic text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-slate-950">
                      {results.length} article{results.length === 1 ? "" : "s"} found
                    </h2>
                    {hasFilters && (
                      <p className="mt-1 text-xs text-slate-500 font-mono">
                        {resultsCopy.meta.filteredByLabel} {[q, type, topic].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>

                  {hasFilters ? (
                    <Link
                      href="/articles"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 hover:bg-rose-100 transition-colors"
                    >
                      <span>{resultsCopy.meta.clearFiltersLabel}</span>
                    </Link>
                  ) : (
                    <Link
                      href={resultsCopy.meta.browseLink?.href || "/issues"}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-gb-accent bg-white border border-slate-200 px-3 py-1.5 hover:bg-slate-50 transition-colors shadow-2xs"
                    >
                      <span>{resultsCopy.meta.browseLink?.label}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              )}

              {results.length === 0 ? (
                <div className="border border-dashed border-slate-300 bg-white p-12 text-center">
                  <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
                  <h3 className="mt-3 font-academic text-lg font-bold text-slate-800">
                    {resultsCopy.meta.emptyTitle}
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-slate-500">
                    {resultsCopy.meta.emptyText}
                  </p>
                  <Link
                    href={resultsCopy.meta.emptyCta?.href || "/articles"}
                    className="mt-5 inline-flex items-center gap-2 bg-gb-navy hover:bg-gb-navy-hover text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <span>{resultsCopy.meta.emptyCta?.label}</span>
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
                {content.subjects.visible && (
                  <ArticlesSubjectsCard
                    title={content.subjects.title}
                    topics={availableTopics}
                    activeTopic={topic}
                  />
                )}
              </FadeIn>
            </aside>
          </div>
        </div>
      </section>

      {/* ── 3. Archival Standards & Open Access Trust Banner ── */}
      {content.standards.visible && (
        <ArticlesStandardsBand section={content.standards} />
      )}

      {/* ── 4. Call for Manuscripts CTA ── */}
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
