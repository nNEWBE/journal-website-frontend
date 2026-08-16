"use client";

import Link from "next/link";
import { ArrowUpRight, Eye } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/layout/page-transition";

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
      "Machine learning-guided discovery of allosteric inhibitors targeting emergent viral polymerases",
    journal: "Nexus Journal of Molecular Sciences",
    date: "May 2025",
    views: "12.4K views",
    href: "/articles/community-healthcare-access-savar",
  },
  {
    rank: "02",
    type: "RESEARCH ARTICLE",
    title:
      "Single-cell multi-omics reveals the cellular logic of tissue regeneration",
    journal: "Nexus Journal of Cell Biology",
    date: "April 2025",
    views: "9.8K views",
    href: "/articles/pharmacy-practice-antimicrobial-stewardship",
  },
  {
    rank: "03",
    type: "REVIEW ARTICLE",
    title:
      "Advances in mRNA vaccine design: From sequence to secure immunity",
    journal: "Nexus Journal of Immunology",
    date: "March 2025",
    views: "8.1K views",
    href: "/articles/climate-resilient-agriculture-manifolds",
  },
  {
    rank: "04",
    type: "RESEARCH ARTICLE",
    title:
      "A cryo-EM atlas of human protein complexes in health and disease",
    journal: "Nexus Journal of Structural Biology",
    date: "March 2025",
    views: "6.7K views",
    href: "/articles/legal-aid-university-clinic",
  },
  {
    rank: "05",
    type: "PERSPECTIVE",
    title:
      "Synthetic biology for a sustainable future: Opportunities and ethical considerations",
    journal: "Nexus Journal of Biotechnology",
    date: "February 2025",
    views: "5.2K views",
    href: "/articles/ai-assisted-learning-private-universities",
  },
];

export function HomeMostRead() {
  return (
    <section
      aria-label="Most Read Articles"
      className="py-14 sm:py-20 bg-white border-b border-slate-200/80"
    >
      <div className="container-x">
        {/* Section Header */}
        <div className="flex items-baseline justify-between gap-4 pb-6 sm:pb-8 border-b border-slate-200/80">
          <h2 className="font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
            Most Read
          </h2>
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
          {mostReadArticles.map((item) => (
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
