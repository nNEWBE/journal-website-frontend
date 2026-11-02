import { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Archive,
  CheckCircle2,
  FileText,
  Globe2,
  MessageSquareWarning,
  Scale,
  SearchCheck,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { FadeIn } from "@/components/layout/page-transition";
import {
  FeatureCard,
  FeatureGrid,
  JournalCtaPanel,
  PageHero,
  PageSection,
  SectionHeader,
  StepList,
} from "@/components/site";
import defaults from "@/lib/cms/defaults/policies.json";
import { getPageContent } from "@/lib/cms/page-content";
import { cmsIcon } from "@/lib/cms/icons";

export const metadata: Metadata = {
  title: "Editorial Policies & Publication Ethics | GB Journal",
  description:
    "Publication ethics, double-blind peer review, plagiarism thresholds, authorship standards and open-access licensing of the Gono Bishwabidyalay Journal of Research.",
};

const PILLAR_FALLBACK_ICONS = [ShieldCheck, Globe2];
const SAFEGUARD_FALLBACK_ICONS = [FileText, SearchCheck, Users, Scale, Archive];
const ACTION_FALLBACK_ICONS = [CheckCircle2, MessageSquareWarning, Archive];

function asArray<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : [];
}

export default async function PoliciesPage() {
  const content = await getPageContent(defaults);
  const { hero, "integrity-framework": framework, "policy-directory": directory } = content;
  const { "editorial-safeguards": safeguards, "record-integrity": record, cta } = content;

  const renderers: Record<string, () => ReactNode> = {
    hero: () => (
      <FadeIn key="hero" delay={0.05}>
        <PageHero
          section={hero}
          ariaLabel="Editorial Policies"
          eyebrowIcon={Scale}
          highlightIcons={[ShieldCheck, Globe2, Archive]}
        />
      </FadeIn>
    ),

    "integrity-framework": () => (
      <PageSection key="integrity-framework" tone="tint" ariaLabel="Integrity framework">
        <SectionHeader eyebrow={framework.subtitle} title={framework.title} intro={framework.content} />
        {framework.meta.statement && (
          <blockquote className="mb-6 border-l-3 border-gb-accent bg-white py-3 pl-5 shadow-2xs">
            <p className="font-academic text-lg sm:text-xl font-medium leading-snug text-slate-950">
              {framework.meta.statement}
            </p>
          </blockquote>
        )}
        <FeatureGrid columns={2}>
          {asArray(framework.meta.pillars).map((pillar, idx) => (
            <FeatureCard
              key={`${pillar.title}-${idx}`}
              icon={cmsIcon(pillar.icon, PILLAR_FALLBACK_ICONS[idx] ?? ShieldCheck)}
              tag={pillar.label}
              title={pillar.title}
              description={pillar.description}
            />
          ))}
        </FeatureGrid>
      </PageSection>
    ),

    "policy-directory": () => (
      <PageSection key="policy-directory" id="policy-directory" tone="white" ariaLabel="Policy directory">
        <SectionHeader eyebrow={directory.subtitle} title={directory.title} intro={directory.content} />
        <FeatureGrid columns={2}>
          {asArray(directory.meta.policies).map((policy, idx) => (
            <FeatureCard
              key={policy.id || idx}
              muted
              icon={cmsIcon(policy.icon, FileText)}
              eyebrow={[directory.meta.numberLabel, policy.number].filter(Boolean).join(" ")}
              tag={policy.category}
              title={policy.title}
              description={policy.statement}
            >
              {asArray(policy.compliance).length > 0 && (
                <div className="space-y-2 border-t border-slate-200/70 pt-4">
                  {directory.meta.checklistLabel && (
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {directory.meta.checklistLabel}
                    </p>
                  )}
                  <ul className="space-y-2">
                    {asArray(policy.compliance).map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-slate-600">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </FeatureCard>
          ))}
        </FeatureGrid>
      </PageSection>
    ),

    "editorial-safeguards": () => (
      <PageSection key="editorial-safeguards" tone="tint" ariaLabel="Editorial safeguards">
        <SectionHeader eyebrow={safeguards.subtitle} title={safeguards.title} intro={safeguards.content} />
        <StepList steps={asArray(safeguards.meta.steps)} fallbackIcons={SAFEGUARD_FALLBACK_ICONS} />
      </PageSection>
    ),

    "record-integrity": () => (
      <PageSection key="record-integrity" tone="white" ariaLabel="Corrections and retractions">
        <SectionHeader eyebrow={record.subtitle} title={record.title} intro={record.content} />
        <FeatureGrid columns={3}>
          {asArray(record.meta.actions).map((action, idx) => (
            <FeatureCard
              key={`${action.title}-${idx}`}
              muted
              iconStyle="solid"
              icon={cmsIcon(action.icon, ACTION_FALLBACK_ICONS[idx] ?? CheckCircle2)}
              tag={action.tag}
              title={action.title}
              description={action.description}
            />
          ))}
        </FeatureGrid>
      </PageSection>
    ),

    cta: () => (
      <JournalCtaPanel
        key="cta"
        section={cta}
        ariaLabel="Policy questions and contact"
        badgeFallbackIcon={Scale}
        pillFallbackIcons={[ShieldCheck, Globe2, Archive]}
      />
    ),
  };

  return <PageShell>{content._order.map((key) => renderers[key]?.())}</PageShell>;
}
