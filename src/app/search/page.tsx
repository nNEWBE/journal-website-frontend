import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FileSearch,
  Globe2,
  Library,
  Search,
} from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { EditorialPageHeader } from "@/components/editorial-page-header";
import { SupportingTag } from "@/components/ui/badge";
import { PageShell } from "@/components/page-shell";
import { articles, filterArticles, topics } from "@/lib/data";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = String(params.q ?? "").trim();
  const hasQuery = q.length > 0;
  const results = hasQuery ? filterArticles(q, "", "") : [];
  const suggestedTopics = topics.slice(0, 5);

  return (
    <PageShell>
      <EditorialPageHeader
        icon={FileSearch}
        eyebrow="Journal search"
        title="Search the scholarly record"
        description="Find peer-reviewed articles by title, author, abstract keyword, subject, or DOI across every published issue."
        supporting={
          <>
            <SupportingTag icon={BookOpen}>Titles and abstracts</SupportingTag>
            <SupportingTag icon={Library}>Authors and DOI</SupportingTag>
            <SupportingTag icon={Globe2}>Open-access records</SupportingTag>
          </>
        }
        aside={
          <div className="relative overflow-hidden rounded-[20px] bg-[color:var(--color-gb-blue-deep)] p-6 text-white shadow-[0_22px_52px_rgba(17,27,82,0.16)]">
            <div className="pointer-events-none absolute inset-0 hero-pattern opacity-[0.035]" />
            <div className="relative flex items-center gap-3 border-b border-white/10 pb-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-amber-300">
                <Search className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-amber-300">
                  Search coverage
                </p>
                <h2 className="mt-1 text-xs font-black text-white">
                  Complete journal metadata
                </h2>
              </div>
            </div>
            <dl className="relative mt-2 divide-y divide-white/10">
              {[
                ["Indexed articles", String(articles.length)],
                ["Subject areas", String(topics.length)],
                ["Search fields", "Title, author, DOI"],
                ["Full text", "Abstract keywords"],
                ["Access", "Open records"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-5 py-3.5 text-[10px]"
                >
                  <dt className="text-white/40">{label}</dt>
                  <dd className="text-right font-bold text-white/75">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        }
      />

      <section className="container-x py-12 md:py-16">
        <form
          action="/search"
          method="get"
          className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_16px_40px_rgba(17,27,82,0.07)]"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex min-h-12 flex-1 items-center gap-3 rounded-xl bg-slate-50 px-4 transition-colors focus-within:bg-white focus-within:ring-1 focus-within:ring-[color:var(--color-gb-blue)]/30">
              <Search className="h-4 w-4 shrink-0 text-[color:var(--color-gb-blue)]" />
              <span className="sr-only">Search the journal</span>
              <input
                name="q"
                required
                defaultValue={q}
                autoComplete="off"
                placeholder="Enter a title, author, DOI, or keyword"
                className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
              />
            </label>
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[color:var(--color-gb-blue-deep)] px-6 text-xs font-extrabold text-white transition-colors hover:bg-[color:var(--color-gb-blue)] focus-ring"
            >
              <Search className="h-3.5 w-3.5" />
              Search journal
            </button>
          </div>
        </form>

        <div className="mx-auto mb-12 mt-4 flex max-w-4xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[9px] font-bold text-slate-400">
          <span className="uppercase tracking-[0.1em]">Popular subjects</span>
          {suggestedTopics.map((topic) => (
            <Link
              key={topic}
              href={`/search?q=${encodeURIComponent(topic)}`}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-slate-500 transition-colors hover:border-[color:var(--color-gb-blue)]/20 hover:text-[color:var(--color-gb-blue)] focus-ring"
            >
              {topic}
            </Link>
          ))}
        </div>

        {hasQuery ? (
          <>
            <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-[color:var(--color-gb-gold-dark)]">
                  <Search className="h-3.5 w-3.5" />
                  Search results
                </p>
                <h2 className="mt-2 font-academic text-3xl font-bold tracking-[-0.025em] text-[color:var(--color-gb-blue-deep)]">
                  {results.length} result{results.length === 1 ? "" : "s"} for
                  “{q}”
                </h2>
              </div>
              <Link
                href={`/articles?q=${encodeURIComponent(q)}`}
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.1em] text-[color:var(--color-gb-blue)] hover:text-[color:var(--color-gb-blue-deep)] focus-ring"
              >
                Refine in archive
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {results.length > 0 ? (
              <div className="mt-8 grid gap-5 xl:grid-cols-2">
                {results.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    variant="editorial"
                  />
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
                <FileSearch className="mx-auto h-8 w-8 text-slate-300" />
                <h2 className="mt-4 font-academic text-2xl font-bold text-[color:var(--color-gb-blue-deep)]">
                  No matching research found
                </h2>
                <p className="mx-auto mt-2 max-w-lg text-xs leading-6 text-slate-500">
                  Check the spelling, try fewer words, search for an author
                  surname, or use the full archive filters to broaden the
                  result.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/search"
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[color:var(--color-gb-blue-deep)] px-4 text-xs font-extrabold text-white focus-ring"
                  >
                    New search
                    <Search className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="/articles"
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-xs font-extrabold text-[color:var(--color-gb-blue-deep)] focus-ring"
                  >
                    Browse all articles
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
              <div className="rounded-2xl border border-slate-200 bg-[#f8f9fc] p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[color:var(--color-gb-blue)] shadow-sm">
                  <Search className="h-4.5 w-4.5" />
                </span>
                <h2 className="mt-5 font-academic text-2xl font-bold text-[color:var(--color-gb-blue-deep)]">
                  Begin with a research question
                </h2>
                <p className="mt-3 text-xs leading-6 text-slate-500">
                  Use a distinctive phrase, author surname, DOI, or subject
                  term. Search examines titles, abstracts, authors, keywords,
                  and publication metadata.
                </p>
                <div className="mt-5 space-y-3 border-t border-slate-200 pt-5">
                  {[
                    {
                      icon: BookOpen,
                      label: `${articles.length} indexed articles`,
                    },
                    {
                      icon: Library,
                      label: `${topics.length} subject areas`,
                    },
                    {
                      icon: Globe2,
                      label: "Open-access publication records",
                    },
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2.5 text-[10px] font-bold text-slate-500"
                    >
                      <Icon className="h-3.5 w-3.5 text-[color:var(--color-gb-blue)]" />
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-end justify-between gap-5 border-b border-slate-200 pb-5">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[color:var(--color-gb-gold-dark)]">
                      Recently published
                    </p>
                    <h2 className="mt-2 font-academic text-3xl font-bold tracking-[-0.025em] text-[color:var(--color-gb-blue-deep)]">
                      Browse recent research
                    </h2>
                  </div>
                  <Link
                    href="/articles"
                    className="hidden items-center gap-2 text-[9px] font-black uppercase tracking-[0.1em] text-[color:var(--color-gb-blue)] sm:inline-flex focus-ring"
                  >
                    Full archive
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {articles.slice(0, 2).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </PageShell>
  );
}
