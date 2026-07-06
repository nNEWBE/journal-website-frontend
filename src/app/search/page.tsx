import { Search } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { PageShell } from "@/components/page-shell";
import { filterArticles } from "@/lib/data";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = String(params.q ?? "");
  const results = filterArticles(q, "", "");

  return (
    <PageShell>
      {/* Search page header with embedded search */}
      <div className="page-header">
        <div className="container-x page-header-inner py-10 md:py-14">
          <span className="page-badge">
            <Search className="h-3 w-3" />
            Advanced Search
          </span>
          <h1 className="page-title">Search the Journal</h1>

          {/* Primary search form */}
          <form className="mt-7 max-w-2xl">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex min-h-[46px] flex-1 items-center gap-3 rounded-lg bg-white/[0.08] border border-white/10 px-4 focus-within:bg-white/[0.12] focus-within:border-white/20 transition-all">
                <Search className="h-4 w-4 text-white/40 shrink-0" />
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Title, author, abstract, DOI, keyword…"
                  className="w-full bg-transparent text-sm text-white/90 placeholder:text-white/30 outline-none"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[color:var(--color-gb-gold)] hover:bg-[color:var(--color-gb-gold-dark)] px-5 py-2.5 text-[13px] font-extrabold text-white shadow-lg shadow-amber-900/20 transition-all cursor-pointer"
              >
                <Search className="h-3.5 w-3.5" />
                Search
              </button>
            </div>

            {/* Advanced filters */}
            <div className="mt-4 grid gap-2 sm:grid-cols-4">
              {["Author surname", "Volume", "Issue", "Date range"].map((item) => (
                <input
                  key={item}
                  placeholder={item}
                  className="rounded-lg bg-white/[0.06] border border-white/[0.08] px-3 py-2.5 text-xs text-white/80 placeholder:text-white/25 outline-none focus:border-white/20 focus:bg-white/[0.1] transition-all"
                />
              ))}
            </div>
          </form>
        </div>
        <div className="page-header-accent" />
      </div>

      <section className="container-x py-8">
        {q && (
          <p className="mb-6 text-xs font-black uppercase tracking-wider text-[color:var(--ink-muted)]">
            {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
          </p>
        )}
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {results.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
