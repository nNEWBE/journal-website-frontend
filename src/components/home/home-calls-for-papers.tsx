"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Calendar } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/layout/page-transition";
import { contentApi, type PageContentDTO } from "@/lib/api";

export interface SpecialIssueCall {
  id: string;
  badge: string;
  badgeColor: string;
  barColor: string;
  title: string;
  journal: string;
  journalHref: string;
  deadline: string;
  href: string;
  themeClass: string;
  illustrationType: "network" | "virus" | "protein" | "nano";
}

export const specialIssueCalls: SpecialIssueCall[] = [
  {
    id: "cfp-01",
    badge: "SPECIAL ISSUE",
    badgeColor: "text-[#1e40af]",
    barColor: "bg-[#1e40af]",
    title: "AI-Driven Drug Discovery and Molecular Design",
    journal: "Nexus Journal of Molecular Sciences",
    journalHref: "/issues/current",
    deadline: "31 August 2025",
    href: "/articles",
    themeClass:
      "bg-gradient-to-b from-blue-50/50 via-white to-blue-50/30 border-blue-200/80 hover:border-blue-300",
    illustrationType: "network",
  },
  {
    id: "cfp-02",
    badge: "SPECIAL ISSUE",
    badgeColor: "text-indigo-600",
    barColor: "bg-indigo-600",
    title: "Emerging Antiviral Agents and Resistance Mechanisms",
    journal: "Nexus Journal of Molecular Sciences",
    journalHref: "/issues/current",
    deadline: "15 September 2025",
    href: "/articles",
    themeClass:
      "bg-gradient-to-b from-indigo-50/50 via-white to-indigo-50/30 border-indigo-200/80 hover:border-indigo-300",
    illustrationType: "virus",
  },
  {
    id: "cfp-03",
    badge: "SPECIAL ISSUE",
    badgeColor: "text-teal-600",
    barColor: "bg-teal-600",
    title: "Molecular Dynamics in Allosteric Regulation and Signaling",
    journal: "Nexus Journal of Molecular Sciences",
    journalHref: "/issues/current",
    deadline: "31 October 2025",
    href: "/articles",
    themeClass:
      "bg-gradient-to-b from-teal-50/50 via-white to-teal-50/30 border-teal-200/80 hover:border-teal-300",
    illustrationType: "protein",
  },
  {
    id: "cfp-04",
    badge: "SPECIAL ISSUE",
    badgeColor: "text-amber-700",
    barColor: "bg-amber-600",
    title: "Precision Nanomedicine: Materials, Delivery and Applications",
    journal: "Nexus Journal of Nanoscience and Engineering",
    journalHref: "/issues/current",
    deadline: "30 November 2025",
    href: "/articles",
    themeClass:
      "bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 border-amber-200/80 hover:border-amber-300",
    illustrationType: "nano",
  },
];

