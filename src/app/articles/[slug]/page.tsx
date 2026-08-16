import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Globe2,
  Hash,
  Library,
  Quote,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ArticleActions } from "@/components/articles/article-actions";
import { ArticleContents } from "@/components/articles/article-contents";
import { articles, findArticle } from "@/lib/data";
import type { Article } from "@/lib/data";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

const journalTitle = "Gono Bishwabidyalay Journal";

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

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = findArticle(slug);

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
      "Rahman, F., Hossain, M. J., & Karim, N. A. (2026). Community healthcare access patterns around Savar: A mixed-method university catchment study. GB Journal, 4(2), 11–28. doi:10.5555/gbj.2026.001",
      "Bangladesh University Research Practice Notes. (2024). Decentralized healthcare systems in rural zones. Savar Public Health Review, 12(1), 104–118.",
      "World Health Organization. (2023). Primary healthcare access and catchment analytics. WHO Technical Report Series, 44(2), 12–29.",
    ];
  }

  if (slug === "pharmacy-practice-antimicrobial-stewardship") {
    return [
      "Islam, S., & Sultana, T. (2026). Pharmacy practice readiness for antimicrobial stewardship in teaching settings. GB Journal, 4(2), 29–44. doi:10.5555/gbj.2026.002",
      "Antimicrobial Stewardship Working Group. (2025). Teaching pharmacy models and curriculum integration. Clinical Pharmacy & Practice, 19(4), 210–224.",
      "Bangladesh Drug Dispensing Governance Guidelines. (2023). Professional practice standards for retail and clinical pharmacies. Ministry of Health & Family Welfare, 88–101.",
    ];
  }

  if (slug === "climate-resilient-agriculture-manifolds") {
    return [
      "Alam, M., & Jahan, S. (2026). Climate-resilient smallholder agriculture: Field observations from central Bangladesh. GB Journal, 4(2), 45–59. doi:10.5555/gbj.2026.003",
      "Central Bangladesh Rainfall & Crop Adaptation Reports. (2025). Climate resilience in deltaic floodplains. Agricultural Adaptation & Development, 31(2), 77–93.",
      "Khan, A. R. (2024). Smallholder farming practices under changing monsoon patterns. South Asian Journal of Agriculture, 14(3), 112–127.",
    ];
  }

  return [
    "Gono Bishwabidyalay Journal demo citation set. 2026.",
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

function ArticleRecord({ article }: { article: Article }) {
  const recordItems = [
    ["DOI", article.doi],
    ["Pages", article.pages],
    ["Published", article.publishedAt],
    ["Volume", article.volume],
    ["Issue", article.issue],
  ];

  return (
    <section className="overflow-hidden rounded-[22px] border border-slate-200/90 bg-white shadow-[0_12px_34px_rgba(11,18,61,0.06)]">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[color:var(--color-gb-blue-deep)]">
          Publication record
        </h2>
      </div>

      <div className="p-5">
        <dl className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 pb-5">
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
            <div key={label} className="px-2 text-center">
              <dt className="flex items-center justify-center gap-1.5 text-[9px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                <Icon className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                <span>{label}</span>
              </dt>
              <dd className="mt-2 font-academic text-lg font-bold text-[color:var(--color-gb-blue-deep)]">
                {value.toLocaleString()}
              </dd>
            </div>
          ))}
        </dl>

        <dl className="mt-4 divide-y divide-slate-100">
          {recordItems.map(([label, value]) => (
            <div
              key={label}
              className="flex items-start justify-between gap-4 py-2.5 text-xs"
            >
              <dt className="font-bold uppercase tracking-[0.08em] text-slate-400">
                {label}
              </dt>
              <dd className="max-w-[180px] text-right font-semibold text-slate-700">
                {label === "DOI" ? (
                  <a
                    href={`https://doi.org/${value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-1 break-all text-[color:var(--color-gb-blue)] hover:underline"
                  >
                    {value}
                    <ExternalLink
                      className="mt-0.5 h-3 w-3 shrink-0"
                      aria-hidden="true"
                    />
                  </a>
                ) : (
                  value
                )}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-[color:var(--color-gb-blue)]/15 bg-[color:var(--color-gb-blue-soft)] px-3.5 py-2.5 text-xs font-bold text-[color:var(--color-gb-blue)]">
          <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
          Published journal record
        </div>
      </div>
    </section>
  );
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = findArticle(slug);

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
  const topicRelated = articles
    .filter(
      (candidate) =>
        candidate.topic === article.topic && candidate.slug !== article.slug,
    )
    .slice(0, 2);
  const recommended =
    topicRelated.length > 0
      ? topicRelated
      : articles
        .filter((candidate) => candidate.slug !== article.slug)
        .slice(0, 2);
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      {/* —— HERO HEADER ——————————————————————————————— */}
      <section
        className="relative overflow-hidden bg-[color:var(--color-gb-blue-deep)] text-white"
        aria-labelledby="article-title"
      >
        {/* Ambient glows */}
        <div className="pointer-events-none absolute inset-0 hero-pattern opacity-[0.03]" aria-hidden="true" />
        <div className="pointer-events-none absolute -top-36 -right-36 h-[560px] w-[560px] rounded-full bg-[color:var(--color-gb-blue)] opacity-[0.12] blur-[100px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-[300px] w-[380px] rounded-full bg-amber-500 opacity-[0.06] blur-[80px]" aria-hidden="true" />

        <div className="container-x relative grid items-end gap-10 py-12 lg:grid-cols-[1fr_280px] lg:py-16 xl:gap-16">
          {/* Left: article meta */}
          <header>
            {/* Type / access / topic pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-white/70">
                <FileText className="h-2.5 w-2.5" aria-hidden="true" />
                {article.type}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-white/70">
                <Globe2 className="h-2.5 w-2.5" aria-hidden="true" />
                Open Access
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-white/70">
                <Tag className="h-2.5 w-2.5" aria-hidden="true" />
                {article.topic}
              </span>
            </div>

            {/* Title */}
            <h1
              id="article-title"
              className="mt-5 max-w-3xl font-academic text-2xl font-extrabold leading-[1.28] tracking-[-0.025em] text-white sm:text-3xl md:text-[2rem]"
            >
              {article.title}
            </h1>

            {/* Authors */}
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-300">Authors</span>
              <span className="h-3.5 w-px bg-white/20" aria-hidden="true" />
              <span className="text-xs font-semibold text-white/85">{article.authors.join(" · ")}</span>
            </div>

            {/* Publication meta row */}
            <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-3 border-y border-white/10 py-5">
              {[
                { Icon: BookOpen, label: "Publication", val: `${article.volume}, ${article.issue}, pp. ${article.pages}` },
                { Icon: CalendarDays, label: "Published", val: article.publishedAt },
              ].map(({ Icon, label, val }) => (
                <div key={label}>
                  <dt className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white/45">
                    <Icon className="h-3 w-3 text-amber-300" aria-hidden="true" />
                    {label}
                  </dt>
                  <dd className="mt-1 text-xs font-bold text-white/90">{val}</dd>
                </div>
              ))}
              <div>
                <dt className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white/45">
                  <Hash className="h-3 w-3 text-amber-300" aria-hidden="true" />
                  DOI
                </dt>
                <dd className="mt-1">
                  <a
                    href={`https://doi.org/${article.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-amber-300 hover:text-amber-200 hover:underline"
                  >
                    {article.doi}
                    <ExternalLink className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
                  </a>
                </dd>
              </div>
            </dl>

            {/* CTA buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <ArticleActions article={article} variant="hero" />
            </div>
          </header>

          {/* Right: cover image */}
          <figure className="mx-auto w-full max-w-sm lg:mx-0 lg:max-w-[280px] lg:justify-self-end">
            <div className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/20 bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-white/30 hover:shadow-[0_28px_60px_rgba(0,0,0,0.5)] lg:aspect-[4/5]">
              <Image
                src={article.image ?? "/covers/medical.png"}
                alt={`${article.topic} article cover`}
                fill
                priority
                sizes="(max-width: 1023px) 384px, 280px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-gb-blue-deep)] via-transparent to-transparent" aria-hidden="true" />
              <figcaption className="absolute inset-x-0 bottom-0 p-4 text-white">
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-amber-300">{article.department}</p>
                <p className="mt-1.5 text-xs font-semibold text-white/70">{article.volume} · {article.issue}</p>
              </figcaption>
            </div>
          </figure>
        </div>
      </section>

      {/* —— BODY CONTENT —————————————————————————————— */}
      <div className="bg-[#f5f7fc] pb-20">
        <div className="container-x">

          {/* Floating metrics bar */}
          <div className="relative z-10 -translate-y-5">
            <div className="grid grid-cols-2 items-center overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-[0_16px_40px_rgba(11,18,61,0.1)] sm:grid-cols-4">
              {([
                { label: "Views", val: article.metrics.views.toLocaleString(), Icon: Eye },
                { label: "Downloads", val: article.metrics.downloads.toLocaleString(), Icon: Download },
                { label: "Citations", val: article.metrics.citations.toLocaleString(), Icon: Quote },
                { label: "Pages", val: article.pages, Icon: FileText },
              ] as const).map(({ label, val, Icon }, index) => (
                <div key={label} className="relative flex items-center justify-center gap-3.5 p-3.5 md:p-4">
                  {index % 2 !== 0 && (
                    <span
                      className="absolute left-0 top-1/2 h-8 w-px -translate-y-1/2 bg-slate-200/70 sm:hidden"
                      aria-hidden="true"
                    />
                  )}
                  {index > 0 && (
                    <span
                      className="absolute left-0 top-1/2 hidden h-8 w-px -translate-y-1/2 bg-slate-200/70 sm:block"
                      aria-hidden="true"
                    />
                  )}
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">{label}</p>
                    <p className="mt-0.5 font-academic text-base font-extrabold text-[color:var(--color-gb-blue-deep)]">{val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile TOC */}
          <details className="mt-4 rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs lg:hidden">
            <summary className="cursor-pointer text-[11px] font-black uppercase tracking-[0.14em] text-[color:var(--color-gb-blue-deep)]">
              On This Page
            </summary>
            <ArticleContents sections={article.sections} />
          </details>

          {/* Main two-column grid */}
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_300px]">

            {/* Article body */}
            <div>
              <article className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_12px_40px_rgba(11,18,61,0.06)]">

                {/* Editorial & Peer Review Status Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-[color:var(--color-gb-blue-deep)] px-6 py-4 text-white md:px-10">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                    <span>Double-Blind Peer Reviewed</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium text-white/80">
                    <span className="flex items-center gap-1.5">
                      <Library className="h-3.5 w-3.5 shrink-0 text-amber-300" aria-hidden="true" />
                      <span>{article.department}</span>
                    </span>
                    <span className="h-3.5 w-px bg-white/20" aria-hidden="true" />
                    <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                      <Globe2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>Open Access</span>
                    </span>
                  </div>
                </div>

                {/* Abstract section */}
                {abstractSection && (
                  <section
                    id={sectionId(abstractSection.heading)}
                    className="scroll-mt-28 border-b border-slate-200/80 bg-gradient-to-br from-amber-500/[0.04] via-[color:var(--color-gb-blue-soft)]/30 to-transparent p-6 md:p-10"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[color:var(--color-gb-blue-deep)] text-amber-300 shadow-xs">
                        <Quote className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div>
                        <h2 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[color:var(--color-gb-blue-deep)]">
                          Abstract
                        </h2>
                        <p className="text-[10px] font-semibold text-slate-400">Executive Research Summary</p>
                      </div>
                    </div>
                    <p className="mt-5 max-w-[72ch] font-academic text-base leading-[1.95] text-slate-800 md:text-[1.05rem]">
                      {abstractSection.body}
                    </p>
                  </section>
                )}

                {/* Body sections */}
                <div className="px-6 md:px-10">
                  {bodySections.map((section, index) => (
                    <section
                      key={section.heading}
                      id={sectionId(section.heading)}
                      className="scroll-mt-28 border-b border-slate-200/80 py-9 md:py-11 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-400/30 bg-amber-400/15 font-mono text-xs font-black text-[color:var(--color-gb-gold-dark)]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h2 className="font-academic text-xl font-extrabold tracking-tight text-[color:var(--color-gb-blue-deep)] md:text-2xl">
                          {section.heading}
                        </h2>
                      </div>
                      <p className="mt-5 max-w-[72ch] text-[15px] font-normal leading-[1.95] text-slate-700 md:text-base">
                        {section.body}
                      </p>
                    </section>
                  ))}

                  {/* Keywords */}
                  <section className="border-t border-slate-200/80 py-8">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
                        <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <h2 className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[color:var(--color-gb-blue-deep)]">
                        Index Keywords
                      </h2>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2.5">
                      {article.keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-2xs transition-all hover:border-[color:var(--color-gb-blue)]/30 hover:bg-[color:var(--color-gb-blue-soft)] hover:text-[color:var(--color-gb-blue)]"
                        >
                          #{keyword}
                        </span>
                      ))}
                    </div>
                  </section>

                  {/* References */}
                  <section id="references" className="scroll-mt-28 border-t border-slate-200/80 py-9 md:py-11">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
                        <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <h2 className="font-academic text-xl font-extrabold tracking-tight text-[color:var(--color-gb-blue-deep)]">
                        References & Bibliography
                      </h2>
                    </div>
                    <ol className="mt-6 space-y-3">
                      {references.map((reference, index) => (
                        <li
                          key={reference}
                          className="group flex gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:border-slate-200 hover:bg-slate-50"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-400/15 font-mono text-[10px] font-extrabold text-[color:var(--color-gb-gold-dark)]">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="text-xs font-medium leading-relaxed text-slate-600 group-hover:text-slate-900">
                            {reference}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </section>
                </div>
              </article>

              {/* Mobile sidebar record */}
              <div className="mt-6 lg:hidden">
                <ArticleRecord article={article} />
              </div>
            </div>

            {/* Sticky sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-4">

                {/* Quick-action card */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_10px_30px_rgba(11,18,61,0.06)]">
                  <div className="border-b border-slate-100 bg-[color:var(--color-gb-blue-deep)] px-5 py-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-300">Article Actions</p>
                    <p className="mt-0.5 text-xs font-semibold text-white/60">{article.volume} · {article.issue}</p>
                  </div>
                  <div className="p-4">
                    <ArticleActions article={article} />
                  </div>
                </div>

                {/* Table of contents */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_10px_30px_rgba(11,18,61,0.06)]">
                  <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
                    <BookOpen className="h-4 w-4 text-[color:var(--color-gb-blue)]" aria-hidden="true" />
                    <p className="text-[11px] font-black uppercase tracking-[0.15em] text-[color:var(--color-gb-blue-deep)]">
                      On This Page
                    </p>
                  </div>
                  <ArticleContents sections={article.sections} />
                </div>

                {/* Publication record */}
                <ArticleRecord article={article} />

                {/* Back link */}
                <Link
                  href="/articles"
                  className="flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-500 transition-all hover:border-[color:var(--color-gb-blue)]/20 hover:bg-[color:var(--color-gb-blue-soft)] hover:text-[color:var(--color-gb-blue)] focus-ring"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  Back to research archive
                </Link>
              </div>
            </aside>
          </div>

          {/* Related articles section */}
          {recommended.length > 0 && (
            <section className="mt-12" aria-labelledby="recommended-heading">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[color:var(--color-gb-gold-dark)]">
                    Continue Reading
                  </p>
                  <h2
                    id="recommended-heading"
                    className="mt-1.5 font-academic text-xl font-extrabold tracking-[-0.02em] text-[color:var(--color-gb-blue-deep)]"
                  >
                    {topicRelated.length > 0
                      ? `Related research in ${article.topic}`
                      : "More from the journal"}
                  </h2>
                </div>
                <Link
                  href="/articles"
                  className="hidden shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-extrabold text-[color:var(--color-gb-blue-deep)] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-gb-blue)]/30 hover:shadow-md sm:inline-flex"
                >
                  Browse all
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {recommended.map((candidate) => (
                  <Link
                    key={candidate.slug}
                    href={`/articles/${candidate.slug}`}
                    className="group flex gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_8px_24px_rgba(11,18,61,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:var(--color-gb-blue)]/20 hover:shadow-[0_14px_36px_rgba(11,18,61,0.1)]"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      <Image
                        src={candidate.image ?? "/covers/medical.png"}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[color:var(--color-gb-gold-dark)]">
                        {candidate.type}
                      </p>
                      <h3 className="mt-1.5 line-clamp-2 text-sm font-bold leading-5 text-[color:var(--color-gb-blue-deep)] transition-colors group-hover:text-[color:var(--color-gb-blue)]">
                        {candidate.title}
                      </h3>
                      <p className="mt-2 text-[10px] font-semibold text-slate-400">
                        {candidate.authors[0]}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </PageShell>
  );
}
