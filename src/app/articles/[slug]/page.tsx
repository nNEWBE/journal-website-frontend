import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Archive,
  ArrowLeft,
  ArrowUpRight,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileCheck2,
  FileText,
  Globe2,
  Hash,
  Library,
  Mail,
  MapPin,
  Quote,
  Scale,
  Send,
  ShieldCheck,
  Tag,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ArticleActions } from "@/components/articles/article-actions";
import { ArticleContents } from "@/components/articles/article-contents";
import { ArticleViewTracker } from "@/components/articles/article-view-tracker";
import { articles, findArticle } from "@/lib/data";
import type { Article } from "@/lib/data";
import { getBackendUrl } from "@/lib/backend-url";
import { cmsParagraphs, getPageContent, type ResolvedPage } from "@/lib/cms/page-content";
import { CmsText } from "@/lib/cms/cms-text";
import articleDetailDefaults from "@/lib/cms/defaults/article-detail.json";
import { JournalCtaPanel } from "@/components/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

const journalTitle = "Gono Bishwabidyalay Journal of Research";

function getSiteOrigin() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

function publicationDateIso(publishedAt: string) {
  const parsedDate = new Date(`1 ${publishedAt} UTC`);
  return Number.isNaN(parsedDate.getTime())
    ? publishedAt
    : parsedDate.toISOString();
}

async function fetchArticleFromDb(slug: string): Promise<Article | null> {
  try {
    const backendUrl = getBackendUrl();
    const res = await fetch(
      `${backendUrl}/api/v1/articles/${encodeURIComponent(slug)}`,
      { cache: "no-store" }
    );

    if (res.ok) {
      const data = await res.json();
      if (data && data.title) {
        const authorsList: string[] = Array.isArray(data.authors)
          ? data.authors.map((a: any) => (typeof a === "string" ? a : a.name || ""))
          : typeof data.authors === "string"
            ? (data.authors.includes(",")
              ? data.authors.split(",").map((s: string) => s.trim())
              : [data.authors.trim()])
            : [];

        const sectionsList = Array.isArray(data.sections)
          ? data.sections.map((s: any) => ({
            heading: s.heading || "",
            body: s.body || "",
          }))
          : [];

        return {
          id: data.articleId || String(data.id || slug),
          slug: data.slug || slug,
          title: data.title,
          type: data.type || "Research Article",
          topic: data.topic || "General",
          department: data.department || "Academic Research",
          authors: authorsList,
          abstract: data.abstract || data.abstractText || "",
          issue: data.issue || data.issueLabel || "Current Issue",
          volume: data.volume || data.volumeLabel || "Volume 4",
          pages: data.pages || "1-10",
          doi: data.doi || "10.5555/gbj.2026.001",
          publishedAt: data.publishedAt || "2026",
          metrics: {
            views: data.metrics?.views ?? 0,
            downloads: data.metrics?.downloads ?? 0,
            citations: data.metrics?.citations ?? 0,
          },
          keywords: Array.isArray(data.keywords) ? data.keywords : [],
          sections:
            sectionsList.length > 0
              ? sectionsList
              : [{ heading: "Abstract", body: data.abstract || data.abstractText || "" }],
          image: data.image || data.imageUrl || "/covers/medical.png",
          pdf: data.pdf || data.pdfUrl || "",
        };
      }
    }
  } catch (err) {
    console.error("Error fetching article from database:", err);
  }

  // Fallback to local data if backend doesn't have it
  return findArticle(slug) || null;
}

