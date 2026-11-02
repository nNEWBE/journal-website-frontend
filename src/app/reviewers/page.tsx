import { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Award,
  BookOpen,
  ClipboardList,
  Clock,
  Eye,
  FileCheck2,
  FileText,
  FlaskConical,
  GraduationCap,
  Lock,
  Mail,
  Scale,
  ShieldCheck,
  UserCheck,
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
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import defaults from "@/lib/cms/defaults/reviewers.json";
import { getPageContent } from "@/lib/cms/page-content";
import { CmsText } from "@/lib/cms/cms-text";
import { cmsIcon } from "@/lib/cms/icons";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Reviewer Guidelines & Evaluation Rubric | GB Journal",
  description:
    "Reviewer expectations, evaluation rubric, confidentiality protocols and COPE-aligned standards for peer reviewers at the Gono Bishwabidyalay Journal of Research.",
};

const COVENANT_FALLBACK_ICONS = [UserCheck, FlaskConical, Lock, Scale, BookOpen, ShieldCheck];
const STAGE_FALLBACK_ICONS = [Mail, UserCheck, Eye, ClipboardList, ShieldCheck];
const CRITERION_FALLBACK_ICONS = [Award, FlaskConical, ShieldCheck, BookOpen, FileText];
const BENEFIT_FALLBACK_ICONS = [Award, Users, FileText];

function asArray<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : [];
}

