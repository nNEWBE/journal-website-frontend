import { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { FadeIn } from "@/components/layout/page-transition";
import { AboutJournalHero } from "@/components/about/about-journal-hero";
import { AboutJournalStory } from "@/components/about/about-journal-story";
import { AdminPageEditBadge } from "@/components/ui/admin-page-edit-badge";

export const metadata: Metadata = {
  title: "About the Journal — GB Journal of Research",
  description:
    "Learn about the mission, scope, double-blind peer review, publishing charter, indexing, and academic stewardship of the Gono Bishwabidyalay Journal of Research.",
};

export default function AboutPage() {
  return (
    <PageShell>
      <FadeIn delay={0.05}>
        <AboutJournalHero />
      </FadeIn>

      <FadeIn delay={0.15}>
        <AboutJournalStory />
      </FadeIn>

      <AdminPageEditBadge pageKey="about" />
    </PageShell>
  );
}
