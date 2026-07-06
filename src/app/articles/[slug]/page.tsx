import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Download,
  ExternalLink,
  FileText,
  Quote,
  Share2,
  Unlock,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { articles, findArticle } from "@/lib/data";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) notFound();

  return (
    <PageShell>
      {/* Article Masthead */}
      <div className="page-header">
        <div className="container-x page-header-inner py-10 md:py-14">
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

            {/* Article prose */}
            <div className="article-prose rounded-xl bg-white p-6 md:p-8 shadow-sm border border-[color:var(--border)]">
              {article.sections.map((section) => (
                <section key={section.heading} id={section.heading.toLowerCase()}>
                  <h2>{section.heading}</h2>
                  <p>{section.body}</p>
                </section>
              ))}
              <h2>References</h2>
              <p>
                1. Gono Bishwabidyalay Journal demo citation set. 2. Bangladesh
                University Research Practice Notes. 3. Community systems and
                higher education research methods.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="h-fit lg:sticky lg:top-28 space-y-4">
            {/* Article tools */}
            <div className="surface-elevated p-5">
              <h2 className="text-sm font-black text-[color:var(--color-gb-blue-dark)] uppercase tracking-wider">
                Article Tools
              </h2>
              <div className="mt-4 grid gap-2">
                <a
                  href={article.pdf || "#"}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[color:var(--color-gb-blue)] hover:bg-[color:var(--color-gb-blue-dark)] px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition-all w-full cursor-pointer text-center"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </a>
                <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-[color:var(--border)] bg-white hover:bg-slate-50 px-4 py-2.5 text-sm font-bold text-[color:var(--color-gb-blue-dark)] transition-all w-full cursor-pointer">
                  <Quote className="h-4 w-4" />
                  Cite Article
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-[color:var(--border)] bg-white hover:bg-slate-50 px-4 py-2.5 text-sm font-bold text-[color:var(--color-gb-blue-dark)] transition-all w-full cursor-pointer">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>

              {/* Metrics */}
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                {[
                  ["Views", article.metrics.views],
                  ["PDF", article.metrics.downloads],
                  ["Cites", article.metrics.citations],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-[color:var(--color-gb-blue-soft)] p-3">
                    <p className="text-lg font-black text-[color:var(--color-gb-blue-dark)]">
                      {value}
                    </p>
                    <p className="text-[10px] font-bold text-[color:var(--ink-muted)] uppercase tracking-wider">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div className="surface-elevated p-5">
              <h2 className="text-sm font-black text-[color:var(--color-gb-blue-dark)] uppercase tracking-wider">
                Keywords
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {article.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-[color:var(--color-gb-blue-dark)]"
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
