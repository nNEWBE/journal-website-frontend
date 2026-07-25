import Image from "next/image";
import Link from "next/link";
import {
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
  ShieldCheck,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { issues } from "@/lib/data";

import { PageHeroBanner } from "@/components/page-hero-banner";
import { HeroActionButton } from "@/components/ui/hero-action-button";

export default function CurrentIssuePage() {
  const issue = issues[0];
  const leadArticle = issue.articles[0];

  const meta = [
    { label: "Published", value: issue.month },
    { label: "Volume", value: issue.volume },
    { label: "Issue", value: issue.issue },
    { label: "ISSN", value: "2959-1082" },
  ];

  const standards = [
    { icon: ShieldCheck, label: "Double-blind peer reviewed" },
    { icon: Globe2, label: "Open-access publication" },
    { icon: CheckCircle2, label: "DOI and citation metadata" },
    { icon: Download, label: "Free PDF download" },
  ];

  return (
    <PageShell>
      {/* ── Hero ───────────────────────────────────── */}
      <PageHeroBanner
        badgeLabel="Current Issue"
        badgeIcon={BookOpen}
        subBadge={`${issue.volume} · ${issue.issue}`}
        title={issue.theme}
        description="A peer-reviewed collection examining how research, public institutions, and local practice can strengthen healthier and more resilient communities."
        actions={
          <>
            <HeroActionButton
              href="#contents"
              variant="white"
              hasArrow
            >
              Browse this issue
            </HeroActionButton>
            {leadArticle && (
              <HeroActionButton
                href={`/articles/${leadArticle.slug}`}
                variant="secondary"
                icon={BookOpen}
              >
                Start reading
              </HeroActionButton>
            )}
          </>
        }
        stats={[
          { val: String(issue.articleCount), label: "Articles" },
          { val: "Double", label: "Blind review" },
          { val: "Open", label: "Access" },
        ]}
        coverCard={{
          imageSrc: leadArticle?.image || "/covers/medical.png",
          title: issue.theme,
          date: issue.month,
          footerLeft: "GB Journal of Research",
          footerRight: String(issue.year),
        }}
      />

      {/* ── Contents + Sidebar ─────────────────────── */}
      <section id="contents" className="scroll-mt-20 bg-[#f5f7fb] py-14 md:py-18">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">

          {/* Article list */}
          <div>
            <div className="mb-8 flex flex-col gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-[color:var(--color-gb-gold-dark)]">
                  <Library className="h-3.5 w-3.5" />
                  Issue Contents
                </p>
                <h2 className="mt-1.5 font-academic text-3xl font-bold tracking-tight text-[color:var(--color-gb-blue-deep)]">
                  Research in this edition
                </h2>
              </div>
              <span className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-400 shadow-xs">
                {issue.articles.length} articles online
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {issue.articles.map((article, index) => (
                <article
                  key={article.id}
                  className="group overflow-hidden rounded-[22px] border border-slate-200/90 bg-white shadow-[0_12px_36px_rgba(11,18,61,0.06)] transition-all duration-300 hover:border-[color:var(--color-gb-blue)]/30 hover:shadow-[0_20px_48px_rgba(11,18,61,0.11)] hover:-translate-y-1"
                >
                  <div className="grid gap-0 p-2.5 sm:grid-cols-[190px_minmax(0,1fr)] sm:gap-4">
                    {/* thumbnail */}
                    <Link
                      href={`/articles/${article.slug}`}
                      className="relative block overflow-hidden rounded-xl bg-slate-950"
                    >
                      <div className="relative aspect-[16/10] sm:aspect-auto sm:h-full sm:min-h-[170px]">
                        <Image
                          src={article.image || "/covers/medical.png"}
                          alt=""
                          fill
                          sizes="(max-width: 639px) 100vw, 190px"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-gb-blue-deep)]/80 via-transparent to-transparent" />
                        <span className="absolute bottom-2.5 left-2.5 flex h-7 items-center justify-center rounded-lg border border-amber-400/40 bg-slate-950/75 px-2.5 font-mono text-[10px] font-black text-amber-300 backdrop-blur-md shadow-xs">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </Link>

                    {/* content */}
                    <div className="flex flex-col justify-between py-1.5 pr-2 pl-1 sm:pl-0">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-[color:var(--color-gb-blue-soft)] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-[0.14em] text-[color:var(--color-gb-blue)]">
                            <FileText className="h-3 w-3" />
                            {article.type}
                          </span>
                          <span className="inline-flex items-center rounded-md border border-slate-200/80 bg-slate-50 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-500">
                            {article.topic}
                          </span>
                        </div>

                        <Link href={`/articles/${article.slug}`}>
                          <h3 className="mt-3 font-academic text-[1.15rem] font-bold leading-snug text-[color:var(--color-gb-blue-deep)] transition-colors group-hover:text-[color:var(--color-gb-blue)] md:text-[1.25rem]">
                            {article.title}
                          </h3>
                        </Link>
                        <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-2">
                          {article.abstract}
                        </p>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3.5">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="truncate text-xs font-semibold text-slate-700">
                            <span className="font-normal text-slate-400">By </span>
                            {article.authors.slice(0, 2).join(", ")}
                            {article.authors.length > 2 ? " et al." : ""}
                          </p>
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50/70 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                            <Hash className="h-3 w-3 text-[color:var(--color-gb-blue)]" />
                            Pages {article.pages}
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50/70 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                            <Eye className="h-3 w-3 text-[color:var(--color-gb-blue)]" />
                            {article.metrics.views.toLocaleString()} views
                          </span>
                        </div>
                        <Link
                          href={`/articles/${article.slug}`}
                          aria-label={`Read ${article.title}`}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color:var(--color-gb-blue-deep)] text-white shadow-xs transition-all group-hover:bg-[color:var(--color-gb-blue)] group-hover:scale-105"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sticky sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            {/* Issue info */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_20px_rgba(11,18,61,0.05)]">
              <div className="border-b border-slate-100 bg-[color:var(--color-gb-blue-deep)] px-5 py-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-300">Issue Information</p>
              </div>
              <dl className="divide-y divide-slate-100 px-5">
                {meta.map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between gap-4 py-3 text-[11px]">
                    <dt className="font-medium text-slate-400">{label}</dt>
                    <dd className="font-bold text-slate-800">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Publishing standards */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[color:var(--color-gb-blue-deep)]">
                Publishing Standards
              </p>
              <div className="mt-4 space-y-3">
                {standards.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2.5 text-[11px] font-semibold text-slate-600">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[color:var(--color-gb-blue-soft)]">
                      <Icon className="h-3.5 w-3.5 text-[color:var(--color-gb-blue)]" />
                    </div>
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="relative overflow-hidden rounded-2xl bg-[color:var(--color-gb-blue-deep)] p-5 text-white">
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[color:var(--color-gb-gold)] opacity-10 blur-2xl" />
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-300">Submit Research</p>
              <p className="mt-2 text-xs font-bold text-white/80 leading-5">
                Accepting submissions for the January 2027 edition.
              </p>
              <div className="mt-4">
                <HeroActionButton
                  href="/dashboard/submissions/new"
                  variant="primary"
                  hasArrow
                >
                  Submit a manuscript
                </HeroActionButton>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
