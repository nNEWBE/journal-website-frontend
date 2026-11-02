"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Archive,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Eye,
  FileText,
  FlaskConical,
  Globe2,
  Library,
  Mail,
  MapPin,
  MessageSquareText,
  PenLine,
  Scale,
  ShieldCheck,
  UploadCloud,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { FadeIn } from "@/components/layout/page-transition";
import { AuthorsHero } from "@/components/authors/authors-hero";
import { articleTypes } from "@/lib/data";
import type { ResolvedPage } from "@/lib/cms/page-content";
import { cmsIcon } from "@/lib/cms/icons";

type AuthorsDefaults = typeof import("@/lib/cms/defaults/authors.json");
export type AuthorsPageContent = ResolvedPage<AuthorsDefaults>;

/** Original per-type icons, used when the CMS icon name is missing or unknown. */
const articleTypeFallbackIcons: Record<string, typeof FlaskConical> = {
  "Research Article": FlaskConical,
  "Review Article": Library,
  "Case Study": ClipboardCheck,
  "Short Communication": MessageSquareText,
  Perspective: Eye,
  Editorial: PenLine,
  Letter: Mail,
  "Policy Brief": Scale,
};

const preparationFallbackIcons = [FileText, Eye, Users, BookOpen, ShieldCheck, UploadCloud];
const formattingFallbackIcons = [BookOpen, UploadCloud, Archive];
const pillFallbackIcons = [Clock, Globe2, ShieldCheck];
const pillIconClasses = ["text-amber-300", "text-blue-400", "text-emerald-400"];
const ctaBannerClasses = [
  "inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#060e22] px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm",
  "inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors",
];

function list<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : [];
}

