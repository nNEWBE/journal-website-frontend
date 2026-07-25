import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  FileCheck2,
  Globe2,
  Landmark,
  Library,
  ShieldCheck,
  Users,
} from "lucide-react";
import { AboutJournalStory } from "@/components/about-journal-story";
import { EditorialPageHeader } from "@/components/editorial-page-header";
import { HeroActionButton } from "@/components/ui/hero-action-button";
import { SupportingTag } from "@/components/ui/badge";
import { PageShell } from "@/components/page-shell";
import { topics } from "@/lib/data";

export default function AboutPage() {
  return (
    <PageShell>
      <EditorialPageHeader
        icon={BookOpen}
        eyebrow="About the journal"
        title="Research grounded in scholarship, open to society"
        description="The Gono Bishwabidyalay Journal of Research is the university's interdisciplinary, peer-reviewed publication for rigorous inquiry, responsible debate, and research with academic and public value."
        actions={
          <>
            <HeroActionButton
              href="/issues/current"
              variant="primary"
              hasArrow
            >
              Read the current issue
            </HeroActionButton>
            <HeroActionButton
              href="/editorial-board"
              variant="secondary"
              icon={Users}
            >
              Meet the editorial board
            </HeroActionButton>
          </>
        }
        supporting={
          <>
            <SupportingTag icon={ShieldCheck}>Double-blind peer review</SupportingTag>
            <SupportingTag icon={Globe2}>Open-access publishing</SupportingTag>
            <SupportingTag icon={CalendarDays}>Published January and July</SupportingTag>
          </>
        }
        frameworkCard={{
          eyebrow: "Official Publication",
          title: "Gono Bishwabidyalay",
          icon: Landmark,
          featured: {
            tag: "Publisher",
            title: "Gono Bishwabidyalay Press",
            badge: "Official",
            icon: Landmark,
          },
          items: [
            {
              label: "Frequency",
              val: "January & July",
              icon: CalendarDays,
            },
            {
              label: "Review Model",
              val: "Double Blind",
              icon: ShieldCheck,
            },
            {
              label: "ISSN Online",
              val: "2959-1082",
              icon: FileCheck2,
            },
            {
              label: "ISSN Print",
              val: "2959-1074",
              icon: Library,
            },
          ],
        }}
      />

      <AboutJournalStory topics={topics} />
    </PageShell>
  );
}
