"use client";

import React, { useMemo } from "react";
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

const CANONICAL_HOME_ORDER = [
  "hero-main",
  "latest-research",
  "current-issue",
  "most-read",
  "explore-topics",
  "featured-journals",
  "call-for-papers",
  "research-community",
  "home-faq",
  "journal-stats",
];

const SECTION_COMPONENTS: Record<string, React.ReactNode> = {
  "hero-main": <HeroShowcase />,
  "featured-research": <HeroShowcase />,
  "latest-research": <HomeLatestResearch />,
  "current-issue": <HomeCurrentIssue />,
  "most-read": <HomeMostRead />,
  "explore-topics": <HomeExploreTopics />,
  "topics": <HomeExploreTopics />,
  "featured-journals": <HomeFeaturedJournals />,
  "call-for-papers": <HomeCallsForPapers />,
  "calls-for-papers": <HomeCallsForPapers />,
  "research-community": <HomeResearchCommunity />,
  "home-faq": <HomeFaqSection />,
  "faq": <HomeFaqSection />,
  "journal-stats": <HomeMetricsNewsletter />,
  "scope-tracks": <HomeExploreTopics />,
};

export default function Home() {
  const { isSectionVisible, sections, loaded } = useHomeSectionVisibility();

  // Compute rendered order: if backend sections are available, use their displayOrder
  const orderedKeys = useMemo(() => {
    if (!loaded || sections.length === 0) {
      return CANONICAL_HOME_ORDER;
    }

    // Sort sections by displayOrder
    const sorted = [...sections].sort(
      (a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999)
    );

    const keys: string[] = [];
    sorted.forEach((s) => {
      const k = s.sectionKey.toLowerCase();
      if (!keys.includes(k) && SECTION_COMPONENTS[k]) {
        keys.push(k);
      }
    });

    // Ensure any standard sections not yet in database are appended in canonical order
    CANONICAL_HOME_ORDER.forEach((k) => {
      if (!keys.includes(k)) {
        keys.push(k);
      }
    });

    return keys;
  }, [sections, loaded]);

  return (
    <PageShell>
      <AdminPageEditBadge pageKey="home" />

      {orderedKeys.map((key, idx) => {
        if (!isSectionVisible(key)) return null;
        const ComponentNode = SECTION_COMPONENTS[key];
        if (!ComponentNode) return null;

        return (
          <FadeIn key={key} delay={Math.min(0.05 * (idx + 1), 0.35)}>
            {ComponentNode}
          </FadeIn>
        );
      })}
    </PageShell>
  );
}

