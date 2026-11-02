"use client";

import Link from "next/link";
import {
  Archive,
  ArrowUpRight,
  CalendarDays,
  Globe2,
  Landmark,
  Library,
  Search,
  ShieldCheck,
} from "lucide-react";
import type { ResolvedSection } from "@/lib/cms/page-content";
import { CmsText } from "@/lib/cms/cms-text";
import { cmsIcon } from "@/lib/cms/icons";
import type issuesDefaults from "@/lib/cms/defaults/issues.json";

export type IssuesHeroMeta = typeof issuesDefaults.sections.hero.meta;

const HIGHLIGHT_FALLBACK_ICONS = [CalendarDays, Globe2, ShieldCheck];

interface IssuesHeroProps {
  section: ResolvedSection<IssuesHeroMeta>;
  totalIssues: number;
  totalArticles: number;
  /** `null` when no issue is published yet (shows the CMS fallback text). */
  currentVolume: string | null;
  totalYears: number;
}

export function IssuesHero({
  section,
  totalIssues,
  totalArticles,
  currentVolume,
  totalYears,
}: IssuesHeroProps) {
  const m = section.meta;
  const highlights = Array.isArray(m.highlights) ? m.highlights : [];
  const ctas = Array.isArray(m.ctas) ? m.ctas : [];
  const [primaryCta, secondaryCta, tertiaryCta] = ctas;

  return (
    <section
      aria-label="Issues & Volumes Hero"
      className="border-b border-slate-200/90 bg-white py-12 sm:py-16 lg:py-20"
    >
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-10 lg:gap-14 items-start">
          {/* Left Column: Heading & Narrative */}
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-[#1e40af] text-[10px] font-bold uppercase tracking-[0.16em] border border-slate-200/80">
                <Library className="h-3.5 w-3.5" />
                {section.subtitle}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                <Landmark className="h-3.5 w-3.5 text-slate-400" />
                {m.repositoryNote}
              </span>
            </div>

            <h1 className="mt-5 font-academic text-3xl sm:text-4xl lg:text-[2.85rem] font-medium leading-[1.12] tracking-[-0.025em] text-slate-950">
              {section.title}
            </h1>

            <p className="mt-5 text-sm sm:text-base leading-relaxed text-slate-600 max-w-2xl">
              <CmsText text={section.content} strongClassName="text-slate-900 font-semibold" />
            </p>

            {/* Quick Feature Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-5">
              {highlights.map((item, idx) => {
                const Icon = cmsIcon(item.icon, HIGHLIGHT_FALLBACK_ICONS[idx] ?? ShieldCheck);
                return (
                  <div key={`${item.label}-${idx}`} className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-[#1e40af]" />
                    <span className="font-semibold text-slate-900">{item.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {primaryCta && (
                <Link
                  href={primaryCta.href}
                  className="inline-flex items-center gap-2 bg-[#0b1b3d] hover:bg-[#162c60] text-white px-5 py-3 text-xs font-semibold tracking-wide transition-colors"
                >
                  <span>{primaryCta.label}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              )}
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-5 py-3 text-xs font-semibold tracking-wide transition-colors"
                >
                  <Search className="h-3.5 w-3.5 text-slate-500" />
                  <span>{secondaryCta.label}</span>
                </Link>
              )}
              {tertiaryCta && (
                <a
                  href={tertiaryCta.href}
                  className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 px-5 py-3 text-xs font-semibold tracking-wide transition-colors"
                >
                  <Archive className="h-3.5 w-3.5 text-slate-500" />
                  <span>{tertiaryCta.label}</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Archive Specification Card */}
          <div className="bg-slate-50/70 border border-slate-200/90 p-6 sm:p-7">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 bg-[#0b1b3d] text-white flex items-center justify-center font-bold text-xs">
                  {m.cardMonogram}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1e40af]">
                    {m.cardEyebrow}
                  </p>
                  <p className="font-ui text-sm font-bold text-slate-900">
                    {m.cardTitle}
                  </p>
                </div>
              </div>
              <span className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider border border-blue-200">
                {m.cardBadge}
              </span>
            </div>

            {/* Spec Rows */}
            <div className="mt-4 divide-y divide-slate-200/70 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">{m.currentEditionLabel}</span>
                <span className="font-mono font-bold text-[#1e40af]">{currentVolume ?? m.noCurrentEditionText}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">{m.totalIssuesLabel}</span>
                <span className="font-semibold text-slate-900">{totalIssues} {m.totalIssuesSuffix}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">{m.historicalSpanLabel}</span>
                <span className="font-semibold text-slate-900">{totalYears} {m.historicalSpanSuffix}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">{m.catalogedArticlesLabel}</span>
                <span className="font-semibold text-slate-900">{totalArticles} {m.catalogedArticlesSuffix}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">{m.issnLabel}</span>
                <span className="font-mono font-semibold text-slate-900">{m.issnValue}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">{m.preservationLabel}</span>
                <span className="font-semibold text-emerald-700">{m.preservationValue}</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200/80 bg-white p-3.5 border text-[11px] text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-900 block mb-0.5">{m.guaranteeTitle}</span>
              {m.guaranteeText}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
