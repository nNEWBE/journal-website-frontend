import type { ReactNode } from "react";
import {
  Archive,
  BookOpen,
  Cpu,
  FileText,
  Globe,
  Globe2,
  GraduationCap,
  HeartPulse,
  Landmark,
  Library,
  Link2,
  LockOpen,
  PawPrint,
  Pill,
  Scale,
  ShieldCheck,
  Sprout,
  Stethoscope,
  Users,
  type LucideIcon,
} from "lucide-react";
import { FeatureCard, FeatureGrid, PageSection, SectionHeader, StepList } from "@/components/site";
import { cmsParagraphs, type ResolvedSection } from "@/lib/cms/page-content";
import { CmsText } from "@/lib/cms/cms-text";
import { cmsIcon } from "@/lib/cms/icons";

type AboutSections = (typeof import("@/lib/cms/defaults/about.json"))["sections"];
type StoryKey = "mission" | "scope" | "leadership" | "lifecycle" | "charter" | "indexing";

export type AboutStorySections = {
  [K in StoryKey]: ResolvedSection<AboutSections[K]["meta"]>;
};

function list<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : [];
}

function icon(name: string | undefined, fallbacks: LucideIcon[], idx: number) {
  return cmsIcon(name, fallbacks[idx % fallbacks.length]);
}

// Fallback icons, used when an admin leaves an icon name empty or unknown.
const MISSION_VALUE_ICONS = [BookOpen, Landmark, ShieldCheck, Globe];
const SCOPE_TOPIC_ICONS = [Stethoscope, Pill, HeartPulse, PawPrint, Sprout, Cpu, Users, Scale];
const LIFECYCLE_ICONS = [FileText, ShieldCheck, Users, Scale, Globe2];
const CHARTER_ICONS = [ShieldCheck, LockOpen, Scale, Archive];
const INDEXING_ICONS = [Link2, GraduationCap, Library, Globe2];

/**
 * The About page bands between the hero and the closing CTA, rendered in the
 * admin-defined order. Tones alternate tint / white starting with tint.
 */
export function AboutJournalStory({ sections, order }: { sections: AboutStorySections; order: string[] }) {
  const { mission, scope, leadership, lifecycle, charter, indexing } = sections;

  const renderers: Record<StoryKey, (tone: "white" | "tint") => ReactNode> = {
    mission: (tone) => (
      <PageSection key="mission" tone={tone} ariaLabel="Mission and purpose">
        <SectionHeader eyebrow={mission.subtitle} title={mission.title} action={mission.meta.link} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <div>
            {mission.meta.quote && (
              <blockquote className="border-l-3 border-gb-accent pl-5 py-1">
                <p className="font-academic text-xl sm:text-2xl font-medium leading-snug text-slate-950">
                  &ldquo;{mission.meta.quote}&rdquo;
                </p>
              </blockquote>
            )}
            {cmsParagraphs(mission.content).map((paragraph, i) => (
              <p key={i} className={`${i === 0 ? "mt-6" : "mt-4"} text-sm leading-relaxed text-slate-600`}>
                <CmsText text={paragraph} strongClassName="text-slate-900 font-semibold" />
              </p>
            ))}
          </div>
          <FeatureGrid columns={2} className="gap-4">
            {list(mission.meta.values).map((value, i) => (
              <FeatureCard
                key={`${value.title}-${i}`}
                icon={icon(value.icon, MISSION_VALUE_ICONS, i)}
                title={value.title}
                description={value.description}
              />
            ))}
          </FeatureGrid>
        </div>
      </PageSection>
    ),

    scope: (tone) => (
      <PageSection key="scope" tone={tone} ariaLabel="Aims and scope">
        <SectionHeader eyebrow={scope.subtitle} title={scope.title} intro={scope.content} action={scope.meta.link} />
        <FeatureGrid columns={4} className="gap-5">
          {list(scope.meta.topics).map((topic, i) => (
            <FeatureCard
              key={`${topic.name}-${i}`}
              icon={icon(topic.icon, SCOPE_TOPIC_ICONS, i)}
              title={topic.name}
              description={topic.description}
              muted={tone === "white"}
            />
          ))}
        </FeatureGrid>
      </PageSection>
    ),

    // The board itself lives on /editorial-board; this band only points there.
    leadership: (tone) => (
      <PageSection key="leadership" tone={tone} ariaLabel="Editorial leadership">
        <SectionHeader
          eyebrow={leadership.subtitle}
          title={leadership.title}
          intro={leadership.content}
          action={leadership.meta.link}
          className="pb-0 sm:pb-0"
        />
      </PageSection>
    ),

    lifecycle: (tone) => (
      <PageSection key="lifecycle" tone={tone} ariaLabel="Editorial lifecycle">
        <SectionHeader eyebrow={lifecycle.subtitle} title={lifecycle.title} intro={lifecycle.content} />
        <StepList
          fallbackIcons={LIFECYCLE_ICONS}
          steps={list(lifecycle.meta.steps).map((step) => ({
            icon: step.icon,
            stage: step.stage,
            title: step.title,
            timeline: step.timeline,
            text: step.description,
          }))}
        />
      </PageSection>
    ),

    charter: (tone) => (
      <PageSection key="charter" tone={tone} ariaLabel="Publishing charter">
        <SectionHeader eyebrow={charter.subtitle} title={charter.title} action={charter.meta.link} />
        <FeatureGrid columns={4}>
          {list(charter.meta.items).map((item, i) => (
            <FeatureCard
              key={`${item.title}-${i}`}
              icon={icon(item.icon, CHARTER_ICONS, i)}
              iconStyle="solid"
              tag={item.subtitle}
              title={item.title}
              description={item.description}
              muted={tone === "white"}
            />
          ))}
        </FeatureGrid>
      </PageSection>
    ),

    indexing: (tone) => (
      <PageSection key="indexing" tone={tone} ariaLabel="Indexing and registries">
        <SectionHeader eyebrow={indexing.subtitle} title={indexing.title} intro={indexing.content} />
        <FeatureGrid columns={4}>
          {list(indexing.meta.registries).map((reg, i) => (
            <FeatureCard
              key={`${reg.name}-${i}`}
              icon={icon(reg.icon, INDEXING_ICONS, i)}
              eyebrow={reg.type}
              tag={reg.badge}
              title={reg.name}
              description={reg.description}
              muted={tone === "white"}
            />
          ))}
        </FeatureGrid>
      </PageSection>
    ),
  };

  const visible = order.filter(
    (key): key is StoryKey => key in renderers && sections[key as StoryKey]?.visible
  );

  return <>{visible.map((key, idx) => renderers[key](idx % 2 === 0 ? "tint" : "white"))}</>;
}

export default AboutJournalStory;
