"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  Archive,
  ArrowUpRight,
  Award,
  BookOpen,
  Calendar,
  Clock,
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
  Mail,
  MapPin,
  PawPrint,
  Pill,
  Scale,
  ShieldCheck,
  Sprout,
  Stethoscope,
  Users,
} from "lucide-react";
import { boardMembers } from "@/lib/data";
import { cmsParagraphs, type ResolvedSection } from "@/lib/cms/page-content";
import { CmsText } from "@/lib/cms/cms-text";
import { cmsIcon } from "@/lib/cms/icons";

type AboutSections = (typeof import("@/lib/cms/defaults/about.json"))["sections"];
type StoryKey =
  | "mission"
  | "benchmarks"
  | "scope"
  | "leadership"
  | "lifecycle"
  | "charter"
  | "indexing"
  | "stewardship";

export type AboutStorySections = {
  [K in StoryKey]: ResolvedSection<AboutSections[K]["meta"]>;
};

function list<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : [];
}

// Original icons, used as fallbacks when an admin leaves an icon name empty or unknown.
const MISSION_VALUE_ICONS = [BookOpen, Landmark, ShieldCheck, Globe];
const BENCHMARK_ICONS = [Clock, Calendar, Link2, Award];
const SCOPE_TOPIC_ICONS = [Stethoscope, Pill, HeartPulse, PawPrint, Sprout, Cpu, Users, Scale];
const LIFECYCLE_ICONS = [FileText, ShieldCheck, Users, Scale, Globe2];
const CHARTER_ICONS = [ShieldCheck, LockOpen, Scale, Archive];
const INDEXING_ICONS = [Link2, GraduationCap, Library, Globe2];
const STEWARDSHIP_PILL_ICONS = [ShieldCheck, Globe2, Link2];
const STEWARDSHIP_PILL_COLORS = ["text-emerald-400", "text-blue-400", "text-amber-300"];
const STEWARDSHIP_CTA_CLASSES = [
  "inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#060e22] px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm",
  "inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors",
];

