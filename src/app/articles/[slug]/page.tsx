import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Globe2,
  Hash,
  Library,
  Quote,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { articles, findArticle } from "@/lib/data";
import { ArticleActions } from "@/components/article-actions";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
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
  return heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) notFound();

  const abstractSection = article.sections.find(
    (s) => s.heading.toLowerCase() === "abstract",
  );
  const bodySections = article.sections.filter(
    (s) => s.heading.toLowerCase() !== "abstract",
  );
  const references = getArticleReferences(article.slug);

  // related articles (same topic, excluding current)
  const related = articles
    .filter((a) => a.topic === article.topic && a.slug !== article.slug)
    .slice(0, 2);

  return (
    <PageShell>
      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[color:var(--color-gb-blue-deep)]">
        <div className="pointer-events-none absolute inset-0 hero-pattern opacity-[0.035]" />
        <div className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-[color:var(--color-gb-blue)] opacity-[0.14] blur-[90px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[260px] w-[260px] rounded-full bg-[color:var(--color-gb-gold)] opacity-[0.08] blur-[70px]" />

        <div className="container-x relative grid gap-10 py-14 md:py-18 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center lg:py-20">
          {/* Left: metadata + title */}
          <div className="max-w-3xl">
            {/* breadcrumb */}
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] font-bold text-white/50 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white/80 backdrop-blur-sm"
            >
              <ArrowLeft className="h-3 w-3" />
              Research archive
            </Link>

            {/* type + topic badges */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.07] px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-white/80">
                <FileText className="h-3 w-3 text-amber-300" />
                {article.type}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-emerald-300">
                <Globe2 className="h-3 w-3" />
                Open access
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white/45">
                {article.topic}
              </span>
            </div>

            {/* title */}
            <h1 className="mt-5 font-academic text-3xl font-bold leading-[1.14] tracking-[-0.03em] text-white md:text-[2.5rem] md:leading-[1.1]">
              {article.title}
            </h1>

            {/* authors */}
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              {article.authors.map((author, i) => (
                <span
                  key={author}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-white/65"
                >
                  {author}
                  {i < article.authors.length - 1 && (
                    <span className="text-white/25">·</span>
                  )}
                </span>
              ))}
            </div>

            {/* meta strip */}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2.5 border-t border-white/10 pt-5 text-[10px] font-semibold text-white/45">
              <span className="inline-flex items-center gap-2">
                <BookOpen className="h-3.5 w-3.5 text-amber-300" />
                {article.volume}, {article.issue}, pp. {article.pages}
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-3.5 w-3.5 text-sky-300" />
                Published {article.publishedAt}
              </span>
              <span className="inline-flex items-center gap-2">
                <Hash className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-mono">DOI: {article.doi}</span>
              </span>
            </div>

            {/* quick metrics */}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-bold text-white/35">
              <span className="inline-flex items-center gap-1.5">
                <Eye className="h-3 w-3 text-white/25" />
                {article.metrics.views.toLocaleString()} views
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Download className="h-3 w-3 text-white/25" />
                {article.metrics.downloads.toLocaleString()} downloads
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Quote className="h-3 w-3 text-white/25" />
                {article.metrics.citations} citations
              </span>
            </div>
          </div>

          {/* Right: cover card */}
          <div className="mx-auto w-full max-w-sm">
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.05] p-2.5 shadow-[0_32px_80px_rgba(0,0,0,0.32)] backdrop-blur-md">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-900">
                <Image
                  src={article.image || "/covers/medical.png"}
                  alt={article.title}
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 360px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060b2f]/95 via-[#060b2f]/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[9px] font-black uppercase tracking-widest text-amber-300">
                    {article.department}
                  </p>
                  <p className="mt-2 font-academic text-lg font-bold leading-snug text-white line-clamp-2">
                    {article.title}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between px-1.5 pb-1 pt-2.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white/35">
                <span>GB Journal of Research</span>
                <span>{article.publishedAt}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Article body ─────────────────────────── */}
      <div className="bg-[#f5f7fb] py-12 md:py-16">
        <div className="container-x grid gap-8 lg:grid-cols-[minmax(0,740px)_300px] lg:items-start lg:justify-center">

          {/* Main content */}
          <main>
            {/* Department + review banner */}
            <div className="grid gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color:var(--color-gb-blue-soft)]">
                  <Library className="h-4 w-4 text-[color:var(--color-gb-blue)]" />
                </div>
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-slate-400">Academic unit</p>
                  <p className="mt-0.5 text-[11px] font-extrabold text-slate-700">{article.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:border-l sm:border-slate-100 sm:pl-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color:var(--color-gb-blue-soft)]">
                  <ShieldCheck className="h-4 w-4 text-[color:var(--color-gb-blue)]" />
                </div>
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-slate-400">Editorial review</p>
                  <p className="mt-0.5 text-[11px] font-extrabold text-slate-700">Double-blind peer reviewed</p>
                </div>
              </div>
            </div>

            {/* Abstract */}
            {abstractSection && (
              <section
                id={sectionId(abstractSection.heading)}
                className="mt-6 scroll-mt-24 overflow-hidden rounded-2xl border border-[color:var(--color-gb-blue)]/15 bg-white shadow-xs"
              >
                <div className="border-b border-[color:var(--color-gb-blue)]/10 bg-[color:var(--color-gb-blue-soft)]/60 px-6 py-3.5">
                  <div className="flex items-center gap-2">
                    <Quote className="h-4 w-4 text-[color:var(--color-gb-blue)]" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.18em] text-[color:var(--color-gb-blue)]">
                      Abstract
                    </h2>
                  </div>
                </div>
                <div className="px-6 py-5">
                  <p className="text-sm leading-7 text-slate-600">{abstractSection.body}</p>
                </div>
              </section>
            )}

            {/* Body sections */}
            <div className="mt-6 space-y-4">
              {bodySections.map((section, idx) => (
                <section
                  key={section.heading}
                  id={sectionId(section.heading)}
                  className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs"
                >
                  <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[10px] font-black text-slate-300">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <h2 className="font-academic text-base font-bold text-[color:var(--color-gb-blue-deep)]">
                        {section.heading}
                      </h2>
                    </div>
                  </div>
                  <div className="px-6 py-5">
                    <p className="text-sm leading-7 text-slate-600">{section.body}</p>
                  </div>
                </section>
              ))}
            </div>

            {/* Keywords */}
            <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-3.5 w-3.5 text-slate-400" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.16em] text-[color:var(--color-gb-blue-deep)]">
                  Keywords
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="rounded-lg border border-[color:var(--color-gb-blue)]/15 bg-[color:var(--color-gb-blue-soft)] px-3 py-1.5 text-[10px] font-bold text-[color:var(--color-gb-blue)]"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* References */}
            <section
              id="references"
              className="mt-4 scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs"
            >
              <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-3.5">
                <h2 className="text-[10px] font-black uppercase tracking-[0.18em] text-[color:var(--color-gb-blue-deep)]">
                  References
                </h2>
              </div>
              <ol className="divide-y divide-slate-100 px-6">
                {references.map((ref, i) => (
                  <li key={ref} className="flex items-start gap-4 py-4 text-xs leading-6 text-slate-500">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-100 font-mono text-[9px] font-black text-slate-400">
                      {i + 1}
                    </span>
                    <span>{ref}</span>
                  </li>
                ))}
              </ol>
            </section>

            {/* Related articles */}
            {related.length > 0 && (
              <div className="mt-8">
                <p className="mb-4 text-[10px] font-black uppercase tracking-[0.18em] text-[color:var(--color-gb-blue)]">
                  Related in {article.topic}
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {related.map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/articles/${rel.slug}`}
                      className="group flex gap-3 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all hover:border-[color:var(--color-gb-blue)]/25 hover:shadow-md hover:-translate-y-0.5"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        <Image
                          src={rel.image || "/covers/medical.png"}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-black uppercase tracking-wider text-[color:var(--color-gb-blue)]">
                          {rel.type}
                        </p>
                        <h3 className="mt-1 line-clamp-2 text-[11px] font-bold leading-4.5 text-slate-800 group-hover:text-[color:var(--color-gb-blue)]">
                          {rel.title}
                        </h3>
                        <p className="mt-1.5 flex items-center gap-1 text-[9px] text-slate-400">
                          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                          Read article
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Sticky sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            {/* Access actions */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_20px_rgba(11,18,61,0.06)]">
              <div className="border-b border-slate-100 bg-[color:var(--color-gb-blue-deep)] px-5 py-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-300">Article Access</p>
              </div>
              <div className="p-5">
                <ArticleActions article={article} />

                {/* Impact metrics */}
                <div className="mt-5 grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 pt-4">
                  {[
                    { label: "Views",     value: article.metrics.views,     icon: Eye      },
                    { label: "Downloads", value: article.metrics.downloads, icon: Download },
                    { label: "Citations", value: article.metrics.citations, icon: Quote    },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="px-2 text-center">
                      <Icon className="mx-auto h-3 w-3 text-slate-300" />
                      <p className="mt-1.5 text-sm font-black text-[color:var(--color-gb-blue-deep)]">
                        {value.toLocaleString()}
                      </p>
                      <p className="mt-0.5 text-[7px] font-bold uppercase tracking-[0.08em] text-slate-400">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Table of contents */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[color:var(--color-gb-blue-deep)]">
                In this article
              </p>
              <nav aria-label="Article sections" className="mt-4 flex flex-col">
                {article.sections.map((section, i) => (
                  <a
                    key={section.heading}
                    href={`#${sectionId(section.heading)}`}
                    className="group flex items-center gap-3 border-l-2 border-transparent py-2 pl-3 text-[10px] font-bold text-slate-500 transition-all hover:border-[color:var(--color-gb-blue)] hover:text-[color:var(--color-gb-blue)] hover:pl-4"
                  >
                    <span className="font-mono text-[8px] text-slate-300">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {section.heading}
                  </a>
                ))}
                <a
                  href="#references"
                  className="group flex items-center gap-3 border-l-2 border-transparent py-2 pl-3 text-[10px] font-bold text-slate-500 transition-all hover:border-[color:var(--color-gb-blue)] hover:text-[color:var(--color-gb-blue)] hover:pl-4"
                >
                  <span className="font-mono text-[8px] text-slate-300">
                    {String(article.sections.length + 1).padStart(2, "0")}
                  </span>
                  References
                </a>
              </nav>
            </div>

            {/* Article record */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[color:var(--color-gb-blue-deep)]">
                Article record
              </p>
              <dl className="mt-4 divide-y divide-slate-100">
                {[
                  ["DOI",       article.doi          ],
                  ["Pages",     article.pages        ],
                  ["Published", article.publishedAt  ],
                  ["Volume",    article.volume       ],
                  ["Issue",     article.issue        ],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4 py-2.5 text-[10px]">
                    <dt className="font-bold uppercase tracking-[0.08em] text-slate-400">{label}</dt>
                    <dd className="max-w-[160px] text-right font-semibold text-slate-700">{value}</dd>
                  </div>
                ))}
              </dl>

              {/* version of record */}
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200/80 px-3 py-2 text-[10px] font-bold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                Version of record
              </div>
            </div>

            {/* Back to archive */}
            <Link
              href="/articles"
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white p-4 text-[11px] font-bold text-slate-500 shadow-xs transition-all hover:border-[color:var(--color-gb-blue)]/25 hover:text-[color:var(--color-gb-blue)] hover:shadow-md"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to research archive
            </Link>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}
