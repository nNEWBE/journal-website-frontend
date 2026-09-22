"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/layout/page-transition";
import { contentApi, type PageContentDTO } from "@/lib/api";
import { useHomeSection } from "@/lib/home-sections-context";

export interface CommunityArticle {
  id: string;
  tag: string;
  title: string;
  description: string;
  actionText: string;
  image: string;
  href: string;
  isVideo?: boolean;
}

export const communityArticles: CommunityArticle[] = [
  {
    id: "ca-01",
    tag: "AUTHOR INTERVIEW",
    title: "Interview with Prof. Dr. Arup Chandra, PhD",
    description:
      "On community healthcare access patterns across Savar and the methodology behind university catchment health studies.",
    actionText: "Read Interview",
    image: "/images/community/dr_aisha_rahman.png",
    href: "/articles/community-healthcare-access-savar",
  },
  {
    id: "ca-02",
    tag: "RESEARCH HIGHLIGHT",
    title: "Antimicrobial Stewardship in Clinical Teaching Settings",
    description:
      "Assessing institutional readiness, clinical protocols, and hospital-acquired resistance patterns in teaching facilities.",
    actionText: "Explore Research",
    image: "/images/community/allosteric_highlight.jpg",
    href: "/articles/pharmacy-practice-antimicrobial-stewardship",
  },
  {
    id: "ca-03",
    tag: "COMMUNITY NEWS",
    title: "Annual Research Colloquium 2026: Key Takeaways",
    description:
      "Faculty and reviewers convene at Gono Bishwabidyalay to discuss climate-resilient agriculture, legal aid, and public health.",
    actionText: "Read Symposium Recap",
    image: "/images/community/symposium_recap.png",
    href: "/articles",
  },
  {
    id: "ca-04",
    tag: "WEBINAR & WORKSHOP",
    title: "Webinar: Generative AI & Academic Integrity in Higher Education",
    description:
      "Watch the on-demand panel discussing student adoption of AI tools, assessment design, and university ethics policies.",
    actionText: "Watch Webinar",
    image: "/images/community/webinar_ml.jpg",
    href: "/articles/ai-assisted-learning-private-universities",
    isVideo: true,
  },
];

export function HomeResearchCommunity({ section: propSection }: { section?: PageContentDTO | null } = {}) {
  const contextSection = useHomeSection("research-community");
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
        const s = sections.find((sec) => sec.sectionKey === "research-community");
        if (s) setSection(s);
      })
      .catch(() => { });
    return () => {
      active = false;
    };
  }, [activeSection]);

  if (section && section.published === false) {
    return null;
  }

  const title = section?.title || "From Our Research Community";

  const displayedArticles = (() => {
    try {
      if (section?.metaJson) {
        const meta = JSON.parse(section.metaJson);
        if (Array.isArray(meta.articles) && meta.articles.length > 0) {
          return meta.articles;
        }
      }
    } catch { }
    return communityArticles;
  })();

  return (
    <section
      aria-label="From Our Research Community"
      className="py-14 sm:py-20 bg-white border-b border-slate-200/80"
    >
      <div className="container-x">
        {/* Section Header */}
        <div className="pb-8 sm:pb-10 border-b border-slate-200/80">
          <h2 className="font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
            {title}
          </h2>
          {section?.subtitle && (
            <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
              {section.subtitle}
            </p>
          )}
        </div>

        {/* 4-Column Community Cards */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 sm:mt-10">
          {displayedArticles.map((article: CommunityArticle) => (
            <StaggerItem
              key={article.id}
              className="flex flex-col justify-between bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all group overflow-hidden"
            >
              <div>
                {/* Image Container */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-900">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Play Button Overlay for Video/Webinar */}
                  {article.isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-black/40 text-white backdrop-blur-xs transition-transform group-hover:scale-110">
                        <Play className="h-5 w-5 fill-white translate-x-0.5" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1e40af]">
                    {article.tag}
                  </p>

                  <h3 className="mt-2.5 font-academic text-base sm:text-[17px] font-medium leading-[1.3] text-slate-900 group-hover:text-[#1e40af] transition-colors line-clamp-2">
                    <Link href={article.href}>{article.title}</Link>
                  </h3>

                  <p className="mt-2.5 text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {article.description}
                  </p>
                </div>
              </div>

              {/* Bottom Action Link */}
              <div className="px-5 pb-5 pt-0">
                <Link
                  href={article.href}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1e40af] hover:underline group/link"
                >
                  <span>{article.actionText}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
