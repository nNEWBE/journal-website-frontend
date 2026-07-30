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
import { Button } from "@/components/ui/button";
import { HeroSlider } from "@/components/home/hero-slider";
import { HomeJournalShowcase } from "@/components/home/home-journal-showcase";
import { HomeJournalStory } from "@/components/home/home-journal-story";
import { PageShell } from "@/components/layout/page-shell";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/layout/page-transition";
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
              <FadeIn direction="up" delay={0.1}>
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
                  className="hero-search-card mt-7 flex max-w-2xl flex-col gap-2 rounded-2xl border border-white/20 bg-white/[0.08] p-1.5 shadow-[0_28px_70px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all hover:border-white/30 focus-within:border-amber-400/60 sm:flex-row sm:items-center sm:gap-1.5"
                >
                  <div className="flex min-h-[44px] flex-1 items-center gap-3 pl-3.5 pr-2">
                    <Search className="h-4 w-4 shrink-0 text-white/70" />
                    <input
                      name="q"
                      required
                      aria-label="Search journal"
                      placeholder="Search articles, authors, DOI, or keywords"
                      className="w-full border-none bg-transparent text-xs font-semibold text-white outline-none focus:outline-none focus:ring-0 focus:border-none hover:border-none focus-visible:outline-none focus-visible:ring-0 placeholder:font-medium placeholder:text-white/50"
                    />
                  </div>
                  <Button type="submit" variant="red" icon={Search} className="min-h-[44px]">
                    Search journal
                  </Button>
                </form>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Button
                    href="/dashboard/submissions/new"
                    variant="blue"
                    icon={Send}
                    iconBox
                  >
                    Submit manuscript
                  </Button>
                  <Button
                    href="/issues/current"
                    variant="gold"
                    icon={BookOpen}
                    iconBox
                  >
                    Read current issue
                  </Button>
                </div>
              </FadeIn>

              <FadeIn direction="left" delay={0.25} className="mx-auto w-full max-w-xl lg:mx-0">
                <HeroSlider />
              </FadeIn>
            </div>
          </div>
        </div>

        <div className="hero-stats-strip border-b border-slate-200/80 bg-white shadow-xs">
          <div className="container-x">
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-4">
              {[
                { value: "286", label: "Published articles", icon: FileText },
                { value: "74", label: "Active reviewers", icon: Users },
                { value: "22", label: "Issues archived", icon: BookOpen },
                { value: "4", label: "Volumes published", icon: Globe },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <StaggerItem
                    key={stat.label}
                    className={`hero-stat-item flex items-center gap-3.5 py-5 md:py-6 ${
                      index % 2 === 0 ? "pr-4" : "pl-4"
                    } md:px-6 md:first:pl-0 md:last:pr-0 border-r border-slate-100 last:border-r-0`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)] shadow-xs transition-transform hover:scale-105">
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
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {featuredArticle && (
        <FadeIn delay={0.15}>
          <HomeJournalShowcase
            featuredArticle={featuredArticle}
            currentIssue={currentIssue}
          />
        </FadeIn>
      )}

      <FadeIn delay={0.2}>
        <HomeJournalStory topics={topics} />
      </FadeIn>
    </PageShell>
  );
}
