"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Eye } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/layout/page-transition";
import { contentApi, type PageContentDTO } from "@/lib/api";
import { useHomeSection } from "@/lib/home-sections-context";
import { type Article } from "@/lib/data";

export interface MostReadItem {
  rank: string;
  type: string;
  title: string;
  journal: string;
  date: string;
  views: string;
  href: string;
}

export const mostReadArticles: MostReadItem[] = [
  {
    rank: "01",
    type: "RESEARCH ARTICLE",
    title:
      "Community healthcare access patterns around Savar: A mixed-method university catchment study",
    journal: "GB Journal of Research",
    date: "July 2026",
    views: "2,846 views",
    href: "/articles/community-healthcare-access-savar",
  },
];

export function HomeMostRead({
  section: propSection,
  articles,
}: {
  section?: PageContentDTO | null;
  articles?: Article[];
} = {}) {
  const contextSection = useHomeSection("most-read");
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
        const s = sections.find((sec) => sec.sectionKey === "most-read");
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

  const itemsToDisplay: MostReadItem[] =
    articles && articles.length > 0
      ? [...articles]
          .sort((a, b) => (b.metrics?.views ?? 0) - (a.metrics?.views ?? 0))
          .slice(0, 5)
          .map((art, idx) => ({
            rank: String(idx + 1).padStart(2, "0"),
            type: (art.type || "RESEARCH ARTICLE").toUpperCase(),
            title: art.title,
            journal: "GB Journal of Research",
            date: art.publishedAt || "July 2026",
            views: `${art.metrics?.views?.toLocaleString() ?? 0} views`,
            href: `/articles/${art.slug}`,
          }))
      : mostReadArticles;

  const title = section?.title || "Most Read Research";

  return (
    <section
      aria-label="Most Read Research"
      className="py-14 sm:py-20 bg-white border-b border-slate-200/80"
    >
      <div className="container-x">
        {/* Section Header */}
        <div className="flex items-baseline justify-between gap-4 pb-6 sm:pb-8 border-b border-slate-200/80">
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
            href="/articles"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e40af] hover:underline group"
          >
            <span>View all</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Ranked Article Rows */}
        <StaggerContainer className="divide-y divide-slate-200/70">
          {itemsToDisplay.map((item) => (
            <StaggerItem
              key={item.rank}
              className="py-6 sm:py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-8 group"
            >
              {/* Left: Rank & Article Info */}
              <div className="flex items-start gap-5 sm:gap-8">
                {/* Big Serif Rank Number */}
                <span className="font-academic lining-nums text-3xl sm:text-4xl text-slate-950 font-normal w-12 sm:w-16 shrink-0 pt-0.5 select-none">
                  {item.rank}
                </span>

                {/* Meta & Title */}
                <div>
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#1e40af]">
                    {item.type}
                  </p>
                  <h3 className="mt-1.5 font-academic text-base sm:text-lg lg:text-[19px] font-medium leading-[1.35] text-slate-900 transition-colors group-hover:text-[#1e40af]">
                    <Link href={item.href}>{item.title}</Link>
                  </h3>
                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                    <span className="font-semibold text-[#1e40af]">
                      {item.journal}
                    </span>
                    <span className="text-slate-300">|</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>

              {/* Right: Views Counter */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium shrink-0 pl-17 sm:pl-0">
                <Eye className="h-4 w-4 text-slate-400" />
                <span>{item.views}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