export default async function ReviewersPage() {
  const content = await getPageContent(defaults);
  const { hero, covenant, lifecycle, rubric, recognition, cta } = content;

  const renderers: Record<string, () => ReactNode> = {
    hero: () => (
      <FadeIn key="hero" delay={0.05}>
        <PageHero
          section={hero}
          ariaLabel="Reviewer Guidelines"
          eyebrowIcon={Eye}
          highlightIcons={[ShieldCheck, Clock, Scale]}
        />
      </FadeIn>
    ),

    covenant: () => (
      <PageSection key="covenant" tone="tint" ariaLabel="Reviewer covenant">
        <SectionHeader eyebrow={covenant.subtitle} title={covenant.title} intro={covenant.content} />
        <FeatureGrid columns={3}>
          {asArray(covenant.meta.principles).map((principle, idx) => (
            <FeatureCard
              key={`${principle.number}-${idx}`}
              icon={cmsIcon(principle.icon, COVENANT_FALLBACK_ICONS[idx] ?? ShieldCheck)}
              eyebrow={principle.number}
              tag={principle.subtitle}
              title={principle.title}
              description={principle.description}
            />
          ))}
        </FeatureGrid>
      </PageSection>
    ),

    lifecycle: () => (
      <PageSection key="lifecycle" tone="white" ariaLabel="Peer review lifecycle">
        <SectionHeader
          eyebrow={lifecycle.subtitle}
          title={lifecycle.title}
          intro={lifecycle.content}
          aside={
            (lifecycle.meta.guaranteeTitle || lifecycle.meta.guaranteeText) && (
              <div className="max-w-sm shrink-0 border border-blue-100 bg-blue-50/60 p-4 text-xs leading-relaxed text-gb-accent">
                {lifecycle.meta.guaranteeTitle && (
                  <span className="mb-1 block font-bold">{lifecycle.meta.guaranteeTitle}</span>
                )}
                {lifecycle.meta.guaranteeText}
              </div>
            )
          }
        />
        <StepList steps={asArray(lifecycle.meta.stages)} fallbackIcons={STAGE_FALLBACK_ICONS} />
      </PageSection>
    ),

    rubric: () => (
      <PageSection key="rubric" id="rubric" tone="tint" ariaLabel="Evaluation rubric">
        <SectionHeader eyebrow={rubric.subtitle} title={rubric.title} intro={rubric.content} />

        <div className="bg-white border border-slate-300 shadow-2xs overflow-hidden">
          <div className="bg-gb-navy text-white px-5 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-white/10 text-amber-300">
                <ClipboardList className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="font-academic text-lg sm:text-xl font-medium text-white">
                  {rubric.meta.scorecardTitle}
                </h3>
                {rubric.meta.scorecardDescription && (
                  <p className="text-xs text-slate-300">{rubric.meta.scorecardDescription}</p>
                )}
              </div>
            </div>
            {rubric.meta.scorecardBadge && (
              <span className="shrink-0 px-3 py-1 bg-white/10 border border-white/15 text-[11px] font-mono text-slate-200">
                {rubric.meta.scorecardBadge}
              </span>
            )}
          </div>

          <Table minWidth={760}>
            <TableHeader>
              <TableRow className="border-b border-slate-200 bg-slate-100/80 text-[10.5px] font-bold uppercase tracking-wider text-slate-700">
                <TableHead className="px-6 py-3.5 w-90 text-slate-700">{rubric.meta.columnDimension}</TableHead>
                <TableHead className="px-6 py-3.5 text-slate-700">{rubric.meta.columnFocus}</TableHead>
                <TableHead className="px-6 py-3.5 text-right w-64 min-w-55 text-slate-700">
                  {rubric.meta.columnBenchmark}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-200/90">
              {asArray(rubric.meta.criteria).map((criterion, idx) => {
                const Icon = cmsIcon(criterion.icon, CRITERION_FALLBACK_ICONS[idx] ?? ClipboardList);
                const isEthics = criterion.ethical === true;
                return (
                  <TableRow
                    key={`${criterion.num}-${idx}`}
                    className="group border-l-3 border-l-transparent transition-colors hover:border-l-gb-accent hover:bg-blue-50/40"
                  >
                    <TableCell className="px-6 py-5 align-top">
                      <div className="flex items-start gap-3.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-blue-50/80 border border-blue-100/90 text-gb-accent transition-colors group-hover:bg-gb-navy group-hover:text-white">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="mb-1 flex flex-wrap items-center gap-1.5">
                            <span className="whitespace-nowrap border border-blue-100 bg-blue-50 px-1.5 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-wider text-gb-accent">
                              {[rubric.meta.criterionLabel, criterion.num].filter(Boolean).join(" ")}
                            </span>
                            <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              {criterion.category}
                            </span>
                          </div>
                          <h4 className="font-academic text-[14.5px] font-medium leading-snug text-slate-950 transition-colors group-hover:text-gb-accent">
                            {criterion.domain}
                          </h4>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5 pr-4 align-top text-xs font-medium leading-relaxed text-slate-600">
                      {criterion.focus}
                    </TableCell>
                    <TableCell className="px-6 py-5 align-top text-right">
                      <div className="flex flex-col items-end gap-1.5">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 border px-3 py-1 font-mono text-[11px] font-bold shadow-2xs",
                            isEthics
                              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                              : "border-blue-200 bg-blue-50 text-gb-accent"
                          )}
                        >
                          {isEthics && <ShieldCheck className="h-3 w-3 text-emerald-600" />}
                          <span>{criterion.scale}</span>
                        </span>
                        <p className="text-right text-[10.5px] font-semibold leading-tight text-slate-500">
                          {criterion.anchor}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {rubric.meta.footnote && (
            <div className="flex items-center gap-2 border-t border-slate-200 bg-slate-50 px-6 py-3.5 text-xs text-slate-600">
              <ShieldCheck className="h-4 w-4 shrink-0 text-gb-accent" />
              <span className="text-[11.5px] font-medium">
                <CmsText text={rubric.meta.footnote} strongClassName="text-slate-900 font-semibold" />
              </span>
            </div>
          )}
        </div>
      </PageSection>
    ),

    recognition: () => (
      <PageSection key="recognition" tone="white" ariaLabel="Reviewer recognition">
        <SectionHeader eyebrow={recognition.subtitle} title={recognition.title} intro={recognition.content} />
        <FeatureGrid columns={3}>
          {asArray(recognition.meta.benefits).map((benefit, idx) => (
            <FeatureCard
              key={`${benefit.title}-${idx}`}
              muted
              iconStyle="solid"
              icon={cmsIcon(benefit.icon, BENEFIT_FALLBACK_ICONS[idx] ?? Award)}
              title={benefit.title}
              description={benefit.description}
            />
          ))}
        </FeatureGrid>
      </PageSection>
    ),

    cta: () => (
      <JournalCtaPanel
        key="cta"
        section={cta}
        ariaLabel="Join the reviewer panel"
        badgeFallbackIcon={Users}
        pillFallbackIcons={[GraduationCap, FileCheck2, ShieldCheck]}
      />
    ),
  };

  return <PageShell>{content._order.map((key) => renderers[key]?.())}</PageShell>;
}
