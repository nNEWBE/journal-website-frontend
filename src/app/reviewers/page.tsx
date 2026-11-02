import { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowUpRight,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Clock,
  Eye,
  FileCheck2,
  FileText,
  FlaskConical,
  GraduationCap,
  Lock,
  Mail,
  MapPin,
  Scale,
  ShieldCheck,
  Timer,
  UserCheck,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { FadeIn } from "@/components/layout/page-transition";
import { ReviewersHero } from "@/components/reviewers/reviewers-hero";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import defaults from "@/lib/cms/defaults/reviewers.json";
import { getPageContent } from "@/lib/cms/page-content";
import { CmsText } from "@/lib/cms/cms-text";
import { cmsIcon } from "@/lib/cms/icons";

export const metadata: Metadata = {
  title: "Reviewer Guidelines & Evaluation Rubric | GB Journal of Research",
  description:
    "Explore reviewer expectations, evaluation rubric, confidentiality protocols, and COPE-aligned standards for peer reviewers at the Gono Bishwabidyalay Journal of Research.",
};

const COVENANT_FALLBACK_ICONS = [UserCheck, FlaskConical, Lock, Scale, BookOpen, ShieldCheck];
const METRIC_FALLBACK_ICONS = [UserCheck, Timer, ClipboardList];
const STAGE_FALLBACK_ICONS = [Mail, UserCheck, Eye, ClipboardList, ShieldCheck];
const CRITERION_FALLBACK_ICONS = [Award, FlaskConical, ShieldCheck, BookOpen, FileText];
const BENEFIT_FALLBACK_ICONS = [Award, Users, FileText, ArrowUpRight];
const ELIGIBILITY_FALLBACK_ICONS = [GraduationCap, FileCheck2, ShieldCheck];

const METRIC_TONE_CLASSES: Record<string, string> = {
  default: "font-mono font-bold text-slate-900",
  accent: "font-mono font-bold text-[#1e40af]",
};

const ELIGIBILITY_TONE_CLASSES: Record<string, string> = {
  amber: "h-3.5 w-3.5 text-amber-300",
  blue: "h-3.5 w-3.5 text-blue-400",
  emerald: "h-3.5 w-3.5 text-emerald-400",
};

function asArray<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : [];
}

function CtaLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  if (/^(https?:|mailto:|tel:|#)/.test(href)) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default async function ReviewersPage() {
  const content = await getPageContent(defaults);
  const { hero, covenant, lifecycle, rubric, recognition } = content;
  const joinPanel = content["join-panel"];

  const renderers: Record<string, () => ReactNode> = {
    /* ── 1. Hero Section ── */
    hero: () => (
      <FadeIn key="hero" delay={0.05}>
        <ReviewersHero section={hero} />
      </FadeIn>
    ),

    /* ── 2. The Six Reviewer Commitments (Covenant) ── */
    covenant: () => (
      <section
        key="covenant"
        aria-label="Reviewer Covenant"
        className="py-14 sm:py-20 bg-[#fbfcff] border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                {covenant.subtitle}
              </p>
              <h2 className="mt-2 font-academic text-2xl sm:text-3xl lg:text-[2.5rem] font-medium tracking-[-0.02em] text-slate-950">
                {covenant.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              {covenant.content}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {asArray(covenant.meta.principles).map((principle, idx) => {
              const Icon = cmsIcon(principle.icon, COVENANT_FALLBACK_ICONS[idx] ?? ShieldCheck);
              return (
                <div
                  key={`${principle.number}-${idx}`}
                  className="bg-white border border-slate-200/90 p-6 sm:p-7 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="font-mono text-xs font-bold text-[#1e40af]">
                        {principle.number}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {principle.subtitle}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-slate-100 text-[#1e40af]">
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <h3 className="font-academic text-base sm:text-lg font-medium text-slate-950 leading-snug">
                        {principle.title}
                      </h3>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-slate-600">
                      {principle.description}
                    </p>
                  </div>

                  {covenant.meta.complianceLabel && (
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{covenant.meta.complianceLabel}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    ),

    /* ── 3. The 5-Stage Peer Review Lifecycle ── */
    lifecycle: () => (
      <section
        key="lifecycle"
        aria-label="Peer Review Lifecycle"
        className="py-14 sm:py-20 bg-white border-b border-slate-200/80"
      >
        <div className="container-x grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 lg:gap-14 items-start">
          {/* Left Column: Timeline Overview & Metrics */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                {lifecycle.subtitle}
              </p>
              <h2 className="mt-2 font-academic text-2xl sm:text-3xl lg:text-[2.25rem] font-medium tracking-[-0.02em] text-slate-950">
                {lifecycle.title}
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {lifecycle.content}
              </p>
            </div>

            <div className="bg-slate-50/80 border border-slate-200/90 divide-y divide-slate-200/80 text-xs">
              {asArray(lifecycle.meta.metrics).map((metric, idx) => {
                const Icon = cmsIcon(metric.icon, METRIC_FALLBACK_ICONS[idx] ?? ClipboardList);
                return (
                  <div key={`${metric.label}-${idx}`} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 text-[#1e40af]" />
                      <span className="font-medium text-slate-700">{metric.label}</span>
                    </div>
                    <span className={METRIC_TONE_CLASSES[metric.tone] ?? METRIC_TONE_CLASSES.default}>
                      {metric.value}
                    </span>
                  </div>
                );
              })}
            </div>

            {(lifecycle.meta.guaranteeTitle || lifecycle.meta.guaranteeText) && (
              <div className="p-4 bg-blue-50/60 border border-blue-100 text-xs text-[#1e40af] leading-relaxed">
                {lifecycle.meta.guaranteeTitle && (
                  <span className="font-bold block mb-1">{lifecycle.meta.guaranteeTitle}</span>
                )}
                {lifecycle.meta.guaranteeText}
              </div>
            )}
          </div>

          {/* Right Column: 5 Sequential Timeline Cards */}
          <div className="space-y-4">
            {asArray(lifecycle.meta.stages).map((phase, idx) => {
              const Icon = cmsIcon(phase.icon, STAGE_FALLBACK_ICONS[idx] ?? ShieldCheck);
              return (
                <div
                  key={`${phase.step}-${idx}`}
                  className="bg-white border border-slate-200/90 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-start gap-5 shadow-2xs hover:border-slate-300 transition-all"
                >
                  <div className="flex sm:flex-col items-center sm:items-center justify-between sm:justify-start gap-2 shrink-0">
                    <span className="flex h-11 w-11 items-center justify-center bg-[#0b1b3d] text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {lifecycle.meta.stepLabel} {phase.step}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <h3 className="font-academic text-base sm:text-lg font-medium text-slate-950">
                        {phase.title}
                      </h3>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10.5px] font-mono font-semibold border border-slate-200/80">
                        {phase.timeframe}
                      </span>
                    </div>
                    <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {phase.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    ),

    /* ── 4. Formal 5-Dimension Evaluation Rubric ── */
    rubric: () => (
      <section
        key="rubric"
        id="rubric"
        aria-label="Evaluation Rubric"
        className="py-14 sm:py-20 bg-[#fbfcff] border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                {rubric.subtitle}
              </p>
              <h2 className="mt-2 font-academic text-2xl sm:text-3xl lg:text-[2.5rem] font-medium tracking-[-0.02em] text-slate-950">
                {rubric.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              {rubric.content}
            </p>
          </div>

          {/* Rubric Table Container */}
          <div className="mt-10 bg-white border border-slate-300 shadow-2xs overflow-hidden">
            {/* Header */}
            <div className="bg-[#0b1b3d] text-white px-5 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-white/10 text-amber-300">
                  <ClipboardList className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-academic text-lg sm:text-xl font-medium text-white">
                    {rubric.meta.scorecardTitle}
                  </h3>
                  <p className="text-xs text-slate-300 font-normal">
                    {rubric.meta.scorecardDescription}
                  </p>
                </div>
              </div>

              {rubric.meta.scorecardBadge && (
                <div className="shrink-0">
                  <span className="inline-block px-3 py-1 bg-white/10 border border-white/15 text-[11px] font-mono text-slate-200">
                    {rubric.meta.scorecardBadge}
                  </span>
                </div>
              )}
            </div>

            {/* Table Area */}
            <Table minWidth={760}>
              <TableHeader>
                <TableRow className="border-b border-slate-200 bg-slate-100/80 text-[10.5px] font-bold uppercase tracking-wider text-slate-700">
                  <TableHead className="px-6 py-3.5 w-[320px] sm:w-90 text-slate-700">{rubric.meta.columnDimension}</TableHead>
                  <TableHead className="px-6 py-3.5 text-slate-700">{rubric.meta.columnFocus}</TableHead>
                  <TableHead className="px-6 py-3.5 text-right w-64 min-w-55 text-slate-700">{rubric.meta.columnBenchmark}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-200/90">
                {asArray(rubric.meta.criteria).map((criterion, idx) => {
                  const Icon = cmsIcon(criterion.icon, CRITERION_FALLBACK_ICONS[idx] ?? ClipboardList);
                  const isEthics = criterion.ethical === true;
                  return (
                    <TableRow
                      key={`${criterion.num}-${idx}`}
                      className="hover:bg-blue-50/40 border-l-3 border-l-transparent hover:border-l-[#1e40af] transition-all group"
                    >
                      <TableCell className="px-6 py-5 align-top">
                        <div className="flex items-start gap-3.5">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-blue-50/80 border border-blue-100/90 text-[#1e40af] group-hover:bg-[#0b1b3d] group-hover:text-white transition-colors">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                              <span className="inline-block bg-blue-50 text-[#1e40af] px-1.5 py-0.5 text-[9.5px] font-mono font-bold uppercase tracking-wider border border-blue-100 whitespace-nowrap">
                                {rubric.meta.criterionLabel} {criterion.num}
                              </span>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                {criterion.category}
                              </span>
                            </div>
                            <h4 className="font-academic text-[14.5px] font-medium text-slate-950 group-hover:text-[#1e40af] transition-colors leading-snug">
                              {criterion.domain}
                            </h4>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-5 align-top text-xs leading-relaxed text-slate-600 font-medium pr-4">
                        {criterion.focus}
                      </TableCell>
                      <TableCell className="px-6 py-5 align-top text-right">
                        <div className="flex flex-col items-end gap-1.5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold font-mono border shadow-2xs ${isEthics
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-blue-50 text-[#1e40af] border-blue-200"
                              }`}
                          >
                            {isEthics && <ShieldCheck className="h-3 w-3 text-emerald-600" />}
                            <span>{criterion.scale}</span>
                          </span>
                          <p className="text-[10.5px] font-semibold text-slate-500 text-right leading-tight">
                            {criterion.anchor}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Scorecard Footnote */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#1e40af] shrink-0" />
                <span className="text-[11.5px] font-medium">
                  <CmsText text={rubric.meta.footnote} strongClassName="" />
                </span>
              </div>
              <span className="text-[10.5px] font-mono font-bold text-slate-500 uppercase tracking-wider shrink-0">
                {rubric.meta.footnoteTag}
              </span>
            </div>
          </div>
        </div>
      </section>
    ),

    /* ── 5. Reviewer Recognition & Accreditation Benefits ── */
    recognition: () => (
      <section
        key="recognition"
        aria-label="Reviewer Recognition and Benefits"
        className="py-14 sm:py-20 bg-white border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                {recognition.subtitle}
              </p>
              <h2 className="mt-2 font-academic text-2xl sm:text-3xl lg:text-[2.5rem] font-medium tracking-[-0.02em] text-slate-950">
                {recognition.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              {recognition.content}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {asArray(recognition.meta.benefits).map((benefit, idx) => {
              const Icon = cmsIcon(benefit.icon, BENEFIT_FALLBACK_ICONS[idx] ?? Award);
              return (
                <div
                  key={`${benefit.title}-${idx}`}
                  className="bg-slate-50/70 border border-slate-200/90 p-6 flex flex-col justify-between"
                >
                  <div>
                    <span className="flex h-11 w-11 items-center justify-center bg-[#0b1b3d] text-white mb-5">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-academic text-base font-medium text-slate-950 leading-snug">
                      {benefit.title}
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    ),

    /* ── 6. Join the Expert Reviewer Panel & Secretariat CTA ── */
    "join-panel": () => {
      const meta = joinPanel.meta;
      return (
        <section
          key="join-panel"
          aria-label="Join Reviewer Panel and Contact"
          className="py-14 sm:py-20 bg-white"
        >
          <div className="container-x">
            <div className="relative overflow-hidden bg-[#060e22] text-white border border-slate-800 shadow-[0_20px_50px_rgba(3,8,22,0.45)] p-8 sm:p-12 lg:p-14">
              {/* Top gold-to-blue accent line */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-amber-400 via-blue-500 to-transparent" />

              {/* Ambient background glow */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-600/10 blur-[100px]" />
              <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-amber-500/10 blur-[90px]" />

              <div className="relative grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-10 lg:gap-14 items-center">
                {/* Left Column: Reviewer Recruitment */}
                <div>
                  {joinPanel.subtitle && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/25 text-amber-300 text-[10.5px] font-bold uppercase tracking-[0.18em]">
                      <Users className="h-3.5 w-3.5" />
                      <span>{joinPanel.subtitle}</span>
                    </div>
                  )}

                  <h2 className="mt-4 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-tight text-white leading-[1.15]">
                    {joinPanel.title}
                  </h2>

                  <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                    {joinPanel.content}
                  </p>

                  {/* Eligibility Badges */}
                  <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
                    {asArray(meta.eligibility).map((item, idx) => {
                      const Icon = cmsIcon(item.icon, ELIGIBILITY_FALLBACK_ICONS[idx] ?? ShieldCheck);
                      return (
                        <span
                          key={`${item.label}-${idx}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold"
                        >
                          <Icon className={ELIGIBILITY_TONE_CLASSES[item.tone] ?? ELIGIBILITY_TONE_CLASSES.amber} />
                          {item.label}
                        </span>
                      );
                    })}
                  </div>

                  {/* Primary Actions */}
                  <div className="mt-8 flex flex-wrap items-center gap-3.5">
                    {meta.primaryCta?.label && meta.primaryCta?.href && (
                      <CtaLink
                        href={meta.primaryCta.href}
                        className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#060e22] px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                      >
                        <span>{meta.primaryCta.label}</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </CtaLink>
                    )}
                    {meta.secondaryCta?.label && meta.secondaryCta?.href && (
                      <CtaLink
                        href={meta.secondaryCta.href}
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        <span>{meta.secondaryCta.label}</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </CtaLink>
                    )}
                  </div>
                </div>

                {/* Right Column: Editorial Secretariat Contact Card */}
                <div className="bg-white/5 border border-white/12 p-6 sm:p-8 backdrop-blur-sm flex flex-col justify-between shadow-2xs">
                  <div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-amber-300">
                        {meta.contactEyebrow}
                      </p>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        {meta.contactTag}
                      </span>
                    </div>

                    <h3 className="mt-3 font-academic text-xl font-medium text-white">
                      {meta.contactTitle}
                    </h3>
                    <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                      {meta.contactText}
                    </p>

                    <div className="mt-5 space-y-3.5 border-t border-white/10 pt-4 text-xs text-slate-200">
                      {meta.email && (
                        <div className="flex items-start gap-3">
                          <Mail className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{meta.emailLabel}</p>
                            <a
                              href={`mailto:${meta.email}`}
                              className="text-xs text-white hover:text-amber-300 underline mt-0.5 block transition-colors"
                            >
                              {meta.email}
                            </a>
                          </div>
                        </div>
                      )}

                      {meta.officeAddress && (
                        <div className="flex items-start gap-3">
                          <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{meta.officeLabel}</p>
                            <p className="text-xs text-slate-300 mt-0.5">
                              {meta.officeAddress}
                            </p>
                          </div>
                        </div>
                      )}

                      {meta.turnaroundText && (
                        <div className="flex items-start gap-3">
                          <Clock className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{meta.turnaroundLabel}</p>
                            <p className="text-xs text-emerald-300 mt-0.5">
                              {meta.turnaroundText}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {meta.contactLink?.label && meta.contactLink?.href && (
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <CtaLink
                        href={meta.contactLink.href}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 uppercase tracking-wider transition-colors"
                      >
                        <span>{meta.contactLink.label}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </CtaLink>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    },
  };

  return (
    <PageShell>
      {content._order.map((key) => renderers[key]?.())}
    </PageShell>
  );
}
