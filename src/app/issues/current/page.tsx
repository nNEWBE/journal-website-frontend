import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Eye,
  FileText,
  Globe2,
  Library,
  ShieldCheck,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { issues } from "@/lib/data";

export default function CurrentIssuePage() {
  const issue = issues[0];
  const leadArticle = issue.articles[0];

  return (
    <PageShell>
      <section className="relative overflow-hidden bg-[color:var(--color-gb-blue-deep)] text-white">
        <div className="pointer-events-none absolute inset-0 hero-pattern opacity-[0.025]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[color:var(--color-gb-blue)]/20" />

        <div className="container-x relative grid gap-12 py-14 md:py-18 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white/75">
                <BookOpen className="h-3.5 w-3.5 text-[color:var(--color-gb-gold)]" />
                Current issue
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">
                {issue.volume} / {issue.issue}
              </span>
            </div>

            <h1 className="mt-6 max-w-3xl font-academic text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-white md:text-5xl lg:text-[3.55rem]">
              {issue.theme}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 md:text-[15px]">
              A peer-reviewed collection examining how research, public
              institutions, and local practice can strengthen healthier and
              more resilient communities.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#contents"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-5 text-xs font-extrabold text-[color:var(--color-gb-blue-deep)] transition-colors hover:bg-amber-50 focus-ring"
              >
                Browse this issue
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
              {leadArticle && (
                <Link
                  href={`/articles/${leadArticle.slug}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 bg-white/[0.05] px-5 text-xs font-extrabold text-white transition-colors hover:border-white/30 hover:bg-white/10 focus-ring"
                >
                  Start reading
                  <BookOpen className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>

            <div className="mt-9 grid max-w-xl grid-cols-3 border-t border-white/10 pt-5">
              <div>
                <p className="text-xl font-black text-white">{issue.articleCount}</p>
                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white/40">
                  Articles
                </p>
              </div>
              <div className="border-l border-white/10 pl-5">
                <p className="text-xl font-black text-white">Double</p>
                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white/40">
                  Blind review
                </p>
              </div>
              <div className="border-l border-white/10 pl-5">
                <p className="text-xl font-black text-white">Open</p>
                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white/40">
                  Access
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[520px] lg:ml-auto">
            <div className="overflow-hidden rounded-[22px] border border-white/15 bg-white/[0.06] p-3 shadow-[0_28px_70px_rgba(0,0,0,0.24)]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[15px] bg-slate-900">
                <Image
                  src={leadArticle?.image || "/covers/medical.png"}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 520px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060b2f]/95 via-[#060b2f]/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.14em] text-amber-300">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {issue.month}
                  </div>
                  <p className="mt-3 max-w-md font-academic text-2xl font-bold leading-tight text-white">
                    {issue.theme}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between px-2 pb-1 pt-3 text-[9px] font-bold uppercase tracking-[0.12em] text-white/45">
                <span>GB Journal of Research</span>
                <span>{issue.year}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contents" className="scroll-mt-24 bg-[#f7f8fc] py-14 md:py-18">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,1fr)_290px] lg:items-start">
          <div>
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-[color:var(--color-gb-gold-dark)]">
                  <Library className="h-3.5 w-3.5" />
                  Issue contents
                </p>
                <h2 className="mt-2 font-academic text-3xl font-bold tracking-[-0.02em] text-[color:var(--color-gb-blue-deep)]">
                  Research in this edition
                </h2>
              </div>
              <p className="text-[11px] font-bold text-slate-400">
                {issue.articles.length} articles currently available online
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {issue.articles.map((article, index) => (
                <article
                  key={article.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 transition-all duration-300 hover:border-[color:var(--color-gb-blue)]/20 hover:shadow-[0_16px_38px_rgba(17,27,82,0.07)]"
                >
                  <div className="grid gap-5 sm:grid-cols-[150px_minmax(0,1fr)_auto] sm:items-center">
                    <Link
                      href={`/articles/${article.slug}`}
                      className="relative block aspect-[4/3] overflow-hidden rounded-xl bg-slate-900 focus-ring sm:aspect-[5/4]"
                    >
                      <Image
                        src={article.image || "/covers/medical.png"}
                        alt=""
                        fill
                        sizes="(max-width: 639px) 100vw, 150px"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.045]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#060b2f]/65 via-transparent to-transparent" />
                      <span className="absolute bottom-3 left-3 flex h-7 w-7 items-center justify-center rounded-md border border-white/15 bg-slate-950/45 font-mono text-[9px] font-black text-white backdrop-blur-sm">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </Link>

                    <div className="min-w-0 py-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-[color:var(--color-gb-blue)]">
                          <FileText className="h-3 w-3" />
                          {article.type}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
                          {article.topic}
                        </span>
                      </div>

                      <Link href={`/articles/${article.slug}`}>
                        <h3 className="mt-3 max-w-3xl font-academic text-lg font-bold leading-snug text-[color:var(--color-gb-blue-deep)] transition-colors group-hover:text-[color:var(--color-gb-blue)] md:text-xl">
                          {article.title}
                        </h3>
                      </Link>
                      <p className="mt-2 max-w-3xl text-[11px] leading-5 text-slate-500 line-clamp-2">
                        {article.abstract}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[9px] font-semibold text-slate-400">
                        <span>{article.authors.join(", ")}</span>
                        <span>Pages {article.pages}</span>
                        <span className="inline-flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {article.metrics.views.toLocaleString()} views
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/articles/${article.slug}`}
                      aria-label={`Read ${article.title}`}
                      className="mr-2 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-[color:var(--color-gb-blue)] transition-all hover:border-[color:var(--color-gb-blue)]/30 hover:bg-[color:var(--color-gb-blue-soft)] focus-ring"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_32px_rgba(17,27,82,0.05)]">
              <h2 className="text-xs font-black uppercase tracking-[0.12em] text-[color:var(--color-gb-blue-deep)]">
                Issue information
              </h2>
              <dl className="mt-4 divide-y divide-slate-100">
                {[
                  ["Published", issue.month],
                  ["Volume", issue.volume],
                  ["Issue", issue.issue],
                  ["ISSN", "2959-1082"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4 py-3 text-[11px]"
                  >
                    <dt className="text-slate-400">{label}</dt>
                    <dd className="text-right font-bold text-slate-700">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-xs font-black uppercase tracking-[0.12em] text-[color:var(--color-gb-blue-deep)]">
                Publishing standards
              </h2>
              <div className="mt-4 space-y-3">
                {[
                  { icon: ShieldCheck, label: "Double-blind peer reviewed" },
                  { icon: Globe2, label: "Open-access publication" },
                  { icon: CheckCircle2, label: "DOI and citation metadata" },
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
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
