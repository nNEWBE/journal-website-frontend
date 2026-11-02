import { Metadata } from "next";
import { Calendar, Clock, Globe2, Landmark, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { FadeIn } from "@/components/layout/page-transition";
import { JournalCtaPanel, PageHero } from "@/components/site";
import { AboutJournalStory } from "@/components/about/about-journal-story";
import defaults from "@/lib/cms/defaults/about.json";
import { getPageContent } from "@/lib/cms/page-content";

export const metadata: Metadata = {
  title: "About the Journal | GB Journal of Research",
  description:
    "Learn about the mission, scope, double-blind peer review, publishing charter, indexing, and academic stewardship of the Gono Bishwabidyalay Journal of Research.",
};

export default async function AboutPage() {
  const content = await getPageContent(defaults);

  return (
    <PageShell>
      {content.hero.visible && (
        <FadeIn delay={0.05}>
          <PageHero
            section={content.hero}
            ariaLabel="About the journal"
            highlightIcons={[ShieldCheck, Globe2, Calendar, Clock]}
          />
        </FadeIn>
      )}

      <FadeIn delay={0.15}>
        <AboutJournalStory
          order={content._order}
          sections={{
            mission: content.mission,
            scope: content.scope,
            leadership: content.leadership,
            lifecycle: content.lifecycle,
            charter: content.charter,
            indexing: content.indexing,
          }}
        />
      </FadeIn>

      {content.cta.visible && (
        <FadeIn delay={0.05}>
          <JournalCtaPanel
            section={content.cta}
            ariaLabel="Institutional stewardship and submission"
            badgeFallbackIcon={Landmark}
            pillFallbackIcons={[ShieldCheck, Globe2]}
          />
        </FadeIn>
      )}
    </PageShell>
  );
}
