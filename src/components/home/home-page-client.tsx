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
import { HomeSectionsProvider } from "@/lib/home-sections-context";
import type { PageContentDTO } from "@/lib/api";

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

function toCanonicalKey(key: string): string {
  const k = key.toLowerCase();
  if (k === "featured-research") return "hero-main";
  if (k === "topics" || k === "scope-tracks") return "explore-topics";
  if (k === "calls-for-papers") return "call-for-papers";
  if (k === "faq") return "home-faq";
  return k;
}

import { type Article, type Issue } from "@/lib/data";

interface HomePageClientProps {
  initialSections?: PageContentDTO[];
  articles?: Article[];
  currentIssue?: Issue | null;
}

export function HomePageClient({
  initialSections,
  articles,
  currentIssue,
}: HomePageClientProps) {
  const { isSectionVisible, sections, loaded } = useHomeSectionVisibility(initialSections);

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
      const canonical = toCanonicalKey(s.sectionKey);
      if (!keys.includes(canonical)) {
        keys.push(canonical);
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

  function renderSection(key: string): React.ReactNode {
    const canonical = toCanonicalKey(key);
    switch (canonical) {
      case "hero-main":
        return <HeroShowcase articles={articles} />;
      case "latest-research":
        return <HomeLatestResearch articles={articles} />;
      case "current-issue":
        return <HomeCurrentIssue currentIssue={currentIssue} />;
      case "most-read":
        return <HomeMostRead articles={articles} />;
      case "explore-topics":
        return <HomeExploreTopics />;
      case "featured-journals":
        return <HomeFeaturedJournals />;
      case "call-for-papers":
        return <HomeCallsForPapers />;
      case "research-community":
        return <HomeResearchCommunity />;
      case "home-faq":
        return <HomeFaqSection />;
      case "journal-stats":
        return <HomeMetricsNewsletter />;
      default:
        return null;
    }
  }

  return (
    <PageShell>
      <AdminPageEditBadge pageKey="home" />

      <HomeSectionsProvider sections={sections}>
        {orderedKeys.map((key, idx) => {
          if (!isSectionVisible(key)) return null;
          const ComponentNode = renderSection(key);
          if (!ComponentNode) return null;

          return (
            <FadeIn key={key} delay={Math.min(0.04 * (idx + 1), 0.25)}>
              {ComponentNode}
            </FadeIn>
          );
        })}
      </HomeSectionsProvider>
    </PageShell>
  );
}
