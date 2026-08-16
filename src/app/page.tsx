import {
  BookOpen,
  FileText,
  Globe,
  Users,
} from "lucide-react";
import { HeroShowcase } from "@/components/home/hero-showcase";
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
      {/* Redesigned Academic Research Hero Showcase */}
      <FadeIn delay={0.05}>
        <HeroShowcase />
      </FadeIn>

      {/* Key Metric Highlights Strip */}
      <div className="hero-stats-strip border-b border-slate-200/80 bg-slate-50/60 shadow-2xs">
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
                  className={`hero-stat-item flex items-center gap-3.5 py-4 md:py-5 ${
                    index % 2 === 0 ? "pr-4" : "pl-4"
                  } md:px-6 md:first:pl-0 md:last:pr-0 border-r border-slate-200/60 last:border-r-0`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1e40af] border border-blue-100/60 shadow-2xs transition-transform hover:scale-105">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-lg font-black leading-none text-slate-900 md:text-xl">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[8px] font-extrabold uppercase tracking-[0.12em] text-slate-500 md:text-[9px]">
                      {stat.label}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </div>

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

