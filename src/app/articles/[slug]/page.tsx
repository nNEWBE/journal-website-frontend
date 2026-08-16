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
import { articles, findArticle } from "@/lib/data";
import type { Article } from "@/lib/data";

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
    title: `${article.title} — ${journalTitle}`,
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

function ArticleRecord({ article }: { article: Article }) {
  const recordItems = [
    ["DOI", article.doi],
    ["Pages", article.pages],
    ["Published", article.publishedAt],
    ["Volume", article.volume],
    ["Issue", article.issue],
    ["Licensing", "CC BY 4.0 Open Access"],
    ["Review", "Double-Blind Peer Reviewed"],
  ];

  return (
    <section className="bg-white border border-slate-200/90 shadow-2xs p-5">
      <div className="border-b border-slate-100 pb-3 mb-4">
        <h2 className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
          PUBLICATION RECORD
        </h2>
      </div>

      <div>
        <dl className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 pb-4">
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
                    className="inline-flex items-center gap-1 font-mono text-[#1e40af] hover:underline"
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

        <div className="mt-4 flex items-center gap-2 bg-blue-50 border border-blue-100 p-2.5 text-xs font-semibold text-[#1e40af]">
          <ShieldCheck className="h-4 w-4 shrink-0 text-[#1e40af]" />
          <span>CrossMark Verified Record</span>
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

      {/* ── 1. Article Hero Header ── */}
      <section
        className="relative overflow-hidden bg-[#060e22] text-white border-b border-slate-800 py-12 sm:py-16 lg:py-20"
        aria-labelledby="article-title"
      >
        {/* Top gold-to-blue accent line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-400 via-blue-500 to-transparent" />

        {/* Ambient glows */}
        <div className="pointer-events-none absolute -top-36 -right-36 h-[560px] w-[560px] rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-[300px] w-[380px] rounded-full bg-amber-500/10 blur-[80px]" />

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
                Open Access (CC BY 4.0)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 text-amber-300 text-[10px] font-bold uppercase tracking-[0.15em] border border-white/10">
                <Tag className="h-3 w-3" />
                {article.topic}
              </span>
            </div>

            {/* Title */}
            <h1
              id="article-title"
              className="mt-5 font-academic text-2xl sm:text-3xl lg:text-[2.65rem] font-medium leading-[1.18] tracking-[-0.025em] text-white"
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
              <ArticleActions article={article} variant="hero" />
            </div>
          </div>

          {/* Right Column: Article Cover */}
          <div className="relative aspect-[3/4] w-full max-w-[260px] mx-auto lg:mx-0 overflow-hidden bg-slate-950 border border-white/20 shadow-2xl">
            <Image
              src={article.image ?? "/covers/medical.png"}
              alt={`${article.topic} article cover`}
              fill
              priority
              sizes="260px"
              className="object-cover"
            />
            {/* 3D Spine overlay */}
            <span className="pointer-events-none absolute inset-y-0 left-0 z-20 w-3 bg-gradient-to-r from-black/80 via-black/30 to-transparent border-r border-white/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060e22] via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 z-20 p-2.5 bg-slate-950/85 border border-white/15 backdrop-blur-md">
              <p className="text-[9px] font-bold uppercase tracking-wider text-amber-300">{article.department}</p>
              <p className="text-xs font-bold text-white mt-0.5">{article.volume} · {article.issue}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Floating Metrics Bar ── */}
      <div className="bg-[#fbfcff] pb-20 pt-8 border-b border-slate-200/80">
        <div className="container-x">
          <div className="bg-white border border-slate-200/90 shadow-2xs p-3 sm:p-4 mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100 text-center">
              <div className="p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Views</p>
                <p className="font-mono text-xl font-bold text-slate-900 mt-1">{article.metrics.views.toLocaleString()}</p>
              </div>
              <div className="p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">PDF Downloads</p>
                <p className="font-mono text-xl font-bold text-slate-900 mt-1">{article.metrics.downloads.toLocaleString()}</p>
              </div>
              <div className="p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Citations</p>
                <p className="font-mono text-xl font-bold text-[#1e40af] mt-1">{article.metrics.citations.toLocaleString()}</p>
              </div>
              <div className="p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Page Extent</p>
                <p className="font-mono text-xl font-bold text-slate-900 mt-1">{article.pages}</p>
              </div>
            </div>
          </div>

          {/* ── 3. Main Reading Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
            {/* Article Content Column */}
            <div>
              <article className="bg-white border border-slate-200/90 shadow-2xs">
                {/* Status Bar */}
                <div className="bg-[#0b1b3d] text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Double-Blind Peer Reviewed</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300 font-medium">
                    <span>{article.department}</span>
                    <span>·</span>
                    <span className="text-amber-300">Open Access (CC BY 4.0)</span>
                  </div>
                </div>

                {/* Abstract Section */}
                {abstractSection && (
                  <section
                    id={sectionId(abstractSection.heading)}
                    className="p-6 sm:p-10 border-b border-slate-200/80 bg-slate-50/60"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="flex h-8 w-8 items-center justify-center bg-[#0b1b3d] text-amber-300">
                        <Quote className="h-4 w-4" />
                      </span>
                      <div>
                        <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1e40af]">
                          EXECUTIVE ABSTRACT
                        </h2>
                        <p className="text-[10.5px] text-slate-400">Scholarly Summary</p>
                      </div>
                    </div>
                    <p className="font-academic text-base sm:text-lg leading-relaxed text-slate-800">
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
                        <span className="flex h-7 w-7 items-center justify-center bg-blue-50 border border-blue-200 font-mono text-xs font-bold text-[#1e40af]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h2 className="font-academic text-xl sm:text-2xl font-medium text-slate-950">
                          {section.heading}
                        </h2>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700 max-w-prose">
                        {section.body}
                      </p>
                    </section>
                  ))}

                  {/* Keywords */}
                  <section className="py-8">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#1e40af] mb-3">
                      INDEX KEYWORDS
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
                  <section className="py-8">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#1e40af] mb-4">
                      ETHICAL DECLARATIONS & GOVERNANCE
                    </h3>
                    <div className="bg-slate-50 border border-slate-200/80 p-4 space-y-2.5 text-xs text-slate-600">
                      <p>
                        <strong className="text-slate-900 font-semibold">Ethical Approval:</strong> Conducted under the ethical oversight and approval protocols of Gono Bishwabidyalay Institutional Review Board.
                      </p>
                      <p>
                        <strong className="text-slate-900 font-semibold">Funding Declaration:</strong> This research received institutional faculty grant support. No external commercial sponsorship influenced study outcomes.
                      </p>
                      <p>
                        <strong className="text-slate-900 font-semibold">Conflict of Interest:</strong> The authors declare no competing financial or personal interests related to this work.
                      </p>
                    </div>
                  </section>

                  {/* References */}
                  <section id="references" className="py-8 scroll-mt-24">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#1e40af] mb-4">
                      REFERENCES & BIBLIOGRAPHY
                    </h3>
                    <ol className="space-y-3">
                      {references.map((ref, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 bg-slate-50/70 border border-slate-200/70 p-3.5 text-xs text-slate-700 leading-relaxed"
                        >
                          <span className="font-mono font-bold text-[#1e40af] shrink-0">
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
                <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#1e40af] border-b border-slate-100 pb-3 mb-4">
                  ARTICLE ACTIONS
                </p>
                <ArticleActions article={article} />
              </div>

              {/* Table of Contents */}
              <div className="bg-white border border-slate-200/90 p-5 shadow-2xs">
                <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#1e40af] border-b border-slate-100 pb-3 mb-3">
                  ON THIS PAGE
                </p>
                <ArticleContents sections={article.sections} />
              </div>

              {/* Publication Record */}
              <ArticleRecord article={article} />

              {/* Back to archive */}
              <Link
                href="/articles"
                className="inline-flex w-full items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors shadow-2xs"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Research Archive</span>
              </Link>
            </aside>
          </div>

          {/* ── 4. Related Articles ── */}
          {recommended.length > 0 && (
            <div className="mt-14 pt-10 border-t border-slate-200/80">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#1e40af]">
                    FURTHER SCHOLARSHIP
                  </p>
                  <h2 className="font-academic text-xl sm:text-2xl font-medium text-slate-950 mt-1">
                    Related Articles in {article.topic}
                  </h2>
                </div>
                <Link
                  href="/articles"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#1e40af] hover:underline"
                >
                  <span>Browse All Articles</span>
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
                    <div className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden bg-slate-950 border border-slate-200">
                      <Image
                        src={item.image ?? "/covers/medical.png"}
                        alt={item.title}
                        fill
                        sizes="80px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block px-2 py-0.5 bg-blue-50 text-[#1e40af] text-[9px] font-bold uppercase tracking-wider border border-blue-100">
                        {item.type}
                      </span>
                      <h3 className="font-academic text-sm sm:text-base font-medium text-slate-950 mt-1.5 group-hover:text-[#1e40af] transition-colors leading-snug line-clamp-2">
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
                  Contribute Your Research to GB Journal
                </h2>

                <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  We invite original research articles, review papers, and short communications. Benefit from an impartial double-blind review process and unrestricted global open access.
                </p>

                {/* Feature Pill Tags */}
                <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold">
                    <Clock className="h-3.5 w-3.5 text-amber-300" />
                    14-Day Initial Review
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold">
                    <Globe2 className="h-3.5 w-3.5 text-blue-400" />
                    CC BY 4.0 Open Access
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    Double-Blind Verification
                  </span>
                </div>

                {/* Primary Actions */}
                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <Link
                    href="/dashboard/submissions/new"
                    className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#060e22] px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                  >
                    <span>Submit Manuscript</span>
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
                      Author Desk
                    </span>
                  </div>

                  <h3 className="mt-3 font-academic text-xl font-medium text-white">
                    Manuscript Inquiries & Support
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    Have questions regarding scope, track assignment, or submission guidelines? Reach out directly.
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
                    <span>Contact Editorial Secretariat</span>
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
