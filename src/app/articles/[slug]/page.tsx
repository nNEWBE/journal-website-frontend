import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  FileText,
  Unlock,
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
      "Rahman, F., Hossain, M. J., & Karim, N. A. (2026). Community healthcare access patterns around Savar: A mixed-method university catchment study. GB Journal, 4(2), 11-28. doi:10.5555/gbj.2026.001",
      "Bangladesh University Research Practice Notes. (2024). Decentralized healthcare systems in rural zones. Savar Public Health Review, 12(1), 104-118.",
      "World Health Organization. (2023). Primary healthcare access and catchment analytics. WHO Technical Report Series, 44(2), 12-29."
    ];
  }
  if (slug === "pharmacy-practice-antimicrobial-stewardship") {
    return [
      "Islam, S., & Sultana, T. (2026). Pharmacy practice readiness for antimicrobial stewardship in teaching settings. GB Journal, 4(2), 29-44. doi:10.5555/gbj.2026.002",
      "Antimicrobial Stewardship Working Group. (2025). Teaching pharmacy models and curriculum integration. Clinical Pharmacy & Practice, 19(4), 210-224.",
      "Bangladesh Drug Dispensing Governance Guidelines. (2023). Professional practice standards for retail and clinical pharmacies. Ministry of Health & Family Welfare, 88-101."
    ];
  }
  if (slug === "climate-resilient-agriculture-manifolds") {
    return [
      "Alam, M., & Jahan, S. (2026). Climate-resilient smallholder agriculture: Field observations from central Bangladesh. GB Journal, 4(2), 45-59. doi:10.5555/gbj.2026.003",
      "Central Bangladesh Rainfall & Crop Adaptation Reports. (2025). Climate resilience in deltaic floodplains. Agricultural Adaptation & Development, 31(2), 77-93.",
      "Khan, A. R. (2024). Smallholder farming practices under changing monsoon patterns. South Asian Journal of Agriculture, 14(3), 112-127."
    ];
  }
  return [
    "Gono Bishwabidyalay Journal demo citation set. 2026.",
    "Bangladesh University Research Practice Notes. 2024.",
    "Community systems and higher education research methods. 2025."
  ];
};

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) notFound();

  const abstractSection = article.sections.find(
    (s) => s.heading.toLowerCase() === "abstract"
  );
  const bodySections = article.sections.filter(
    (s) => s.heading.toLowerCase() !== "abstract"
  );

  return (
    <PageShell>
      {/* Article Masthead */}
      <div className="page-header">
        <div className="container-x page-header-inner py-10 md:py-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex-1 min-w-0">
            <Link
              href="/articles"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-[11px] font-bold text-white/70 hover:bg-white/15 hover:text-white transition-all mb-5"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to articles
            </Link>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="page-badge">{article.type}</span>
              <span className="page-badge">
                <Unlock className="h-2.5 w-2.5 text-emerald-400" />
                Open Access
              </span>
            </div>
            <h1 className="page-title max-w-3xl">{article.title}</h1>
            <p className="mt-4 text-base font-semibold text-white/60">
              {article.authors.join(", ")}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-semibold text-white/40">
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-[color:var(--color-gb-gold)]" />
                {article.volume}, {article.issue}, pages {article.pages}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-[color:var(--color-gb-gold)]" />
                {article.publishedAt}
              </span>
              <span className="font-mono text-white/30">DOI: {article.doi}</span>
            </div>
          </div>

          {article.image && (
            <div className="shrink-0 aspect-[3/4] w-[160px] md:w-[180px] lg:w-[220px] mx-auto md:mx-0 rounded-xl overflow-hidden bg-slate-900 border border-white/10 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.4)] relative">
              <img
                src={article.image}
                alt={article.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/35 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-black/[0.04] pointer-events-none" />
            </div>
          )}
        </div>
        <div className="page-header-accent" />
      </div>

      <article className="container-x py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Main article body */}
          <div>
            {/* Metadata bar */}
            <div className="rounded-xl border border-[color:var(--border)] bg-white p-4 text-sm font-semibold text-[color:var(--ink-muted)] grid gap-3 sm:grid-cols-2 mb-8">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[color:var(--color-gb-blue)]" />
                {article.department}
              </span>
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[color:var(--color-gb-blue)]" />
                {article.topic}
              </span>
            </div>

            {/* Highlighted Abstract Box */}
            {abstractSection && (
              <div className="mb-8 rounded-xl bg-slate-50 border-l-4 border-[color:var(--color-gb-blue)] p-6 md:p-8 shadow-sm">
                <h2 className="text-xs font-black uppercase tracking-widest text-[color:var(--color-gb-blue-dark)] mb-3">
                  Abstract
                </h2>
                <p className="text-[13px] leading-relaxed text-slate-700 font-medium italic">
                  {abstractSection.body}
                </p>
              </div>
            )}

            {/* Article prose */}
            <div className="article-prose rounded-xl bg-white p-6 md:p-8 shadow-sm border border-[color:var(--border)]">
              {bodySections.map((section) => (
                <section key={section.heading} id={section.heading.toLowerCase()} className="scroll-mt-24">
                  <h2>{section.heading}</h2>
                  <p>{section.body}</p>
                </section>
              ))}
              
              <h2 id="references" className="scroll-mt-24">References</h2>
              <ol className="mt-4 space-y-3 pl-4 text-xs font-sans text-slate-600 list-decimal leading-relaxed">
                {getArticleReferences(article.slug).map((ref, idx) => (
                  <li key={idx} className="pl-1">
                    {ref}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="h-fit lg:sticky lg:top-24 space-y-5">
            {/* Article tools */}
            <div className="surface-elevated p-5">
              <h2 className="text-xs font-black text-[color:var(--color-gb-blue-dark)] uppercase tracking-wider">
                Article Tools
              </h2>
              <ArticleActions article={article} />

              {/* Metrics with divider layout */}
              <div className="mt-5 grid grid-cols-3 divide-x divide-slate-100 border-t border-b border-slate-100 py-4">
                {[
                  ["Views", article.metrics.views],
                  ["Downloads", article.metrics.downloads],
                  ["Cites", article.metrics.citations],
                ].map(([label, value]) => (
                  <div key={label} className="text-center px-1">
                    <p className="text-[15px] font-extrabold text-[color:var(--color-gb-blue-dark)] font-academic">
                      {value}
                    </p>
                    <p className="text-[9px] font-bold text-[color:var(--ink-muted)] uppercase tracking-wider mt-0.5">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Table of Contents */}
            <div className="surface-elevated p-5">
              <h2 className="text-xs font-black text-[color:var(--color-gb-blue-dark)] uppercase tracking-wider mb-3">
                Table of Contents
              </h2>
              <nav className="flex flex-col gap-2 border-l border-slate-100 pl-3">
                {article.sections.map((section) => (
                  <a
                    key={section.heading}
                    href={`#${section.heading.toLowerCase()}`}
                    className="block text-[11px] font-bold text-slate-500 hover:text-[color:var(--color-gb-blue)] transition-colors"
                  >
                    {section.heading}
                  </a>
                ))}
                <a
                  href="#references"
                  className="block text-[11px] font-bold text-slate-500 hover:text-[color:var(--color-gb-blue)] transition-colors"
                >
                  References
                </a>
              </nav>
            </div>

            {/* Keywords */}
            <div className="surface-elevated p-5">
              <h2 className="text-xs font-black text-[color:var(--color-gb-blue-dark)] uppercase tracking-wider">
                Keywords
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {article.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="inline-flex items-center rounded bg-slate-100/70 hover:bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600 transition-colors"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </article>
    </PageShell>
  );
}