export function AuthorsPageClient({ content }: { content: AuthorsPageContent }) {
  const articleSection = content["article-types"];
  const prepSection = content["preparation-checklist"];
  const pathwaySection = content["editorial-pathway"];
  const formattingSection = content["formatting-specs"];
  const ctaSection = content["call-for-papers"];

  const typeDetails = new Map(list(articleSection.meta.types).map((t) => [t.name, t]));
  const fallbackType = articleSection.meta.fallbackType ?? {
    icon: "FileText",
    wordLimit: "",
    description: "",
    structure: "",
  };

  const renderers: Record<string, () => ReactNode> = {
    /* ── 1. Hero Header ── */
    hero: () => (
      <FadeIn key="hero" delay={0.05}>
        <AuthorsHero section={content.hero} />
      </FadeIn>
    ),

    /* ── 2. Accepted Manuscript Formats & 8 Article Types ── */
    "article-types": () => (
      <section
        key="article-types"
        aria-label="Accepted Article Formats"
        className="py-14 sm:py-20 bg-[#fbfcff] border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                {articleSection.subtitle}
              </p>
              <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
                {articleSection.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              {articleSection.content}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {articleTypes.map((typeKey, idx) => {
              const detail = typeDetails.get(typeKey) ?? fallbackType;
              const Icon = cmsIcon(detail.icon, articleTypeFallbackIcons[typeKey] ?? FileText);

              return (
                <div
                  key={typeKey}
                  className="bg-white border border-slate-200/90 p-6 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                      <span className="font-mono text-xs font-bold text-[#1e40af]">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 font-mono text-[10px] font-semibold">
                        {detail.wordLimit}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#0b1b3d] text-white">
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <h3 className="font-academic text-base font-medium text-slate-950 group-hover:text-[#1e40af] transition-colors leading-snug">
                        {typeKey}
                      </h3>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-slate-600">
                      {detail.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-100 bg-slate-50 p-2.5 text-[10.5px] text-slate-500 font-mono">
                    <strong className="text-slate-800 font-semibold block mb-0.5">{articleSection.meta.structureLabel}</strong>
                    {detail.structure}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    ),

    /* ── 3. 6-Item Manuscript Preparation Package ── */
    "preparation-checklist": () => (
      <section
        key="preparation-checklist"
        id="checklist"
        aria-label="Submission Preparation Package"
        className="py-14 sm:py-20 bg-white border-b border-slate-200/80 scroll-mt-20"
      >
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-16 items-start">
            {/* Left Column: Guidance Summary */}
            <div className="lg:sticky lg:top-24">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                {prepSection.subtitle}
              </p>
              <h2 className="mt-2 font-academic text-3xl sm:text-4xl font-medium tracking-[-0.02em] text-slate-950">
                {prepSection.title}
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {prepSection.content}
              </p>

              <div className="mt-6 bg-slate-50 border border-slate-200/90 p-5 space-y-3 text-xs text-slate-700">
                {list(prepSection.meta.benefits).map((benefit, idx) => (
                  <div key={`${benefit.label}-${idx}`} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>{benefit.label}</strong> {benefit.text}</span>
                  </div>
                ))}
              </div>

              {prepSection.meta.cta?.label && (
                <div className="mt-8">
                  <Link
                    href={prepSection.meta.cta.href || "/dashboard/submissions/new"}
                    className="inline-flex items-center gap-2 bg-[#0b1b3d] hover:bg-[#162c60] text-white px-6 py-3 text-xs font-semibold uppercase tracking-wider transition-colors shadow-2xs"
                  >
                    <span>{prepSection.meta.cta.label}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Right Column: 6 Checklist Cards */}
            <div className="space-y-4">
              {list(prepSection.meta.items).map((item, idx) => {
                const Icon = cmsIcon(item.icon, preparationFallbackIcons[idx] ?? FileText);
                return (
                  <div
                    key={`${item.title}-${idx}`}
                    className="bg-slate-50/70 border border-slate-200/90 p-5 flex flex-col sm:flex-row sm:items-start gap-4 shadow-2xs hover:border-slate-300 transition-all group"
                  >
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono font-bold text-xs text-[#1e40af] bg-blue-50 border border-blue-200 px-2 py-1">
                        0{idx + 1}
                      </span>
                      <span className="flex h-9 w-9 items-center justify-center bg-[#0b1b3d] text-white shrink-0">
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-academic text-base font-medium text-slate-950 group-hover:text-[#1e40af] transition-colors">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">
                        {item.desc}
                      </p>
                      <p className="mt-2 text-[11px] font-mono text-slate-500 bg-white border border-slate-200/80 px-2.5 py-1 inline-block">
                        <strong>{prepSection.meta.specLabel}</strong> {item.spec}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    ),

    /* ── 4. The 4-Stage Editorial & Publication Pathway ── */
    "editorial-pathway": () => (
      <section
        key="editorial-pathway"
        aria-label="Editorial Workflow"
        className="py-14 sm:py-20 bg-[#fbfcff] border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                {pathwaySection.subtitle}
              </p>
              <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
                {pathwaySection.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              {pathwaySection.content}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {list(pathwaySection.meta.stages).map((stage, idx) => (
              <div
                key={`${stage.step}-${idx}`}
                className="bg-white border border-slate-200/90 p-6 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <span className="font-mono text-xs font-bold text-[#1e40af] bg-blue-50 border border-blue-100 px-2 py-0.5">
                      {pathwaySection.meta.stagePrefix} {stage.step}
                    </span>
                    <span className="font-mono text-[10.5px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200">
                      {stage.timeline}
                    </span>
                  </div>

                  <h3 className="font-academic text-base sm:text-lg font-medium text-slate-950 leading-snug">
                    {stage.title}
                  </h3>

                  <p className="mt-3 text-xs leading-relaxed text-slate-600">
                    {stage.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-[#1e40af]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{pathwaySection.meta.checkLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),

    /* ── 5. Technical Formatting & Citation Specifications ── */
    "formatting-specs": () => (
      <section
        key="formatting-specs"
        aria-label="Formatting Specifications"
        className="py-14 sm:py-20 bg-white border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                {formattingSection.subtitle}
              </p>
              <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
                {formattingSection.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              {formattingSection.content}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {list(formattingSection.meta.cards).map((card, idx) => {
              const Icon = cmsIcon(card.icon, formattingFallbackIcons[idx] ?? BookOpen);
              return (
                <div
                  key={`${card.title}-${idx}`}
                  className="bg-slate-50/70 border border-slate-200/90 p-6 flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <span className="flex h-10 w-10 items-center justify-center bg-[#0b1b3d] text-white mb-4">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-academic text-base sm:text-lg font-medium text-slate-950">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {card.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] font-mono text-slate-500">
                    {card.footnote}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    ),

    /* ── 6. Call for Manuscripts CTA ── */
    "call-for-papers": () => (
      <section
        key="call-for-papers"
        aria-label="Call for Papers CTA"
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
              {/* Left Column: Call for Papers */}
              <div>s
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/25 text-amber-300 text-[10.5px] font-bold uppercase tracking-[0.18em]">
                  <FileText className="h-3.5 w-3.5" />
                  <span>{ctaSection.subtitle}</span>
                </div>

                <h2 className="mt-4 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-tight text-white leading-[1.15]">
                  {ctaSection.title}
                </h2>

                <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  {ctaSection.content}
                </p>

                {/* Feature Pill Tags */}
                <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
                  {list(ctaSection.meta.pills).map((pill, idx) => {
                    const Icon = cmsIcon(pill.icon, pillFallbackIcons[idx] ?? ShieldCheck);
                    return (
                      <span
                        key={`${pill.label}-${idx}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold"
                      >
                        <Icon className={`h-3.5 w-3.5 ${pillIconClasses[idx % pillIconClasses.length]}`} />
                        {pill.label}
                      </span>
                    );
                  })}
                </div>

                {/* Primary Actions */}
                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  {list(ctaSection.meta.ctas).map((cta, idx) => (
                    <Link
                      key={`${cta.label}-${idx}`}
                      href={cta.href || "#"}
                      className={ctaBannerClasses[idx] ?? ctaBannerClasses[ctaBannerClasses.length - 1]}
                    >
                      <span>{cta.label}</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right Column: Editorial Secretariat Contact Card */}
              <div className="bg-white/5 border border-white/12 p-6 sm:p-8 backdrop-blur-sm flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-amber-300">
                      {ctaSection.meta.contactEyebrow}
                    </p>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      {ctaSection.meta.contactTag}
                    </span>
                  </div>

                  <h3 className="mt-3 font-academic text-xl font-medium text-white">
                    {ctaSection.meta.contactTitle}
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    {ctaSection.meta.contactText}
                  </p>

                  <div className="mt-5 space-y-3.5 border-t border-white/10 pt-4 text-xs text-slate-200">
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{ctaSection.meta.emailLabel}</p>
                        <a
                          href={`mailto:${ctaSection.meta.email}`}
                          className="text-xs text-white hover:text-amber-300 underline mt-0.5 block transition-colors"
                        >
                          {ctaSection.meta.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{ctaSection.meta.locationLabel}</p>
                        <p className="text-xs text-slate-300 mt-0.5">
                          {ctaSection.meta.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {ctaSection.meta.contactLink?.label && (
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <Link
                      href={ctaSection.meta.contactLink.href || "/contact"}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 uppercase tracking-wider transition-colors"
                    >
                      <span>{ctaSection.meta.contactLink.label}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    ),
  };

  return <PageShell>{content._order.map((key) => renderers[key]?.())}</PageShell>;
}