function CallIllustration({ type }: { type: SpecialIssueCall["illustrationType"] }) {
  if (type === "network") {
    return (
      <svg
        viewBox="0 0 200 120"
        className="w-full h-28 stroke-blue-400/50 fill-none opacity-60 group-hover:opacity-90 transition-opacity"
      >
        <circle cx="30" cy="80" r="4" className="fill-blue-500/70" />
        <circle cx="70" cy="40" r="5" className="fill-blue-600/70" />
        <circle cx="110" cy="70" r="6" className="fill-blue-500/70" />
        <circle cx="160" cy="30" r="4" className="fill-blue-400/70" />
        <circle cx="180" cy="85" r="5" className="fill-blue-600/70" />
        <circle cx="140" cy="100" r="3" className="fill-blue-400/70" />
        <line x1="30" y1="80" x2="70" y2="40" strokeWidth="1.2" />
        <line x1="70" y1="40" x2="110" y2="70" strokeWidth="1.5" />
        <line x1="110" y1="70" x2="160" y2="30" strokeWidth="1.2" />
        <line x1="110" y1="70" x2="180" y2="85" strokeWidth="1.2" />
        <line x1="110" y1="70" x2="140" y2="100" strokeWidth="1" />
        <line x1="160" y1="30" x2="180" y2="85" strokeWidth="1" />
        <line x1="70" y1="40" x2="160" y2="30" strokeWidth="0.8" strokeDasharray="3 3" />
      </svg>
    );
  }

  if (type === "virus") {
    return (
      <svg
        viewBox="0 0 200 120"
        className="w-full h-28 stroke-indigo-400/50 fill-none opacity-60 group-hover:opacity-90 transition-opacity"
      >
        {/* Main viral capsid */}
        <circle cx="140" cy="65" r="28" className="stroke-indigo-400/60 fill-indigo-100/40" strokeWidth="1.5" />
        <circle cx="140" cy="65" r="18" className="stroke-indigo-500/50" strokeWidth="1" strokeDasharray="2 2" />
        {/* Spikes */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 140 + Math.cos(rad) * 28;
          const y1 = 65 + Math.sin(rad) * 28;
          const x2 = 140 + Math.cos(rad) * 38;
          const y2 = 65 + Math.sin(rad) * 38;
          return (
            <g key={deg}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1.5" />
              <circle cx={x2} cy={y2} r="2.5" className="fill-indigo-500/80" />
            </g>
          );
        })}
        {/* Secondary small capsid */}
        <circle cx="60" cy="85" r="16" className="stroke-indigo-300/50 fill-indigo-50/40" strokeWidth="1.2" />
        <circle cx="50" cy="35" r="10" className="stroke-indigo-300/40 fill-indigo-50/30" strokeWidth="1" />
      </svg>
    );
  }

  if (type === "protein") {
    return (
      <svg
        viewBox="0 0 200 120"
        className="w-full h-28 stroke-teal-500/60 fill-none opacity-60 group-hover:opacity-90 transition-opacity"
      >
        {/* Protein ribbon helix loop */}
        <path
          d="M 30 90 C 60 20, 90 110, 120 40 C 150 -10, 180 80, 190 60"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="stroke-teal-400/60"
        />
        <path
          d="M 40 100 C 70 35, 100 115, 130 50 C 160 5, 185 90, 195 70"
          strokeWidth="1.8"
          strokeLinecap="round"
          className="stroke-teal-600/70"
        />
        <path
          d="M 80 75 Q 110 30 145 65"
          strokeWidth="2"
          strokeDasharray="4 3"
          className="stroke-teal-300/60"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 200 120"
      className="w-full h-28 stroke-amber-500/60 fill-none opacity-60 group-hover:opacity-90 transition-opacity"
    >
      {/* Nanoparticle sphere lattice */}
      <circle cx="150" cy="65" r="30" className="stroke-amber-400/70 fill-amber-100/30" strokeWidth="1.5" />
      <circle cx="150" cy="65" r="22" className="stroke-amber-500/50" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="150" cy="65" r="12" className="stroke-amber-600/60" strokeWidth="1.2" />
      {/* Mesh lines */}
      <line x1="20" y1="100" x2="120" y2="65" strokeWidth="1" className="stroke-amber-300/40" strokeDasharray="3 3" />
      <line x1="40" y1="110" x2="135" y2="85" strokeWidth="1" className="stroke-amber-300/40" strokeDasharray="3 3" />
      <circle cx="40" cy="110" r="3" className="fill-amber-500/60" />
      <circle cx="70" cy="95" r="2.5" className="fill-amber-500/60" />
      <circle cx="100" cy="80" r="3" className="fill-amber-500/60" />
    </svg>
  );
}

export function HomeCallsForPapers() {
  const [section, setSection] = useState<PageContentDTO | null>(null);

  useEffect(() => {
    let active = true;
    contentApi
      .getPublished("home")
      .then((sections) => {
        if (!active) return;
        const s = sections.find((sec) => sec.sectionKey === "call-for-papers");
        if (s) setSection(s);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  if (section && section.published === false) {
    return null;
  }

  const title = section?.title || "Calls for Papers / Special Issues";
  const subtitle =
    section?.subtitle ||
    "We invite researchers to contribute to our ongoing special issues on cutting-edge multidisciplinary topics.";

  return (
    <section
      aria-label="Calls for Papers / Special Issues"
      className="py-14 sm:py-20 bg-white border-b border-slate-200/80"
    >
      <div className="container-x">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 sm:pb-10 border-b border-slate-200/80">
          <div>
            <h2 className="font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
              {title}
            </h2>
            <p className="mt-2.5 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          </div>

          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e40af] hover:underline shrink-0 group"
          >
            <span>View all calls</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4-Column Calls Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 sm:mt-10">
          {specialIssueCalls.map((call) => (
            <StaggerItem
              key={call.id}
              className={`flex flex-col justify-between border p-6 shadow-2xs hover:shadow-md transition-all group ${call.themeClass}`}
            >
              <div>
                {/* Badge and Decorative Bar */}
                <div className="flex items-center gap-2">
                  <div className={`h-0.5 w-5 ${call.barColor}`} />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-[0.14em] ${call.badgeColor}`}
                  >
                    {call.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-4 font-academic text-base sm:text-[17px] font-medium leading-[1.3] text-slate-900 group-hover:text-[#1e40af] transition-colors">
                  <Link href={call.href}>{call.title}</Link>
                </h3>

                {/* Journal Citation Link */}
                <Link
                  href={call.journalHref}
                  className="mt-3.5 block text-xs font-semibold text-[#1e40af] hover:underline"
                >
                  {call.journal}
                </Link>

                {/* High-Key Scientific Illustration */}
                <div className="mt-5 overflow-hidden flex items-center justify-center">
                  <CallIllustration type={call.illustrationType} />
                </div>
              </div>

              {/* Footer Deadline Block */}
              <div className="mt-6 pt-4 border-t border-slate-200/70 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-slate-700 shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Submission deadline
                  </p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5 lining-nums">
                    {call.deadline}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