async function getRelatedArticlesFromDb(
  topic: string,
  currentSlug: string
): Promise<Article[]> {
  try {
    const backendUrl = getBackendUrl();
    const res = await fetch(
      `${backendUrl}/api/v1/articles?topic=${encodeURIComponent(topic)}&size=4`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const items = data.content || [];
    return items
      .filter((art: any) => art.slug !== currentSlug)
      .slice(0, 2)
      .map((art: any) => ({
        id: art.articleId || String(art.id || art.slug),
        slug: art.slug,
        title: art.title,
        type: art.type || "Research Article",
        topic: art.topic || "General",
        department: art.department || "Academic Research",
        authors: Array.isArray(art.authors)
          ? art.authors.map((a: any) => (typeof a === "string" ? a : a.name || ""))
          : [],
        abstract: art.abstract || art.abstractText || "",
        issue: art.issue || art.issueLabel || "Current Issue",
        volume: art.volume || art.volumeLabel || "Volume 4",
        pages: art.pages || "1-10",
        doi: art.doi || "10.5555/gbj.2026.001",
        publishedAt: art.publishedAt || "2026",
        metrics: {
          views: art.metrics?.views ?? 0,
          downloads: art.metrics?.downloads ?? 0,
          citations: art.metrics?.citations ?? 0,
        },
        keywords: Array.isArray(art.keywords) ? art.keywords : [],
        sections: [],
        image: art.image || art.imageUrl || "/covers/medical.png",
        pdf: art.pdf || art.pdfUrl || "",
      }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleFromDb(slug);

  if (!article) {
    return {
      title: `Article not found | ${journalTitle}`,
    };
  }

  const siteOrigin = getSiteOrigin();
  const articleUrl = `${siteOrigin}/articles/${article.slug}`;
  const [firstPage, lastPage] = article.pages.split(/[-–]/);
  const publishedTime = publicationDateIso(article.publishedAt);

  return {
    title: `${article.title} | ${journalTitle}`,
    description: article.abstract,
    keywords: article.keywords,
    authors: article.authors.map((name) => ({ name })),
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.abstract,
      url: articleUrl,
      siteName: journalTitle,
      publishedTime,
      authors: article.authors,
      section: article.topic,
      tags: article.keywords,
      images: [
        {
          url: `${siteOrigin}${article.image || "/covers/medical.png"}`,
          alt: `${article.topic} research article cover`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.abstract,
      images: [`${siteOrigin}${article.image || "/covers/medical.png"}`],
    },
    other: {
      citation_title: article.title,
      citation_author: article.authors,
      citation_publication_date: article.publishedAt,
      citation_journal_title: journalTitle,
      citation_volume: article.volume.replace(/\D/g, ""),
      citation_issue: article.issue.replace(/\D/g, ""),
      citation_firstpage: firstPage,
      citation_lastpage: lastPage,
      citation_doi: article.doi,
      ...(article.pdf
        ? { citation_pdf_url: `${siteOrigin}${article.pdf}` }
        : {}),
    },
  };
}

const getArticleReferences = (slug: string) => {
  if (slug === "community-healthcare-access-savar") {
    return [
      "Rahman, F., Hossain, M. J., & Karim, N. A. (2026). Community healthcare access patterns around Savar: A mixed-method university catchment study. GB Journal of Research, 4(2), 11–28. https://doi.org/10.5555/gbj.2026.001",
      "Bangladesh University Research Practice Notes. (2024). Decentralized healthcare systems in rural zones. Savar Public Health Review, 12(1), 104–118.",
      "World Health Organization. (2023). Primary healthcare access and catchment analytics. WHO Technical Report Series, 44(2), 12–29.",
      "Chowdhury, M. E., & Ahmed, A. (2022). Universal health coverage initiatives in peri-urban Bangladesh. Journal of Health and Population Nutrition, 40(3), 205–218.",
    ];
  }

  if (slug === "pharmacy-practice-antimicrobial-stewardship") {
    return [
      "Islam, S., & Sultana, T. (2026). Pharmacy practice readiness for antimicrobial stewardship in teaching settings. GB Journal of Research, 4(2), 29–44. https://doi.org/10.5555/gbj.2026.002",
      "Antimicrobial Stewardship Working Group. (2025). Teaching pharmacy models and curriculum integration. Clinical Pharmacy & Practice, 19(4), 210–224.",
      "Bangladesh Drug Dispensing Governance Guidelines. (2023). Professional practice standards for retail and clinical pharmacies. Ministry of Health & Family Welfare, 88–101.",
    ];
  }

  if (slug === "climate-resilient-agriculture-manifolds") {
    return [
      "Alam, M., & Jahan, S. (2026). Climate-resilient smallholder agriculture: Field observations from central Bangladesh. GB Journal of Research, 4(2), 45–59. https://doi.org/10.5555/gbj.2026.003",
      "Central Bangladesh Rainfall & Crop Adaptation Reports. (2025). Climate resilience in deltaic floodplains. Agricultural Adaptation & Development, 31(2), 77–93.",
      "Khan, A. R. (2024). Smallholder farming practices under changing monsoon patterns. South Asian Journal of Agriculture, 14(3), 112–127.",
      "Intergovernmental Panel on Climate Change (IPCC). (2023). Climate Change and Land: Special report on climate change, desertification, and food security. Cambridge University Press.",
    ];
  }

  return [
    "Gono Bishwabidyalay Journal of Research reference archive set. 2026.",
    "Bangladesh University Research Practice Notes. 2024.",
    "Community systems and higher education research methods. 2025.",
  ];
};

function sectionId(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type SidebarCopy = ResolvedPage<typeof articleDetailDefaults>["sidebar"];

function ArticleRecord({ article, copy }: { article: Article; copy: SidebarCopy }) {
  const recordItems = [
    ["DOI", article.doi],
    ["Pages", article.pages],
    ["Published", article.publishedAt],
    ["Volume", article.volume],
    ["Issue", article.issue],
    ["Licensing", copy.meta.recordLicensing],
    ["Review", copy.meta.recordReview],
  ];

  return (
    <section className="bg-white border border-slate-200/90 shadow-2xs p-5">
      <div className="border-b border-slate-100 pb-3 mb-4">
        <h2 className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-gb-accent">
          {copy.meta.recordHeading}
        </h2>
      </div>

      <div>
        <dl className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 pb-4 text-center">
          {[
            {
              label: "Views",
              value: article.metrics.views,
              icon: Eye,
            },
            {
              label: "Downloads",
              value: article.metrics.downloads,
              icon: Download,
            },
            {
              label: "Citations",
              value: article.metrics.citations,
              icon: Quote,
            },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="px-2">
              <dt className="flex items-center justify-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                <Icon className="h-3 w-3" />
                <span>{label}</span>
              </dt>
              <dd className="mt-1 font-mono text-base font-bold text-slate-900">
                {value.toLocaleString()}
              </dd>
            </div>
          ))}
        </dl>

        <dl className="mt-3 divide-y divide-slate-100 text-xs">
          {recordItems.map(([label, value]) => (
            <div
              key={label}
              className="flex items-start justify-between gap-4 py-2"
            >
              <dt className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                {label}
              </dt>
              <dd className="text-right font-medium text-slate-700">
                {label === "DOI" ? (
                  <a
                    href={`https://doi.org/${value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-gb-accent hover:underline"
                  >
                    <span>{value}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                ) : (
                  value
                )}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 flex items-center gap-2 bg-blue-50 border border-blue-100 p-2.5 text-xs font-semibold text-gb-accent">
          <ShieldCheck className="h-4 w-4 shrink-0 text-gb-accent" />
          <span>{copy.meta.verifiedLabel}</span>
        </div>
      </div>
    </section>
  );
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const contentPromise = getPageContent(articleDetailDefaults);
  const { slug } = await params;
  const article = await fetchArticleFromDb(slug);

  if (!article) {
    notFound();
  }

  const abstractSection = article.sections.find(
    (section) => section.heading.toLowerCase() === "abstract",
  );
  const bodySections = article.sections.filter(
    (section) => section.heading.toLowerCase() !== "abstract",
  );
  const references = getArticleReferences(article.slug);
  const recommended = await getRelatedArticlesFromDb(article.topic, article.slug);
  const content = await contentPromise;
  const labels = content.labels;
  const actionLabels = { ...content.actions.meta, heroDownload: content.actions.title };

  const siteOrigin = getSiteOrigin();
  const articleUrl = `${siteOrigin}/articles/${article.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: article.title,
    description: article.abstract,
    author: article.authors.map((name) => ({
      "@type": "Person",
      name,
    })),
    datePublished: publicationDateIso(article.publishedAt),
    pagination: article.pages,
    volumeNumber: article.volume.replace(/\D/g, ""),
    issueNumber: article.issue.replace(/\D/g, ""),
    identifier: `https://doi.org/${article.doi}`,
    keywords: article.keywords,
    isAccessibleForFree: true,
    url: articleUrl,
    image: `${siteOrigin}${article.image || "/covers/medical.png"}`,
    isPartOf: {
      "@type": "Periodical",
      name: journalTitle,
    },
    ...(article.pdf
      ? {
        encoding: {
          "@type": "MediaObject",
          contentUrl: `${siteOrigin}${article.pdf}`,
          encodingFormat: "application/pdf",
        },
      }
      : {}),
  };

  return (
    <PageShell>
      <ArticleViewTracker slug={article.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      {/* ── 1. Article Hero Header ── */}
      <section
        className="relative overflow-hidden bg-gb-night text-white border-b border-slate-800 py-12 sm:py-16 lg:py-20"
        aria-labelledby="article-title"
      >
        {/* Top gold-to-blue accent line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-amber-400 via-blue-500 to-transparent" />

        {/* Ambient glows */}
        <div className="pointer-events-none absolute -top-36 -right-36 h-140 w-140 rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-80 w-90 rounded-full bg-amber-500/10 blur-[80px]" />

        <div className="container-x relative grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 lg:gap-14 items-center">
          {/* Left Column: Meta & Title */}
          <div>
            {/* Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-white text-[10px] font-bold uppercase tracking-[0.15em] border border-white/15">
                <FileText className="h-3 w-3" />
                {article.type}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 text-emerald-300 text-[10px] font-bold uppercase tracking-[0.15em] border border-emerald-500/30">
                <Globe2 className="h-3 w-3" />
                {labels.meta.openAccessBadge}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 text-amber-300 text-[10px] font-bold uppercase tracking-[0.15em] border border-white/10">
                <Tag className="h-3 w-3" />
                {article.topic}
              </span>
            </div>

            {/* Title */}
            <h1
              id="article-title"
              className="mt-5 font-academic text-2xl sm:text-3xl lg:text-[2.65rem] font-medium leading-[1.18] tracking-tight text-white"
            >
              {article.title}
            </h1>

            {/* Authors */}
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300">Authors</span>
              <span className="h-3 w-px bg-white/20" />
              <span className="text-xs sm:text-sm font-medium text-slate-200">{article.authors.join(" · ")}</span>
            </div>

            {/* Publication meta row */}
            <dl className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-white/10 py-4 text-xs">
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Publication</dt>
                <dd className="mt-0.5 font-semibold text-white">{article.volume}, {article.issue}, pp. {article.pages}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Published</dt>
                <dd className="mt-0.5 font-semibold text-white">{article.publishedAt}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">DOI Reference</dt>
                <dd className="mt-0.5">
                  <a
                    href={`https://doi.org/${article.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-amber-300 hover:underline"
                  >
                    <span>{article.doi}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </dd>
              </div>
            </dl>

            {/* Action Buttons */}
            <div className="mt-6">
              <ArticleActions article={article} variant="hero" labels={actionLabels} />
            </div>
          </div>

          {/* Right Column: Article Cover */}
          <div className="relative aspect-3/4 w-full max-w-65 mx-auto lg:mx-0 overflow-hidden bg-slate-950 border border-white/20 shadow-2xl">
            <Image
              src={article.image ?? "/covers/medical.png"}
              alt={`${article.topic} article cover`}
              fill
              priority
              sizes="260px"
              className="object-cover"
            />
            {/* 3D Spine overlay */}
            <span className="pointer-events-none absolute inset-y-0 left-0 z-20 w-3 bg-linear-to-r from-black/80 via-black/30 to-transparent border-r border-white/10" />
            <div className="absolute inset-0 bg-linear-to-t from-gb-night via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 z-20 p-2.5 bg-slate-950/85 border border-white/15 backdrop-blur-md">
              <p className="text-[9px] font-bold uppercase tracking-wider text-amber-300">{article.department}</p>
              <p className="text-xs font-bold text-white mt-0.5">{article.volume} · {article.issue}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Floating Metrics Bar ── */}
      <div className="bg-gb-tint pb-20 pt-8 border-b border-slate-200/80">
        <div className="container-x">
          <div className="bg-white border border-slate-200/90 shadow-2xs mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              {/* Metric 1: Views */}
              <div className="p-3.5 sm:py-5 sm:px-6 flex items-center justify-center gap-3 sm:gap-3.5 group hover:bg-slate-50/50 transition-colors">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center bg-blue-50 text-[#1f2f82] border border-blue-100">
                  <Eye className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </div>
                <div>
                  <p className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Views</p>
                  <p className="font-mono text-lg sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                    {article.metrics.views.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Metric 2: Downloads */}
              <div className="p-3.5 sm:py-5 sm:px-6 flex items-center justify-center gap-3 sm:gap-3.5 group hover:bg-slate-50/50 transition-colors">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <Download className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </div>
                <div>
                  <p className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">PDF Downloads</p>
                  <p className="font-mono text-lg sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                    {article.metrics.downloads.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Metric 3: Citations */}
              <div className="p-3.5 sm:py-5 sm:px-6 flex items-center justify-center gap-3 sm:gap-3.5 group hover:bg-slate-50/50 transition-colors">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center bg-amber-50 text-amber-700 border border-amber-100">
                  <Quote className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </div>
                <div>
                  <p className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">Citations</p>
                  <p className="font-mono text-lg sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                    {article.metrics.citations.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Metric 4: Page Extent */}
              <div className="p-3.5 sm:py-5 sm:px-6 flex items-center justify-center gap-3 sm:gap-3.5 group hover:bg-slate-50/50 transition-colors">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center bg-slate-100 text-slate-700 border border-slate-200">
                  <BookOpen className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </div>
                <div>
                  <p className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">Page Extent</p>
                  <p className="font-mono text-lg sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                    {article.pages}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── 3. Main Reading Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
            {/* Article Content Column */}
            <div>
              <article className="bg-white border border-slate-200/90 shadow-2xs">
                {/* Status Bar */}
                <div className="bg-gb-navy text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <ShieldCheck className="h-4 w-4" />
                    <span>{labels.meta.peerReviewBadge}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300 font-medium">
                    <span>{article.department}</span>
                    <span>·</span>
                    <span className="text-amber-300">{labels.meta.openAccessBadge}</span>
                  </div>
                </div>

                {/* Abstract Section */}
                {abstractSection && (
                  <section
                    id={sectionId(abstractSection.heading)}
                    className="p-6 sm:p-10 border-b border-slate-200/80 bg-slate-50/60"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="flex h-8 w-8 items-center justify-center bg-gb-navy text-amber-300">
                        <Quote className="h-4 w-4" />
                      </span>
                      <div>
                        <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-gb-accent">
                          {labels.title}
                        </h2>
                        <p className="text-[10.5px] text-slate-400">{labels.subtitle}</p>
                      </div>
                    </div>
                    <p className="font-academic text-base sm:text-lg leading-relaxed text-slate-800 wrap-break-word whitespace-pre-wrap">
                      {abstractSection.body}
                    </p>
                  </section>
                )}

                {/* Body Sections */}
                <div className="p-6 sm:p-10 divide-y divide-slate-100">
                  {bodySections.map((section, index) => (
                    <section
                      key={section.heading}
                      id={sectionId(section.heading)}
                      className="py-8 first:pt-0 last:pb-0 scroll-mt-24"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span className="flex h-7 w-7 items-center justify-center bg-blue-50 border border-blue-200 font-mono text-xs font-bold text-gb-accent">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h2 className="font-academic text-xl sm:text-2xl font-medium text-slate-950">
                          {section.heading}
                        </h2>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700 max-w-prose wrap-break-word whitespace-pre-wrap">
                        {section.body}
                      </p>
                    </section>
                  ))}

                  {/* Keywords */}
                  <section className="py-8">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-gb-accent mb-3">
                      {labels.meta.keywordsHeading}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {article.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 border border-slate-200/80"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </section>

                  {/* Declarations */}
                  {content.declarations.visible && (
                    <section className="py-8">
                      <h3 className="text-[11px] font-bold uppercase tracking-wider text-gb-accent mb-4">
                        {content.declarations.title}
                      </h3>
                      <div className="bg-slate-50 border border-slate-200/80 p-4 space-y-2.5 text-xs text-slate-600">
                        {cmsParagraphs(content.declarations.content).map((paragraph, idx) => (
                          <p key={idx}>
                            <CmsText text={paragraph} strongClassName="text-slate-900 font-semibold" />
                          </p>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* References */}
                  <section id="references" className="py-8 scroll-mt-24">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-gb-accent mb-4">
                      {labels.meta.referencesHeading}
                    </h3>
                    <ol className="space-y-3">
                      {references.map((ref, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 bg-slate-50/70 border border-slate-200/70 p-3.5 text-xs text-slate-700 leading-relaxed"
                        >
                          <span className="font-mono font-bold text-gb-accent shrink-0">
                            [{idx + 1}]
                          </span>
                          <span>{ref}</span>
                        </li>
                      ))}
                    </ol>
                  </section>
                </div>
              </article>
            </div>

            {/* Sticky Sidebar Column */}
            <aside className="space-y-6 lg:sticky lg:top-24">
              {/* Quick Actions Card */}
              <div className="bg-white border border-slate-200/90 p-5 shadow-2xs">
                <p className="text-[10.5px] font-bold uppercase tracking-wider text-gb-accent border-b border-slate-100 pb-3 mb-4">
                  {content.sidebar.title}
                </p>
                <ArticleActions article={article} labels={actionLabels} />
              </div>

              {/* Table of Contents */}
              <div className="bg-white border border-slate-200/90 p-5 shadow-2xs">
                <p className="text-[10.5px] font-bold uppercase tracking-wider text-gb-accent border-b border-slate-100 pb-3 mb-3">
                  {content.sidebar.meta.contentsHeading}
                </p>
                <ArticleContents
                  sections={article.sections}
                  referencesLabel={content.sidebar.meta.contentsReferencesLabel}
                />
              </div>

              {/* Publication Record */}
              <ArticleRecord article={article} copy={content.sidebar} />

              {/* Back to archive */}
              <Link
                href={content.sidebar.meta.backLink?.href || "/articles"}
                className="inline-flex w-full items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors shadow-2xs"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>{content.sidebar.meta.backLink?.label}</span>
              </Link>
            </aside>
          </div>

          {/* ── 4. Related Articles ── */}
          {content.related.visible && recommended.length > 0 && (
            <div className="mt-14 pt-10 border-t border-slate-200/80">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[10.5px] font-bold uppercase tracking-wider text-gb-accent">
                    {content.related.subtitle}
                  </p>
                  <h2 className="font-academic text-xl sm:text-2xl font-medium text-slate-950 mt-1">
                    {content.related.title} {article.topic}
                  </h2>
                </div>
                <Link
                  href={content.related.meta.link?.href || "/articles"}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-gb-accent hover:underline"
                >
                  <span>{content.related.meta.link?.label}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {recommended.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/articles/${item.slug}`}
                    className="bg-white border border-slate-200/90 p-5 flex items-start gap-4 shadow-2xs hover:border-slate-300 transition-all group"
                  >
                    <div className="relative aspect-3/4 w-20 shrink-0 overflow-hidden bg-slate-950 border border-slate-200">
                      <Image
                        src={item.image ?? "/covers/medical.png"}
                        alt={item.title}
                        fill
                        sizes="80px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block px-2 py-0.5 bg-blue-50 text-gb-accent text-[9px] font-bold uppercase tracking-wider border border-blue-100">
                        {item.type}
                      </span>
                      <h3 className="font-academic text-sm sm:text-base font-medium text-slate-950 mt-1.5 group-hover:text-gb-accent transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 font-medium truncate">
                        {item.authors.join(", ")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 5. Call for Manuscripts CTA ── */}
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
