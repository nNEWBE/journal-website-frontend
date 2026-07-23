import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Globe,
  Search,
  Send,
  Users,
} from "lucide-react";
import { HeroSlider } from "@/components/hero-slider";
import { HomeJournalShowcase } from "@/components/home-journal-showcase";
import { HomeJournalStory } from "@/components/home-journal-story";
import { PageShell } from "@/components/page-shell";
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
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-white/65">
                    Open access
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-white/65">
                    Peer reviewed
                  </span>
                  <span className="font-mono text-[9px] font-bold text-white/35">
                    ISSN 2959-1082
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
                  action="/search"
                  className="hero-search-card mt-7 flex max-w-2xl flex-col gap-2 rounded-xl bg-white p-1.5 shadow-[0_18px_45px_rgba(2,6,30,0.24)] sm:flex-row"
                >
                  <div className="flex min-h-[46px] flex-1 items-center gap-3 px-3">
                    <Search className="h-4 w-4 shrink-0 text-[color:var(--color-gb-blue)]" />
                    <input
                      name="q"
                      aria-label="Search journal"
                      placeholder="Search articles, authors, DOI, or keywords"
                      className="w-full border-none bg-transparent text-xs font-semibold text-slate-700 outline-none placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-0"
                    />
                  </div>
                  <button
                    className="group/search inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg bg-[color:var(--color-gb-blue-deep)] px-5 text-xs font-extrabold text-white hover:bg-[color:var(--color-gb-blue)]"
                    type="submit"
                  >
                    Search journal
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/search:translate-x-0.5" />
                  </button>
                </form>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/dashboard/submissions/new"
                    className="group/submit inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[color:var(--color-gb-gold)] px-5 text-xs font-black text-[color:var(--color-gb-blue-deep)] hover:bg-amber-300 focus-ring"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Submit manuscript
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/submit:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/issues/current"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.06] px-5 text-xs font-extrabold text-white hover:border-white/30 hover:bg-white/10 focus-ring"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Read current issue
                  </Link>
                </div>
              </div>

              <div className="mx-auto w-full max-w-xl lg:mx-0">
                <HeroSlider />
              </div>
            </div>
          </div>
        </div>

        <div className="hero-stats-strip bg-white">
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
                    className={`hero-stat-item flex items-center gap-3 py-5 md:py-6 ${
                      index % 2 === 0 ? "pr-4" : "pl-4"
                    } md:px-6 md:first:pl-0 md:last:pr-0`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-lg font-black leading-none text-[color:var(--color-gb-blue-deep)] md:text-xl">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-[8px] font-black uppercase tracking-[0.11em] text-slate-400 md:text-[9px]">
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
