"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  Archive,
  ArrowUpRight,
  BookOpen,
  Globe2,
  Landmark,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { ResolvedSection } from "@/lib/cms/page-content";
import { CmsText } from "@/lib/cms/cms-text";
import { cmsIcon } from "@/lib/cms/icons";
import type defaults from "@/lib/cms/defaults/policies.json";

type HeroMeta = (typeof defaults)["sections"]["hero"]["meta"];

const HIGHLIGHT_FALLBACK_ICONS = [ShieldCheck, Globe2, Archive];
const CTA_FALLBACK_ICONS = [ArrowUpRight, BookOpen, Users];
const SECONDARY_CTA_CLASSES = [
  "inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-5 py-3 text-xs font-semibold tracking-wide transition-colors",
  "inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 px-5 py-3 text-xs font-semibold tracking-wide transition-colors",
];
const SPEC_VALUE_CLASSES: Record<string, string> = {
  default: "font-semibold text-slate-900",
  mono: "font-mono font-bold text-[#1e40af]",
  success: "font-semibold text-emerald-700",
};

function isPlainAnchor(href: string) {
  return (
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    /^https?:\/\//.test(href)
  );
}

export function PoliciesHero({ section }: { section: ResolvedSection<HeroMeta> }) {
  const meta = section.meta;
  const highlights = Array.isArray(meta.highlights) ? meta.highlights : [];
  const ctas = Array.isArray(meta.ctas) ? meta.ctas : [];
  const specs = Array.isArray(meta.specs) ? meta.specs : [];

  return (
    <section
      aria-label="Editorial Policies Hero"
      className="border-b border-slate-200/90 bg-white py-12 sm:py-16 lg:py-20"
    >
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-10 lg:gap-14 items-start">
          {/* Left Column: Heading & Narrative */}
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              {section.subtitle && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-[#1e40af] text-[10px] font-bold uppercase tracking-[0.16em] border border-slate-200/80">
                  <Scale className="h-3.5 w-3.5" />
                  {section.subtitle}
                </span>
              )}
              {meta.institution && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                  <Landmark className="h-3.5 w-3.5 text-slate-400" />
                  {meta.institution}
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
            {highlights.length > 0 && (
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
            )}

            {/* Action Buttons */}
            {ctas.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {ctas.map((cta, idx) => {
                  const href = cta.href || "#";
                  let className: string;
                  let children: ReactNode;
                  if (idx === 0) {
                    const Icon = cmsIcon(cta.icon, ArrowUpRight);
                    className =
                      "inline-flex items-center gap-2 bg-[#0b1b3d] hover:bg-[#162c60] text-white px-5 py-3 text-xs font-semibold tracking-wide transition-colors";
                    children = (
                      <>
                        <span>{cta.label}</span>
                        <Icon className="h-3.5 w-3.5" />
                      </>
                    );
                  } else {
                    const Icon = cmsIcon(cta.icon, CTA_FALLBACK_ICONS[idx] ?? BookOpen);
                    className =
                      SECONDARY_CTA_CLASSES[Math.min(idx - 1, SECONDARY_CTA_CLASSES.length - 1)];
                    children = (
                      <>
                        <Icon className="h-3.5 w-3.5 text-slate-500" />
                        <span>{cta.label}</span>
                      </>
                    );
                  }
                  return isPlainAnchor(href) ? (
                    <a key={`${cta.label}-${idx}`} href={href} className={className}>
                      {children}
                    </a>
                  ) : (
                    <Link key={`${cta.label}-${idx}`} href={href} className={className}>
                      {children}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Policy Framework Specification Card */}
          <div className="bg-slate-50/70 border border-slate-200/90 p-6 sm:p-7">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 bg-[#0b1b3d] text-white flex items-center justify-center font-bold text-xs">
                  {meta.cardMonogram}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1e40af]">
                    {meta.cardEyebrow}
                  </p>
                  <p className="font-ui text-sm font-bold text-slate-900">
                    {meta.cardTitle}
                  </p>
                </div>
              </div>
              {meta.cardBadge && (
                <span className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider border border-blue-200">
                  {meta.cardBadge}
                </span>
              )}
            </div>

            {/* Spec Rows */}
            <div className="mt-4 divide-y divide-slate-200/70 text-xs">
              {specs.map((spec, idx) => (
                <div key={`${spec.label}-${idx}`} className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">{spec.label}</span>
                  <span className={SPEC_VALUE_CLASSES[spec.tone] ?? SPEC_VALUE_CLASSES.default}>
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            {(meta.commitmentLabel || meta.commitmentText) && (
              <div className="mt-5 pt-4 border-t border-slate-200/80 bg-white p-3.5 border text-[11px] text-slate-600 leading-relaxed">
                {meta.commitmentLabel && (
                  <span className="font-bold text-slate-900 block mb-0.5">{meta.commitmentLabel}</span>
                )}
                {meta.commitmentText}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
