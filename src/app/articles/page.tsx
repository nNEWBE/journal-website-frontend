import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { PageShell } from "@/components/page-shell";
import { ArticlesFilterForm } from "@/components/articles-filter-form";
import { articleTypes, filterArticles, topics } from "@/lib/data";

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = String(params.q ?? "");
  const type = String(params.type ?? "");
  const topic = String(params.topic ?? "");
  const results = filterArticles(q, type, topic);

  return (
    <PageShell>
      {/* Page Header */}
      <div className="page-header">
        <div className="container-x page-header-inner py-10 md:py-14">
          <span className="page-badge">Article Discovery</span>
          <h1 className="page-title">Research Articles</h1>
          <p className="page-subtitle">
            Explore and discover peer-reviewed university research papers. Search by title, author names, DOIs, abstract keywords, and filter by subject topics.
          </p>
        </div>
        <div className="page-header-accent" />
      </div>

      <section className="container-x py-8">
        {/* Client-side filter form with CustomSelects */}
        <ArticlesFilterForm
          initialQ={q}
          initialType={type}
          initialTopic={topic}
          articleTypes={articleTypes}
          topics={topics}
        />

        <div className="mt-8 flex items-center justify-between border-b border-[color:var(--border)] pb-3">
          <p className="text-[11px] font-black uppercase tracking-wider text-[color:var(--ink-muted)]">
            {results.length} article{results.length === 1 ? "" : "s"} indexed
          </p>
          <Link href="/articles" className="text-[11px] font-black text-[color:var(--bangla-red)] hover:underline uppercase tracking-wider">
            Reset Filters
          </Link>
        </div>

        <div className="mt-6 grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {results.length === 0 ? (
            <div className="col-span-full py-16 text-center text-sm font-semibold text-[color:var(--ink-muted)]">
              No articles match your search criteria. Try resetting the filters.
            </div>
          ) : (
            results.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          )}
        </div>
      </section>
    </PageShell>
  );
}
