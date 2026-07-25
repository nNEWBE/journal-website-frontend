import Link from "next/link";
import {
  ArrowRight,
  Barcode,
  BookOpen,
  FileText,
  Globe,
  Search,
  Send,
  ShieldCheck,
  Unlock,
  Users,
} from "lucide-react";
import { HeroSlider } from "@/components/home/hero-slider";
import { HomeJournalShowcase } from "@/components/home/home-journal-showcase";
import { HomeJournalStory } from "@/components/home/home-journal-story";
import { PageShell } from "@/components/layout/page-shell";
import { issues, topics } from "@/lib/data";

export default function Home() {
  const currentIssue = issues[0];
  const featuredArticle = currentIssue.articles[0];

  return (
    <PageShell>
      <section className="professional-hero relative overflow-hidden border-b border-[color:var(--border)]">
        <div className="hero-masthead relative overflow-hidden text-white">
          <div className="hero-pattern pointer-events-none absolute inset-0" />

          <div className="container-x relative z-10 py-12 md:py-16">
            <div className="grid items-center gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:gap-14">
              <div className="animate-rise">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white/70 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/25 hover:text-white">
                    <Unlock className="h-3 w-3 text-white/60 shrink-0" />
                    <span>Open Access</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white/70 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/25 hover:text-white">
                    <ShieldCheck className="h-3.5 w-3.5 text-white/60 shrink-0" />
                    <span>Peer Reviewed</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-[10px] font-extrabold tracking-[0.08em] text-white/70 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/25 hover:text-white">
                    <Barcode className="h-3.5 w-3.5 text-white/60 shrink-0" />
                    <span className="text-white/50 font-medium">ISSN</span>
                    <span className="font-mono font-bold text-white/80">2959-1082</span>
                  </span>
                </div>

                <h1 className="mt-6 max-w-2xl font-academic text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.55rem]">
                  Gono Bishwabidyalay
                  <span className="hero-title-accent block">
                    Journal of Research
                  </span>
                </h1>

                <p className="mt-5 max-w-xl text-sm font-medium leading-7 text-white/55">
                  An interdisciplinary journal publishing peer-reviewed
                  research across the sciences, humanities, and applied fields.
                </p>

                <form
                  action="/articles"
                  method="get"
                  className="hero-search-card mt-7 flex max-w-2xl flex-col gap-2 rounded-2xl border border-white/15 bg-white/[0.06] p-1.5 shadow-[0_28px_70px_rgba(0,0,0,0.24)] backdrop-blur-md transition-all sm:flex-row sm:items-center sm:gap-1.5"
                >
                  <div className="flex min-h-[44px] flex-1 items-center gap-3 pl-3.5 pr-2">
                    <Search className="h-4 w-4 shrink-0 text-white/60" />
                    <input
                      name="q"
                      required
                      aria-label="Search journal"
                      placeholder="Search articles, authors, DOI, or keywords"
                      className="w-full border-none bg-transparent text-xs font-semibold text-white outline-none focus:outline-none focus:ring-0 focus:border-none hover:border-none focus-visible:outline-none focus-visible:ring-0 placeholder:font-medium placeholder:text-white/50"
                    />
                  </div>
                  <button
                    className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-xl bg-white px-6 text-xs font-black text-[color:var(--color-gb-blue-deep)] shadow-md transition-all hover:bg-blue-50 hover:shadow-lg focus:outline-none cursor-pointer"
                    type="submit"
                  >
                    <span>Search journal</span>
                  </button>
                </form>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/dashboard/submissions/new"
                    className="group/submit inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-xs font-black text-[color:var(--color-gb-blue-deep)] shadow-md transition-all hover:bg-blue-50 hover:shadow-lg focus-ring"
                  >
                    <Send className="h-3.5 w-3.5 text-[color:var(--color-gb-blue)]" />
                    <span>Submit manuscript</span>
                  </Link>
                  <Link
                    href="/issues/current"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-5 text-xs font-extrabold text-white backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/10 focus-ring"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-white/70" />
                    <span>Read current issue</span>
                  </Link>
                </div>
              </div>

              <div className="mx-auto w-full max-w-xl lg:mx-0">
                <HeroSlider />
              </div>
            </div>
          </div>
        </div>

        <div className="hero-stats-strip border-b border-slate-200/80 bg-white shadow-xs">
          <div className="container-x">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { value: "286", label: "Published articles", icon: FileText },
                { value: "74", label: "Active reviewers", icon: Users },
                { value: "22", label: "Issues archived", icon: BookOpen },
                { value: "4", label: "Volumes published", icon: Globe },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className={`hero-stat-item flex items-center gap-3.5 py-5 md:py-6 ${
                      index % 2 === 0 ? "pr-4" : "pl-4"
                    } md:px-6 md:first:pl-0 md:last:pr-0 border-r border-slate-100 last:border-r-0`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)] shadow-xs">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-lg font-black leading-none text-[color:var(--color-gb-blue-deep)] md:text-xl">
                        {stat.value}
                      </p>
                      <p className="mt-1.5 text-[8px] font-extrabold uppercase tracking-[0.12em] text-slate-500 md:text-[9px]">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {featuredArticle && (
        <HomeJournalShowcase
          featuredArticle={featuredArticle}
          currentIssue={currentIssue}
        />
      )}

      <HomeJournalStory topics={topics} />
    </PageShell>
  );
}
