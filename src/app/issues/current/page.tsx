import Link from "next/link";
import { BookOpen, Download } from "lucide-react";
import { IssueCover } from "@/components/issue-cover";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { issues } from "@/lib/data";

export default function CurrentIssuePage() {
  const issue = issues[0];
  return (
    <PageShell>
      {/* Page Header */}
      <div className="page-header">
        <div className="container-x page-header-inner py-10 md:py-14">
          <span className="page-badge">
            <BookOpen className="h-3.5 w-3.5" />
            Current Issue
          </span>
          <h1 className="page-title">{issue.theme}</h1>
          <p className="page-subtitle">
            {issue.volume} · {issue.issue} · Published {issue.month} · {issue.articleCount} articles
          </p>
          <button className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[color:var(--color-gb-gold)] hover:bg-[color:var(--color-gb-gold-dark)] px-5 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-amber-900/20 transition-all cursor-pointer">
            <Download className="h-4 w-4" />
            Download Full Issue
          </button>
        </div>
        <div className="page-header-accent" />
      </div>

      <section className="container-x py-8">
        <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
          <IssueCover
            volume={issue.volume}
            issue={issue.issue}
            month={issue.month}
            theme={issue.theme}
          />
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-[color:var(--ink-muted)] mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[color:var(--color-gb-blue)]" />
              Table of Contents
            </h2>
            <div className="grid gap-3">
              {issue.articles.map((article, index) => (
                <Link
                  href={`/articles/${article.slug}`}
                  key={article.id}
                  className="surface-elevated group relative overflow-hidden p-4"
                >
                  {/* Left accent */}
                  <div className="absolute inset-y-0 left-0 w-[3px] bg-[color:var(--color-gb-blue)] group-hover:bg-[color:var(--color-gb-gold)] transition-colors" />

                  <div className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5 flex h-7 w-7 items-center justify-center rounded-md bg-[color:var(--color-gb-blue-soft)] text-[11px] font-black text-[color:var(--color-gb-blue)]">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="info">{article.type}</Badge>
                      </div>
                      <h3 className="text-base font-extrabold text-[color:var(--color-gb-blue-dark)] group-hover:text-[color:var(--bangla-red)] transition-colors leading-snug">
                        {article.title}
                      </h3>
                      <p className="mt-1.5 text-xs font-semibold text-[color:var(--ink-muted)]">
                        {article.authors.join(", ")} · pages {article.pages}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
