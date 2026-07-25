"use client";

import { HomeCapabilitiesSection } from "@/components/home/home-capabilities-section";
import { HomeWorkflowSection } from "@/components/home/home-workflow-section";
import { HomeStatsSection } from "@/components/home/home-stats-section";
import { HomeCtaSection } from "@/components/home/home-cta-section";

export function HomeJournalStory({ topics = [] }: { topics?: string[] }) {
  return (
    <>
      <HomeCapabilitiesSection topics={topics} />
      <HomeWorkflowSection />
      <HomeStatsSection />
      <HomeCtaSection />
    </>
  );
}
