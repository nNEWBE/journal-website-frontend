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

export default function Home() {
  return (
    <PageShell>
      <AdminPageEditBadge pageKey="home" />

      {/* Redesigned Academic Research Hero Showcase */}
      <FadeIn delay={0.05}>
        <HeroShowcase />
      </FadeIn>

      {/* Latest Research 4-Column Showcase */}
      <FadeIn delay={0.15}>
        <HomeLatestResearch />
      </FadeIn>

      {/* Current Issue Section */}
      <FadeIn delay={0.18}>
        <HomeCurrentIssue />
      </FadeIn>

      {/* Most Read Ranked Section */}
      <FadeIn delay={0.2}>
        <HomeMostRead />
      </FadeIn>

      {/* Explore by Topic Grid */}
      <FadeIn delay={0.22}>
        <HomeExploreTopics />
      </FadeIn>

      {/* Featured Journals 4-Column Section */}
      <FadeIn delay={0.24}>
        <HomeFeaturedJournals />
      </FadeIn>

      {/* Calls for Papers / Special Issues */}
      <FadeIn delay={0.26}>
        <HomeCallsForPapers />
      </FadeIn>

      {/* From Our Research Community */}
      <FadeIn delay={0.28}>
        <HomeResearchCommunity />
      </FadeIn>

      {/* Frequently Asked Questions */}
      <FadeIn delay={0.3}>
        <HomeFaqSection />
      </FadeIn>

      {/* Research Metrics & Newsletter Box */}
      <FadeIn delay={0.32}>
        <HomeMetricsNewsletter />
      </FadeIn>
    </PageShell>
  );
}









