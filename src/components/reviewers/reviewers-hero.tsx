"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Clock,
  Eye,
  FileCheck2,
  Landmark,
  Scale,
  ShieldCheck,
} from "lucide-react";
import type { ResolvedSection } from "@/lib/cms/page-content";
import { CmsText } from "@/lib/cms/cms-text";
import { cmsIcon } from "@/lib/cms/icons";
import type defaults from "@/lib/cms/defaults/reviewers.json";

type HeroMeta = (typeof defaults)["sections"]["hero"]["meta"];

const FEATURE_FALLBACK_ICONS = [ShieldCheck, Clock, Scale];

const SPEC_TONE_CLASSES: Record<string, string> = {
  default: "font-semibold text-slate-900",
  accent: "font-mono font-bold text-[#1e40af]",
  success: "font-semibold text-emerald-700",
};

const CTA_CLASSES = [
  "inline-flex items-center gap-2 bg-[#0b1b3d] hover:bg-[#162c60] text-white px-5 py-3 text-xs font-semibold tracking-wide transition-colors",
  "inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-5 py-3 text-xs font-semibold tracking-wide transition-colors",
  "inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 px-5 py-3 text-xs font-semibold tracking-wide transition-colors",
];

function CtaLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  const isPlainAnchor = /^(https?:|mailto:|tel:|#)/.test(href);
  if (isPlainAnchor) {
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

export function ReviewersHero({ section }: { section: ResolvedSection<HeroMeta> }) {
  const meta = section.meta;
  const features = Array.isArray(meta.features) ? meta.features : [];
  const ctas = Array.isArray(meta.ctas) ? meta.ctas : [];
  const specs = Array.isArray(meta.specs) ? meta.specs : [];

  return (
    <section
      aria-label="Reviewer Guidelines Hero"
      className="border-b border-slate-200/90 bg-white py-12 sm:py-16 lg:py-20"
    >
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-10 lg:gap-14 items-start">
          {/* Left Column: Heading & Narrative */}
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              {section.subtitle && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-[#1e40af] text-[10px] font-bold uppercase tracking-[0.16em] border border-slate-200/80">
                  <Eye className="h-3.5 w-3.5" />
                  {section.subtitle}
                </span>
              )}
              {meta.institutionLabel && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                  <Landmark className="h-3.5 w-3.5 text-slate-400" />
                  {meta.institutionLabel}
                </span>
              )}
            </div>

            <h1 className="mt-5 font-academic text-3xl sm:text-4xl lg:text-[2.85rem] font-medium leading-[1.12] tracking-[-0.025em] text-slate-950">
              {section.title}
            </h1>

            {section.content && (
              <p className="mt-5 text-sm sm:text-base leading-relaxed text-slate-600 max-w-2xl">
                <CmsText text={section.content} strongClassName="text-slate-900 font-semibold" />
              </p>
            )}

            {/* Quick Feature Badges */}
            {features.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-5">
                {features.map((feature, idx) => {
                  const Icon = cmsIcon(feature.icon, FEATURE_FALLBACK_ICONS[idx] ?? ShieldCheck);
                  return (
                    <div key={`${feature.label}-${idx}`} className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-[#1e40af]" />
                      <span className="font-semibold text-slate-900">{feature.label}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Action Buttons */}
            {ctas.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {ctas.map((cta, idx) => {
                  const className = CTA_CLASSES[Math.min(idx, CTA_CLASSES.length - 1)];
                  if (idx === 0) {
                    return (
                      <CtaLink key={`${cta.label}-${idx}`} href={cta.href} className={className}>
                        <span>{cta.label}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </CtaLink>
                    );
                  }
                  const Icon = idx === 1 ? FileCheck2 : BookOpen;
                  return (
                    <CtaLink key={`${cta.label}-${idx}`} href={cta.href} className={className}>
                      <Icon className="h-3.5 w-3.5 text-slate-500" />
                      <span>{cta.label}</span>
                    </CtaLink>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Reviewer Specification Card */}
          <div className="bg-slate-50/70 border border-slate-200/90 p-6 sm:p-7">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 bg-[#0b1b3d] text-white flex items-center justify-center font-bold text-xs">
                  {meta.specMonogram}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1e40af]">
                    {meta.specEyebrow}
                  </p>
                  <p className="font-ui text-sm font-bold text-slate-900">
                    {meta.specTitle}
                  </p>
                </div>
              </div>
              {meta.specBadge && (
                <span className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider border border-blue-200">
                  {meta.specBadge}
                </span>
              )}
            </div>

            {/* Spec Rows */}
            <div className="mt-4 divide-y divide-slate-200/70 text-xs">
              {specs.map((spec, idx) => (
                <div key={`${spec.label}-${idx}`} className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">{spec.label}</span>
                  <span className={SPEC_TONE_CLASSES[spec.tone] ?? SPEC_TONE_CLASSES.default}>{spec.value}</span>
                </div>
              ))}
            </div>

            {(meta.noteTitle || meta.noteText) && (
              <div className="mt-5 pt-4 border-t border-slate-200/80 bg-white p-3.5 border text-[11px] text-slate-600 leading-relaxed">
                {meta.noteTitle && (
                  <span className="font-bold text-slate-900 block mb-0.5">{meta.noteTitle}</span>
                )}
                {meta.noteText}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
