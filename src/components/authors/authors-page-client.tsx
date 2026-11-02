"use client";

import type { ReactNode } from "react";
import {
  Archive,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  FileText,
  FlaskConical,
  Globe2,
  Library,
  Mail,
  MessageSquareText,
  PenLine,
  Scale,
  ShieldCheck,
  UploadCloud,
  Users,
  type LucideIcon,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { FadeIn } from "@/components/layout/page-transition";
import {
  ButtonLink,
  FeatureCard,
  FeatureGrid,
  JournalCtaPanel,
  PageHero,
  PageSection,
  SectionHeader,
  StepList,
} from "@/components/site";
import { articleTypes } from "@/lib/data";
import type { ResolvedPage } from "@/lib/cms/page-content";
import { cmsIcon } from "@/lib/cms/icons";

type AuthorsDefaults = typeof import("@/lib/cms/defaults/authors.json");
export type AuthorsPageContent = ResolvedPage<AuthorsDefaults>;

/** Original per-type icons, used when the CMS icon name is missing or unknown. */
const ARTICLE_TYPE_ICONS: Record<string, LucideIcon> = {
  "Research Article": FlaskConical,
  "Review Article": Library,
  "Case Study": ClipboardCheck,
  "Short Communication": MessageSquareText,
  Perspective: Eye,
  Editorial: PenLine,
  Letter: Mail,
  "Policy Brief": Scale,
};

const PREPARATION_ICONS = [FileText, Eye, Users, BookOpen, ShieldCheck, UploadCloud];
const FORMATTING_ICONS = [BookOpen, UploadCloud, Archive];
const PATHWAY_ICONS = [FileText, ShieldCheck, Users, Scale, Globe2];

function list<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : [];
}

export function AuthorsPageClient({ content }: { content: AuthorsPageContent }) {
  const articleSection = content["article-types"];
  const prepSection = content["preparation-checklist"];
  const pathwaySection = content["editorial-pathway"];
  const formattingSection = content["formatting-specs"];

  const typeDetails = new Map(list(articleSection.meta.types).map((t) => [t.name, t]));
  const fallbackType = articleSection.meta.fallbackType ?? {
    icon: "FileText",
    wordLimit: "",
    description: "",
    structure: "",
  };

  const renderers: Record<string, () => ReactNode> = {
    hero: () => (
      <FadeIn key="hero" delay={0.05}>
        <PageHero section={content.hero} ariaLabel="Author guidelines" eyebrowIcon={FileText} />
      </FadeIn>
    ),

    "article-types": () => (
      <PageSection key="article-types" tone="tint" ariaLabel="Accepted article formats">
        <SectionHeader eyebrow={articleSection.subtitle} title={articleSection.title} intro={articleSection.content} />
        <FeatureGrid columns={4}>
          {articleTypes.map((typeKey, idx) => {
            const detail = typeDetails.get(typeKey) ?? fallbackType;
            return (
              <FeatureCard
                key={typeKey}
                icon={cmsIcon(detail.icon, ARTICLE_TYPE_ICONS[typeKey] ?? FileText)}
                iconStyle="solid"
                eyebrow={String(idx + 1).padStart(2, "0")}
                tag={detail.wordLimit}
                title={typeKey}
                description={detail.description}
                footer={
                  detail.structure && (
                    <p className="text-[10.5px] font-mono text-slate-500">
                      <strong className="text-slate-800 font-semibold block mb-0.5">
                        {articleSection.meta.structureLabel}
                      </strong>
                      {detail.structure}
                    </p>
                  )
                }
              />
            );
          })}
        </FeatureGrid>
      </PageSection>
    ),

    "preparation-checklist": () => (
      <PageSection key="preparation-checklist" id="checklist" ariaLabel="Submission preparation package">
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-24">
            <SectionHeader
              eyebrow={prepSection.subtitle}
              title={prepSection.title}
              intro={prepSection.content}
              className="pb-0 sm:pb-0"
            />

            {list(prepSection.meta.benefits).length > 0 && (
              <ul className="mt-6 bg-slate-50 border border-slate-200/90 p-5 space-y-3 text-xs text-slate-700">
                {list(prepSection.meta.benefits).map((benefit, idx) => (
                  <li key={`${benefit.label}-${idx}`} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>{benefit.label}</strong> {benefit.text}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {prepSection.meta.cta?.label && (
              <div className="mt-8">
                <ButtonLink href={prepSection.meta.cta.href || "/dashboard/submissions/new"} icon={ArrowUpRight}>
                  {prepSection.meta.cta.label}
                </ButtonLink>
              </div>
            )}
          </div>

          <FeatureGrid columns={2}>
            {list(prepSection.meta.items).map((item, idx) => (
              <FeatureCard
                key={`${item.title}-${idx}`}
                icon={cmsIcon(item.icon, PREPARATION_ICONS[idx] ?? FileText)}
                iconStyle="solid"
                eyebrow={String(idx + 1).padStart(2, "0")}
                title={item.title}
                description={item.desc}
                muted
                footer={
                  item.spec && (
                    <p className="text-[11px] font-mono text-slate-500">
                      <strong>{prepSection.meta.specLabel}</strong> {item.spec}
                    </p>
                  )
                }
              />
            ))}
          </FeatureGrid>
        </div>
      </PageSection>
    ),

    "editorial-pathway": () => (
      <PageSection key="editorial-pathway" tone="tint" ariaLabel="Editorial workflow">
        <SectionHeader eyebrow={pathwaySection.subtitle} title={pathwaySection.title} intro={pathwaySection.content} />
        <StepList steps={list(pathwaySection.meta.stages)} fallbackIcons={PATHWAY_ICONS} />
      </PageSection>
    ),

    "formatting-specs": () => (
      <PageSection key="formatting-specs" ariaLabel="Formatting specifications">
        <SectionHeader
          eyebrow={formattingSection.subtitle}
          title={formattingSection.title}
          intro={formattingSection.content}
        />
        <FeatureGrid columns={3}>
          {list(formattingSection.meta.cards).map((card, idx) => (
            <FeatureCard
              key={`${card.title}-${idx}`}
              icon={cmsIcon(card.icon, FORMATTING_ICONS[idx] ?? BookOpen)}
              iconStyle="solid"
              title={card.title}
              description={card.description}
              muted
              footer={card.footnote && <p className="text-[11px] font-mono text-slate-500">{card.footnote}</p>}
            />
          ))}
        </FeatureGrid>
      </PageSection>
    ),

    cta: () => <JournalCtaPanel key="cta" section={content.cta} badgeFallbackIcon={FileText} />,
  };

  return <PageShell>{content._order.map((key) => renderers[key]?.())}</PageShell>;
}
