import { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  Archive,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  FileText,
  Globe2,
  Mail,
  MapPin,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { FadeIn } from "@/components/layout/page-transition";
import { PoliciesHero } from "@/components/policies/policies-hero";
import defaults from "@/lib/cms/defaults/policies.json";
import { getPageContent } from "@/lib/cms/page-content";
import { cmsIcon } from "@/lib/cms/icons";

export const metadata: Metadata = {
  title: "Editorial Policies & Publication Ethics | GB Journal of Research",
  description:
    "Explore the comprehensive ethical framework, double-blind peer review policies, plagiarism thresholds, authorship standards, and open-access licensing of the Gono Bishwabidyalay Journal of Research.",
};

const PILLAR_FALLBACK_ICONS = [ShieldCheck, Globe2];
const CTA_BADGE_ICON_STYLES = [
  { icon: ShieldCheck, className: "h-3.5 w-3.5 text-emerald-400" },
  { icon: Globe2, className: "h-3.5 w-3.5 text-blue-400" },
  { icon: Archive, className: "h-3.5 w-3.5 text-amber-300" },
];
const CTA_BUTTON_CLASSES = [
  "inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#060e22] px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm",
  "inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors",
];

function isPlainAnchor(href: string) {
  return (
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    /^https?:\/\//.test(href)
  );
}

function SmartLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  return isPlainAnchor(href) ? (
    <a href={href} className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function asArray<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : [];
}

export default async function PoliciesPage() {
  const content = await getPageContent(defaults);
  const { hero, "integrity-framework": framework, "policy-directory": directory } = content;
  const { "editorial-safeguards": safeguards, "record-integrity": record, "consultation-cta": cta } = content;

  const renderers: Record<string, () => ReactNode> = {
    /* ── 1. Hero Header ── */
    hero: () => (
      <FadeIn key="hero" delay={0.05}>
        <PoliciesHero section={hero} />
      </FadeIn>
    ),

    /* ── 2. Pre-Publication vs Post-Publication Integrity Architecture ── */
    "integrity-framework": () => (
      <section
        key="integrity-framework"
        aria-label="Integrity Architecture"
        className="py-14 sm:py-20 bg-[#fbfcff] border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 lg:gap-14 items-start">
            <div>
              {framework.subtitle && (
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                  {framework.subtitle}
                </p>
              )}
              <h2 className="mt-2 font-academic text-2xl sm:text-3xl lg:text-[2.25rem] font-medium tracking-[-0.02em] text-slate-950">
                {framework.title}
              </h2>
              {framework.content && (
                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {framework.content}
                </p>
              )}
            </div>

            <div className="space-y-6">
              {framework.meta.statement && (
                <div className="border-l-3 border-[#1e40af] pl-5 py-3 bg-white shadow-2xs">
                  <p className="font-academic text-lg sm:text-xl font-medium text-slate-950 leading-snug">
                    {framework.meta.statement}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {asArray(framework.meta.pillars).map((pillar, idx) => {
                  const Icon = cmsIcon(pillar.icon, PILLAR_FALLBACK_ICONS[idx] ?? ShieldCheck);
                  return (
                    <div key={`${pillar.title}-${idx}`} className="bg-white border border-slate-200/90 p-6 shadow-2xs">
                      <div className="flex items-center gap-2.5 text-[#1e40af] font-bold text-xs uppercase tracking-wider">
                        <Icon className="h-4 w-4 text-[#1e40af]" />
                        <span>{pillar.label}</span>
                      </div>
                      <h3 className="font-academic text-base font-medium text-slate-950 mt-2">
                        {pillar.title}
                      </h3>
                      <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    ),

    /* ── 3. Core Policy Directory (6 Pillar Standards) ── */
    "policy-directory": () => (
      <section
        key="policy-directory"
        id="policy-directory"
        aria-label="Core Policy Directory"
        className="py-14 sm:py-20 bg-white border-b border-slate-200/80 scroll-mt-20"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              {directory.subtitle && (
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                  {directory.subtitle}
                </p>
              )}
              <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
                {directory.title}
              </h2>
            </div>
            {directory.content && (
              <p className="text-xs sm:text-sm text-slate-600 max-w-md">
                {directory.content}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
            {asArray(directory.meta.policies).map((policy, pIdx) => {
              const Icon = cmsIcon(policy.icon, FileText);
              return (
                <div
                  key={policy.id || pIdx}
                  id={policy.id || undefined}
                  className="bg-white border border-slate-200/90 p-6 sm:p-8 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#1e40af] bg-blue-50 px-2.5 py-0.5 border border-blue-100">
                        {policy.category}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-400">
                        {directory.meta.numberLabel} {policy.number}
                      </span>
                    </div>

                    <div className="mt-4 flex items-start gap-3.5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-slate-100 text-[#1e40af] mt-0.5">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-academic text-lg sm:text-xl font-medium text-slate-950 leading-snug">
                          {policy.title}
                        </h3>
                        <p className="mt-2 text-xs font-medium text-slate-700 leading-relaxed">
                          {policy.statement}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {directory.meta.checklistLabel}
                      </p>
                      {asArray(policy.compliance).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs leading-relaxed">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    ),

    /* ── 4. The 5-Checkpoint Editorial Safeguard Workflow ── */
    "editorial-safeguards": () => (
      <section
        key="editorial-safeguards"
        aria-label="Editorial Safeguards"
        className="py-14 sm:py-20 bg-[#fbfcff] border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              {safeguards.subtitle && (
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                  {safeguards.subtitle}
                </p>
              )}
              <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
                {safeguards.title}
              </h2>
            </div>
            {safeguards.content && (
              <p className="text-xs sm:text-sm text-slate-600 max-w-md">
                {safeguards.content}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-10">
            {asArray(safeguards.meta.steps).map((guard, idx) => {
              const Icon = cmsIcon(guard.icon, FileText);
              return (
                <div
                  key={`${guard.step}-${idx}`}
                  className="bg-white border border-slate-200/90 p-5 sm:p-6 flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="font-mono text-xs font-bold text-[#1e40af]">
                        {safeguards.meta.stageLabel} {guard.step}
                      </span>
                      <span className="flex h-7 w-7 items-center justify-center bg-slate-100 text-[#1e40af]">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <h3 className="font-academic text-sm sm:text-base font-medium text-slate-950 mt-4 leading-snug">
                      {guard.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {guard.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    ),

    /* ── 5. Corrections, Expressions of Concern & Retractions Framework ── */
    "record-integrity": () => (
      <section
        key="record-integrity"
        aria-label="Corrections and Retractions"
        className="py-14 sm:py-20 bg-white border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              {record.subtitle && (
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                  {record.subtitle}
                </p>
              )}
              <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
                {record.title}
              </h2>
            </div>
            {record.content && (
              <p className="text-xs sm:text-sm text-slate-600 max-w-md">
                {record.content}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            {asArray(record.meta.actions).map((action, idx) => {
              const Icon = cmsIcon(action.icon, CheckCircle2);
              return (
                <div
                  key={`${action.title}-${idx}`}
                  className="bg-slate-50/70 border border-slate-200/90 p-6 sm:p-7 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
                      <span className="flex h-10 w-10 items-center justify-center bg-[#0b1b3d] text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#1e40af] bg-blue-50 px-2 py-0.5 border border-blue-100">
                        {action.tag}
                      </span>
                    </div>

                    <h3 className="font-academic text-base sm:text-lg font-medium text-slate-950 mt-4 leading-snug">
                      {action.title}
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600">
                      {action.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    ),

    /* ── 6. Policy Consultation & Editorial Secretariat CTA ── */
    "consultation-cta": () => {
      const m = cta.meta;
      const badges = asArray(m.badges);
      const buttons = asArray(m.ctas);
      return (
        <section
          key="consultation-cta"
          aria-label="Policy Consultation and Contact"
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
                {/* Left Column: Policy Consultation */}
                <div>
                  {cta.subtitle && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/25 text-amber-300 text-[10.5px] font-bold uppercase tracking-[0.18em]">
                      <Scale className="h-3.5 w-3.5" />
                      <span>{cta.subtitle}</span>
                    </div>
                  )}

                  <h2 className="mt-4 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-tight text-white leading-[1.15]">
                    {cta.title}
                  </h2>

                  {cta.content && (
                    <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                      {cta.content}
                    </p>
                  )}

                  {/* Badges */}
                  {badges.length > 0 && (
                    <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
                      {badges.map((badge, idx) => {
                        const style = CTA_BADGE_ICON_STYLES[idx % CTA_BADGE_ICON_STYLES.length];
                        const Icon = cmsIcon(badge.icon, style.icon);
                        return (
                          <span
                            key={`${badge.label}-${idx}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold"
                          >
                            <Icon className={style.className} />
                            {badge.label}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Primary Actions */}
                  {buttons.length > 0 && (
                    <div className="mt-8 flex flex-wrap items-center gap-3.5">
                      {buttons.map((button, idx) => (
                        <SmartLink
                          key={`${button.label}-${idx}`}
                          href={button.href || "#"}
                          className={CTA_BUTTON_CLASSES[Math.min(idx, CTA_BUTTON_CLASSES.length - 1)]}
                        >
                          <span>{button.label}</span>
                          <ArrowUpRight className="h-4 w-4" />
                        </SmartLink>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column: Editorial Secretariat Contact Card */}
                <div className="bg-white/5 border border-white/12 p-6 sm:p-8 backdrop-blur-sm flex flex-col justify-between shadow-2xs">
                  <div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-amber-300">
                        {m.cardEyebrow}
                      </p>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        {m.cardTag}
                      </span>
                    </div>

                    <h3 className="mt-3 font-academic text-xl font-medium text-white">
                      {m.cardTitle}
                    </h3>
                    {m.cardDescription && (
                      <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                        {m.cardDescription}
                      </p>
                    )}

                    <div className="mt-5 space-y-3.5 border-t border-white/10 pt-4 text-xs text-slate-200">
                      {m.email && (
                        <div className="flex items-start gap-3">
                          <Mail className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{m.emailLabel}</p>
                            <a
                              href={`mailto:${m.email}`}
                              className="text-xs text-white hover:text-amber-300 underline mt-0.5 block transition-colors"
                            >
                              {m.email}
                            </a>
                          </div>
                        </div>
                      )}

                      {m.location && (
                        <div className="flex items-start gap-3">
                          <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{m.locationLabel}</p>
                            <p className="text-xs text-slate-300 mt-0.5">
                              {m.location}
                            </p>
                          </div>
                        </div>
                      )}

                      {m.response && (
                        <div className="flex items-start gap-3">
                          <Clock className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{m.responseLabel}</p>
                            <p className="text-xs text-emerald-300 mt-0.5">
                              {m.response}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {m.cardLink?.label && (
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <SmartLink
                        href={m.cardLink.href || "#"}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 uppercase tracking-wider transition-colors"
                      >
                        <span>{m.cardLink.label}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </SmartLink>
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

  return <PageShell>{content._order.map((key) => renderers[key]?.())}</PageShell>;
}
