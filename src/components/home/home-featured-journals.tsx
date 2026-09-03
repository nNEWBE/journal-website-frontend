"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, LockOpen } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/layout/page-transition";
import { contentApi, type PageContentDTO } from "@/lib/api";

export interface FeaturedJournalItem {
  id: string;
  coverTitlePrefix: string;
  coverTitle: string;
  title: string;
  category: string;
  description: string;
  latestIssue: string;
  image: string;
  href: string;
}

export const featuredJournals: FeaturedJournalItem[] = [
  {
    id: "fj-01",
    coverTitlePrefix: "Journal of",
    coverTitle: "Molecular\nSciences",
    title: "Journal of Molecular Sciences",
    category: "MOLECULAR BIOLOGY",
    description:
      "Advancing molecular understanding through cutting-edge research and interdisciplinary insights.",
    latestIssue: "Vol. 12, No. 4  |  May 2025",
    image: "/images/journals/molecular.jpg",
    href: "/issues/current",
  },
  {
    id: "fj-02",
    coverTitlePrefix: "Journal of",
    coverTitle: "Genomic\nMedicine",
    title: "Journal of Genomic Medicine",
    category: "GENETICS & GENOMICS",
    description:
      "Exploring genomic frontiers to improve human health and drive precision medicine.",
    latestIssue: "Vol. 9, No. 2  |  April 2025",
    image: "/images/journals/genomic.jpg",
    href: "/issues/current",
  },
  {
    id: "fj-03",
    coverTitlePrefix: "Journal of",
    coverTitle: "Computational\nBiology",
    title: "Journal of Computational Biology",
    category: "COMPUTATIONAL SCIENCES",
    description:
      "Publishing innovative computational approaches to complex biological problems.",
    latestIssue: "Vol. 7, No. 3  |  March 2025",
    image: "/images/journals/computational.jpg",
    href: "/issues/current",
  },
  {
    id: "fj-04",
    coverTitlePrefix: "Journal of",
    coverTitle: "Immunology\nResearch",
    title: "Journal of Immunology Research",
    category: "IMMUNOLOGY & INFECTIOUS DISEASE",
    description:
      "Translating foundational immunology into clinical insights and therapeutic solutions.",
    latestIssue: "Vol. 11, No. 1  |  January 2025",
    image: "/images/journals/immunology.jpg",
    href: "/issues/current",
  },
];

export function HomeFeaturedJournals() {
  const [section, setSection] = useState<PageContentDTO | null>(null);

  useEffect(() => {
    let active = true;
    contentApi
      .getPublished("home")
      .then((sections) => {
        if (!active) return;
        const s = sections.find((sec) => sec.sectionKey === "featured-journals");
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

  const title = section?.title || "Featured Journals";

  return (
    <section
      aria-label="Featured Journals"
      className="py-14 sm:py-20 bg-slate-50/40 border-b border-slate-200/80"
    >
      <div className="container-x">
        {/* Section Header */}
        <div className="flex items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
          <div>
            <h2 className="font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
              {title}
            </h2>
            {section?.subtitle && (
              <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
                {section.subtitle}
              </p>
            )}
          </div>
          <Link
            href="/issues"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e40af] hover:underline group"
          >
            <span>View all journals</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4-Column Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 sm:mt-10">
          {featuredJournals.map((journal) => (
            <StaggerItem
              key={journal.id}
              className="flex flex-col justify-between bg-white border border-slate-200/90 p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all group"
            >
              <div>
                {/* Journal Cover Thumbnail */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#061026] text-white border border-slate-200/50 shadow-sm">
                  <Image
                    src={journal.image}
                    alt={journal.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Subtle Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#061026]/85 via-transparent to-[#061026]/90" />

                  {/* Top Cover Typography */}
                  <div className="relative z-10 p-4">
                    <p className="text-[9px] font-medium text-slate-300 tracking-wide">
                      {journal.coverTitlePrefix}
                    </p>
                    <p className="font-academic text-sm sm:text-[15px] font-bold text-white leading-tight mt-0.5 whitespace-pre-line">
                      {journal.coverTitle}
                    </p>
                  </div>

                  {/* Bottom Masthead Logo on Cover */}
                  <div className="absolute bottom-3 left-4 z-10 font-mono text-[7px] leading-tight text-slate-300">
                    <p className="font-bold tracking-wider text-white/90">
                      NEXUS
                    </p>
                    <p className="tracking-widest text-[6px] text-slate-400">
                      JOURNAL PRESS
                    </p>
                  </div>
                </div>

                {/* Journal Title */}
                <h3 className="mt-4 font-academic text-base sm:text-lg font-medium leading-[1.3] text-slate-900 transition-colors group-hover:text-[#1e40af]">
                  <Link href={journal.href}>{journal.title}</Link>
                </h3>

                {/* Category Tag */}
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#1e40af]">
                  {journal.category}
                </p>

                {/* Description */}
                <p className="mt-2.5 text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {journal.description}
                </p>
              </div>

              {/* Bottom Meta & Open Access Row */}
              <div className="mt-5 pt-3.5 border-t border-slate-100">
                <p className="text-[10px] font-medium text-slate-500">
                  Latest Issue
                </p>
                <p className="text-xs font-semibold text-slate-800 mt-0.5 lining-nums">
                  {journal.latestIssue}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-orange-600">
                  <LockOpen className="h-3.5 w-3.5 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    OPEN ACCESS
                  </span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
