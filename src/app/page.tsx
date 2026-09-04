"use client";

import { HeroShowcase } from "@/components/home/hero-showcase";
import { HomeLatestResearch } from "@/components/home/home-latest-research";
import { HomeCurrentIssue } from "@/components/home/home-current-issue";
import { HomeMostRead } from "@/components/home/home-most-read";
import { HomeExploreTopics } from "@/components/home/home-explore-topics";
import { HomeFeaturedJournals } from "@/components/home/home-featured-journals";
import { HomeCallsForPapers } from "@/components/home/home-calls-for-papers";
import { HomeResearchCommunity } from "@/components/home/home-research-community";
import { HomeFaqSection } from "@/components/home/home-faq-section";
import { HomeMetricsNewsletter } from "@/components/home/home-metrics-newsletter";
import { PageShell } from "@/components/layout/page-shell";
import { FadeIn } from "@/components/layout/page-transition";
import { AdminPageEditBadge } from "@/components/ui/admin-page-edit-badge";
import { useHomeSectionVisibility } from "@/lib/cms-visibility";

export default function Home() {
  const { isSectionVisible } = useHomeSectionVisibility();

  return (
    <PageShell>
      <AdminPageEditBadge pageKey="home" />

      {/* Redesigned Academic Research Hero Showcase */}
      {isSectionVisible("hero-main") && (
        <FadeIn delay={0.05}>
          <HeroShowcase />
        </FadeIn>
      )}

      {/* Latest Research 4-Column Showcase */}
      {isSectionVisible("latest-research") && (
        <FadeIn delay={0.15}>
          <HomeLatestResearch />
        </FadeIn>
      )}

      {/* Current Issue Section */}
      {isSectionVisible("current-issue") && (
        <FadeIn delay={0.18}>
          <HomeCurrentIssue />
        </FadeIn>
      )}

      {/* Most Read Ranked Section */}
      {isSectionVisible("most-read") && (
        <FadeIn delay={0.2}>
          <HomeMostRead />
        </FadeIn>
      )}

      {/* Explore by Topic Grid */}
      {(isSectionVisible("explore-topics") || isSectionVisible("topics")) && (
        <FadeIn delay={0.22}>
          <HomeExploreTopics />
        </FadeIn>
      )}

      {/* Featured Journals 4-Column Section */}
      {isSectionVisible("featured-journals") && (
        <FadeIn delay={0.24}>
          <HomeFeaturedJournals />
        </FadeIn>
      )}

      {/* Calls for Papers / Special Issues */}
      {(isSectionVisible("call-for-papers") || isSectionVisible("calls-for-papers")) && (
        <FadeIn delay={0.26}>
          <HomeCallsForPapers />
        </FadeIn>
      )}

      {/* From Our Research Community */}
      {isSectionVisible("research-community") && (
        <FadeIn delay={0.28}>
          <HomeResearchCommunity />
        </FadeIn>
      )}

      {/* Frequently Asked Questions */}
      {(isSectionVisible("home-faq") || isSectionVisible("faq")) && (
        <FadeIn delay={0.3}>
          <HomeFaqSection />
        </FadeIn>
      )}

      {/* Research Metrics & Newsletter Box */}
      {isSectionVisible("journal-stats") && (
        <FadeIn delay={0.32}>
          <HomeMetricsNewsletter />
        </FadeIn>
      )}
    </PageShell>
  );
}