export function AboutJournalStory({
  sections,
  order,
}: {
  sections: AboutStorySections;
  order: string[];
}) {
  // Extract key editorial leaders for the governance preview section
  const editorialLeaders = boardMembers.slice(0, 4);
  const { mission, benchmarks, scope, leadership, lifecycle, charter, indexing, stewardship } = sections;

  const renderers: Record<string, () => ReactNode> = {
    /* ── Section 1: Academic Mission & Institutional Purpose ── */
    mission: () => (
      <section
        key="mission"
        aria-label="Mission and Purpose"
        className="py-14 sm:py-20 bg-slate-50/50 border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                {mission.subtitle}
              </p>
              <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
                {mission.title}
              </h2>
            </div>
            {mission.meta.link?.label && (
              <Link
                href={mission.meta.link.href}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e40af] hover:underline group"
              >
                <span>{mission.meta.link.label}</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mt-10 items-start">
            <div>
              {mission.meta.quote && (
                <blockquote className="border-l-3 border-[#1e40af] pl-5 py-1">
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

              {list(mission.meta.stats).length > 0 && (
                <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-200 pt-6">
                  {list(mission.meta.stats).map((stat, i) => (
                    <div key={`${stat.label}-${i}`}>
                      <p
                        className={`font-academic lining-nums text-2xl sm:text-3xl font-medium ${
                          stat.highlight ? "text-emerald-700" : "text-slate-950"
                        }`}
                      >
                        {stat.value}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#1e40af] mt-1">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Core Values Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {list(mission.meta.values).map((value, i) => {
                const Icon = cmsIcon(value.icon, MISSION_VALUE_ICONS[i] ?? BookOpen);
                return (
                  <div key={`${value.title}-${i}`} className="bg-white border border-slate-200/90 p-5 shadow-2xs">
                    <span className="flex h-10 w-10 items-center justify-center bg-slate-100 text-[#1e40af] mb-4">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-ui text-sm font-bold text-slate-950">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    ),

    /* ── Section 2: Key Publication Benchmarks ── */
    benchmarks: () => (
      <section
        key="benchmarks"
        aria-label="Publication Benchmarks"
        className="py-12 sm:py-16 bg-white border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {list(benchmarks.meta.items).map((item, i) => {
              const Icon = cmsIcon(item.icon, BENCHMARK_ICONS[i] ?? Clock);
              return (
                <div
                  key={`${item.label}-${i}`}
                  className="bg-slate-50/60 border border-slate-200/90 p-6 flex flex-col justify-between"
                >
                  <div>
                    <span className="flex h-10 w-10 items-center justify-center bg-white border border-slate-200/80 text-[#1e40af] mb-4 shadow-2xs">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="font-academic lining-nums text-3xl font-medium text-slate-950">
                      {item.value}
                    </p>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1e40af]">
                      {item.label}
                    </p>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      {item.subtext}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    ),

    /* ── Section 3: Aims & Scope Across Disciplines ── */
    scope: () => (
      <section
        key="scope"
        aria-label="Aims and Scope"
        className="py-14 sm:py-20 bg-slate-50/40 border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                {scope.subtitle}
              </p>
              <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
                {scope.title}
              </h2>
            </div>
            {scope.content && (
              <p className="text-xs sm:text-sm text-slate-600 max-w-md">
                {scope.content}
              </p>
            )}
          </div>

          {/* 4x2 Discipline Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {list(scope.meta.topics).map((topic, i) => {
              const Icon = cmsIcon(topic.icon, SCOPE_TOPIC_ICONS[i] ?? BookOpen);
              return (
                <div
                  key={`${topic.name}-${i}`}
                  className="bg-white border border-slate-200/90 p-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-2xs transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center bg-slate-100 text-[#1e40af]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-[10px] font-bold font-mono text-slate-400">
                        {topic.count}
                      </span>
                    </div>

                    <h3 className="font-academic text-base sm:text-lg font-medium text-slate-950 mt-4 leading-snug">
                      {topic.name}
                    </h3>

                    <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
                      {topic.description}
                    </p>
                  </div>

                  {scope.meta.topicLink?.label && (
                    <div className="mt-5 pt-4 border-t border-slate-100">
                      <Link
                        href={scope.meta.topicLink.href}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1e40af] hover:underline"
                      >
                        <span>{scope.meta.topicLink.label}</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    ),

    /* ── Section 4: Editorial Leadership & Academic Governance ── */
    leadership: () => (
      <section
        key="leadership"
        aria-label="Editorial Leadership"
        className="py-14 sm:py-20 bg-white border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                {leadership.subtitle}
              </p>
              <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
                {leadership.title}
              </h2>
            </div>
            {leadership.meta.link?.label && (
              <Link
                href={leadership.meta.link.href}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e40af] hover:underline group"
              >
                <span>{leadership.meta.link.label}</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {editorialLeaders.map((member) => (
              <div
                key={member.id}
                className="bg-white border border-slate-200/90 p-5 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 border border-slate-200/80 mb-4">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 25vw"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-400">
                        <Users className="h-10 w-10" />
                      </div>
                    )}
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#0b1b3d]/90 text-white text-[9px] font-bold uppercase tracking-wider">
                      {member.role}
                    </span>
                  </div>

                  <h3 className="font-academic text-base font-bold text-slate-950">
                    {member.name}
                  </h3>
                  <p className="text-[11px] font-medium text-[#1e40af] mt-0.5">
                    {member.title}
                  </p>
                  <p className="text-[10.5px] text-slate-500 mt-1 font-mono">
                    {member.institution}
                  </p>
                  {member.expertise && (
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
                      <span className="font-semibold text-slate-800">{leadership.meta.expertiseLabel}</span>{" "}
                      {member.expertise}
                    </p>
                  )}
                </div>

                {leadership.meta.profileLink?.label && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <Link
                      href={leadership.meta.profileLink.href}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1e40af] hover:underline"
                    >
                      <span>{leadership.meta.profileLink.label}</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    ),

    /* ── Section 5: Editorial & Peer Review Lifecycle ── */
    lifecycle: () => (
      <section
        key="lifecycle"
        aria-label="Editorial Lifecycle"
        className="py-14 sm:py-20 bg-slate-50/50 border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="pb-8 sm:pb-10 border-b border-slate-200/80">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
              {lifecycle.subtitle}
            </p>
            <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
              {lifecycle.title}
            </h2>
            {lifecycle.content && (
              <p className="mt-2.5 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                {lifecycle.content}
              </p>
            )}
          </div>

          {/* 5-Step Process Timeline Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-10">
            {list(lifecycle.meta.steps).map((step, i) => {
              const Icon = cmsIcon(step.icon, LIFECYCLE_ICONS[i] ?? FileText);
              return (
                <div
                  key={`${step.stage}-${i}`}
                  className="bg-white border border-slate-200/90 p-5 flex flex-col justify-between shadow-2xs relative"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="font-mono text-base font-bold text-[#1e40af]">
                        {step.stage}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5">
                        {step.timeline}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-slate-900">
                      <Icon className="h-4 w-4 text-[#1e40af] shrink-0" />
                      <h3 className="font-ui text-sm font-bold leading-tight">
                        {step.title}
                      </h3>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    ),

    /* ── Section 6: Publishing Charter & Ethical Standards ── */
    charter: () => (
      <section
        key="charter"
        aria-label="Publishing Charter"
        className="py-14 sm:py-20 bg-white border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                {charter.subtitle}
              </p>
              <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
                {charter.title}
              </h2>
            </div>
            {charter.meta.link?.label && (
              <Link
                href={charter.meta.link.href}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e40af] hover:underline group"
              >
                <span>{charter.meta.link.label}</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {list(charter.meta.items).map((item, i) => {
              const Icon = cmsIcon(item.icon, CHARTER_ICONS[i] ?? ShieldCheck);
              return (
                <div
                  key={`${item.title}-${i}`}
                  className="bg-white border border-slate-200/90 p-6 flex flex-col justify-between"
                >
                  <div>
                    <span className="flex h-11 w-11 items-center justify-center bg-[#0b1b3d] text-white mb-5">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#1e40af]">
                      {item.subtitle}
                    </p>
                    <h3 className="font-academic text-lg font-medium text-slate-950 mt-1">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    ),

    /* ── Section 7: Indexing, Registries & Permanent Archiving ── */
    indexing: () => (
      <section
        key="indexing"
        aria-label="Indexing and Registries"
        className="py-14 sm:py-20 bg-slate-50/50 border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="pb-8 sm:pb-10 border-b border-slate-200/80">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
              {indexing.subtitle}
            </p>
            <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
              {indexing.title}
            </h2>
            {indexing.content && (
              <p className="mt-2.5 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                {indexing.content}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {list(indexing.meta.registries).map((reg, i) => {
              const Icon = cmsIcon(reg.icon, INDEXING_ICONS[i] ?? Link2);
              return (
                <div
                  key={`${reg.name}-${i}`}
                  className="bg-white border border-slate-200/90 p-6 flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center bg-slate-100 text-[#1e40af]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="inline-block px-2 py-0.5 bg-blue-50 text-[#1e40af] text-[9px] font-bold uppercase tracking-wider border border-blue-100">
                        {reg.badge}
                      </span>
                    </div>

                    <h3 className="font-academic text-xl font-medium text-slate-950 mt-4">
                      {reg.name}
                    </h3>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                      {reg.type}
                    </p>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600">
                      {reg.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    ),

    /* ── Section 8: Institutional Stewardship & Submit Action Box ── */
    stewardship: () => {
      const meta = stewardship.meta;
      const pills = list(meta.pills);
      const ctas = list(meta.ctas);
      return (
        <section
          key="stewardship"
          aria-label="Institutional Stewardship & Submission"
          className="py-14 sm:py-20 bg-white"
        >
          <div className="container-x">
            <div className="relative overflow-hidden bg-[#060e22] text-white border border-slate-800 shadow-[0_20px_50px_rgba(3,8,22,0.45)] p-8 sm:p-12 lg:p-14">
              {/* Top gold-to-blue accent line */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-400 via-blue-500 to-transparent" />

              {/* Ambient background glow */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-600/10 blur-[100px]" />
              <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-amber-500/10 blur-[90px]" />

              <div className="relative grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-10 lg:gap-14 items-center">
                {/* Left Column: Heading, Context & Primary Actions */}
                <div>
                  {stewardship.subtitle && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/25 text-amber-300 text-[10.5px] font-bold uppercase tracking-[0.18em]">
                      <Landmark className="h-3.5 w-3.5" />
                      <span>{stewardship.subtitle}</span>
                    </div>
                  )}

                  <h2 className="mt-4 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.025em] text-white leading-[1.15]">
                    {stewardship.title}
                  </h2>

                  {stewardship.content && (
                    <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                      {stewardship.content}
                    </p>
                  )}

                  {/* Feature Pill Tags */}
                  {pills.length > 0 && (
                    <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
                      {pills.map((pill, i) => {
                        const Icon = cmsIcon(pill.icon, STEWARDSHIP_PILL_ICONS[i] ?? ShieldCheck);
                        const color = STEWARDSHIP_PILL_COLORS[i % STEWARDSHIP_PILL_COLORS.length];
                        return (
                          <span
                            key={`${pill.label}-${i}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold"
                          >
                            <Icon className={`h-3.5 w-3.5 ${color}`} />
                            {pill.label}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Primary Actions */}
                  {ctas.length > 0 && (
                    <div className="mt-8 flex flex-wrap items-center gap-3.5">
                      {ctas.map((cta, i) => (
                        <Link
                          key={`${cta.href}-${i}`}
                          href={cta.href}
                          className={STEWARDSHIP_CTA_CLASSES[i === 0 ? 0 : 1]}
                        >
                          <span>{cta.label}</span>
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column: Elevated Editorial Desk Card */}
                <div className="bg-white/[0.05] border border-white/12 p-6 sm:p-8 backdrop-blur-sm flex flex-col justify-between shadow-2xs">
                  <div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-amber-300">
                        {meta.deskEyebrow}
                      </p>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        {meta.deskTag}
                      </span>
                    </div>

                    <h3 className="mt-3 font-academic text-xl font-medium text-white">
                      {meta.deskTitle}
                    </h3>
                    {meta.deskText && (
                      <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                        {meta.deskText}
                      </p>
                    )}

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

                      {meta.address && (
                        <div className="flex items-start gap-3">
                          <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{meta.addressLabel}</p>
                            <p className="text-xs text-slate-300 mt-0.5">
                              {meta.address}
                            </p>
                          </div>
                        </div>
                      )}

                      {meta.responseText && (
                        <div className="flex items-start gap-3">
                          <Clock className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{meta.responseLabel}</p>
                            <p className="text-xs text-emerald-300 mt-0.5">
                              {meta.responseText}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {meta.deskLink?.label && (
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <Link
                        href={meta.deskLink.href}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 uppercase tracking-wider transition-colors"
                      >
                        <span>{meta.deskLink.label}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
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
    <div className="space-y-0">
      {order.map((key) => (sections[key as StoryKey]?.visible ? renderers[key]?.() : null))}
    </div>
  );
}

export default AboutJournalStory;
