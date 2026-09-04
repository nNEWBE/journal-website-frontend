"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, FileText } from "lucide-react";
import { FadeIn } from "@/components/layout/page-transition";
import { contentApi, type PageContentDTO } from "@/lib/api";
import { useHomeSection } from "@/lib/home-sections-context";

export function HomeCurrentIssue({ section: propSection }: { section?: PageContentDTO | null } = {}) {
  const contextSection = useHomeSection("current-issue");
  const activeSection = propSection || contextSection;
  const [section, setSection] = useState<PageContentDTO | null>(() => activeSection || null);

  useEffect(() => {
    if (activeSection) {
      setSection(activeSection);
      return;
    }
    let active = true;
    contentApi
      .getPublished("home")
      .then((sections) => {
        if (!active) return;
        const s = sections.find((sec) => sec.sectionKey === "current-issue");
        if (s) setSection(s);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [activeSection]);

  if (section && section.published === false) {
    return null;
  }

  const meta = (() => {
    try {
      return section?.metaJson ? JSON.parse(section.metaJson) : {};
    } catch {
      return {};
    }
  })();

  const title = section?.title || "Current Issue";
  const journalName = meta.journalName || "Nexus Journal of Molecular Sciences";
  const volumeIssue = meta.volumeIssue || "Vol. 12, No. 4";
  const issueDate = meta.issueDate || section?.subtitle || "May 2025";
  const publicationDate = meta.publicationDate || "May 15, 2025";
  const issnPrint = meta.issnPrint || "2073-8447";
  const issnOnline = meta.issnOnline || "2790-2188";
  const featuredPaperTitle =
    meta.featuredPaperTitle ||
    "Machine learning-guided discovery of allosteric inhibitors targeting emergent viral polymerases";
  const content =
    section?.content ||
    "This issue features cutting-edge research at the intersection of molecular biology, chemical biology, and computational science. Highlighted studies explore emerging therapeutic targets, novel biomolecular mechanisms, and innovative methodologies advancing precision medicine and translational discovery.";
  const browseHref = meta.browseHref || "/issues/current";

  return (
    <section
      aria-label="Current Issue"
      className="py-14 sm:py-20 bg-white border-b border-slate-200/80"
    >
      <div className="container-x">
        {/* Section Header with Line Accent */}
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
              CURRENT ISSUE
            </span>
            <div className="h-px w-12 bg-slate-300" />
          </div>
          <h2 className="mt-3 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
            {title}
          </h2>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr] gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left Column: Compact Magazine Issue Cover */}
          <FadeIn direction="up" delay={0.1}>
            <div className="relative mx-auto lg:mx-0 w-full max-w-[270px] sm:max-w-[285px] aspect-[3/4] overflow-hidden bg-[#061026] text-white shadow-[0_18px_45px_rgba(15,23,42,0.2)] border border-slate-200/60 group">
              {/* Background Molecular Graphic */}
              <div className="absolute inset-0">
                <Image
                  src="/images/hero/molecular_inhibitors.jpg"
                  alt={`${journalName} Cover`}
                  fill
                  priority
                  sizes="290px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Vignette Gradients */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#061026]/90 via-[#061026]/25 to-[#061026]/95" />
              </div>

              {/* Cover Top Header */}
              <div className="relative z-10 p-4 sm:p-4.5 flex items-start justify-between">
                <div>
                  <h3 className="font-academic text-xl sm:text-2xl font-bold tracking-wider text-white uppercase">
                    GBJ
                  </h3>
                  <p className="text-[7.5px] font-bold uppercase tracking-[0.16em] text-cyan-300 mt-0.5 truncate max-w-[140px]">
                    {journalName}
                  </p>
                </div>
                <div className="text-right font-mono text-[7px] text-slate-300/80 leading-tight">
                  <p>ISSN {issnPrint}</p>
                  <p>eISSN {issnOnline}</p>
                </div>
              </div>

              {/* Cover Bottom Content */}
              <div className="absolute bottom-0 inset-x-0 z-10 p-4 sm:p-4.5 flex flex-col justify-end">
                <div className="mb-3">
                  <p className="text-[7.5px] font-bold uppercase tracking-[0.16em] text-cyan-300">
                    FEATURED RESEARCH
                  </p>
                  <h4 className="mt-1 font-academic text-[11px] font-medium leading-[1.3] text-white/95 line-clamp-3">
                    {featuredPaperTitle}
                  </h4>
                </div>

                <div className="pt-2.5 border-t border-white/20 flex items-center justify-between font-mono text-[8px] text-white/80 font-bold uppercase tracking-wider">
                  <span>{volumeIssue.toUpperCase()}</span>
                  <span>{issueDate.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Right Column: Issue Details & Description */}
          <FadeIn direction="up" delay={0.2} className="flex flex-col justify-center">
            {/* Journal Pre-title */}
            <p className="text-[11.5px] sm:text-xs font-bold uppercase tracking-[0.14em] text-[#1e40af]">
              {journalName}
            </p>

            {/* Volume / Issue Main Title */}
            <h3 className="mt-2 font-academic lining-nums text-4xl sm:text-5xl lg:text-[3.25rem] font-medium leading-[1.1] tracking-[-0.02em] text-slate-950">
              {volumeIssue}
            </h3>

            {/* Subtitle Date */}
            <p className="mt-1.5 text-sm sm:text-base font-medium text-slate-600">
              {issueDate}
            </p>

            {/* Metadata 2-Column Spec Block */}
            <div className="mt-6 pt-6 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              {/* Publication Date */}
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-slate-100 text-[#1e40af] border border-slate-200">
                  <BookOpen className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Publication Date
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {publicationDate}
                  </p>
                </div>
              </div>

              {/* ISSN Information */}
              <div className="flex items-start gap-3 sm:border-l sm:border-slate-200 sm:pl-6">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-slate-100 text-[#1e40af] border border-slate-200">
                  <FileText className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    ISSN
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {issnPrint} (Print)
                  </p>
                  <p className="text-xs text-slate-600">
                    {issnOnline} (Online)
                  </p>
                </div>
              </div>
            </div>

            {/* Description Body */}
            <p className="mt-6 text-xs sm:text-sm leading-relaxed text-slate-600">
              {content}
            </p>

            {/* Action Button */}
            <div className="mt-8">
              <Link
                href={browseHref}
                className="inline-flex items-center gap-2.5 bg-[#0b1b3d] hover:bg-[#162c60] text-white px-6 py-3 text-xs sm:text-sm font-semibold shadow-xs transition-colors"
              >
                <BookOpen className="h-4 w-4 text-white/90" />
                <span>View Full Issue</span>
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
