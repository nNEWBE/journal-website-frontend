"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Brain,
  Briefcase,
  Cog,
  Globe2,
  ShieldPlus,
  Stethoscope,
  Users,
} from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/layout/page-transition";
import { contentApi, type PageContentDTO } from "@/lib/api";

export interface TopicItem {
  id: string;
  name: string;
  icon: typeof Brain;
  href: string;
}

export const topicList: TopicItem[] = [
  {
    id: "ai",
    name: "Artificial Intelligence",
    icon: Brain,
    href: "/articles?topic=Technology",
  },
  {
    id: "medicine",
    name: "Medicine",
    icon: Stethoscope,
    href: "/articles?topic=Medical+Sciences",
  },
  {
    id: "engineering",
    name: "Engineering",
    icon: Cog,
    href: "/articles?topic=Technology",
  },
  {
    id: "climate-science",
    name: "Climate Science",
    icon: Globe2,
    href: "/articles?topic=Agriculture",
  },
  {
    id: "data-science",
    name: "Data Science",
    icon: BarChart3,
    href: "/articles?topic=Technology",
  },
  {
    id: "social-research",
    name: "Social Research",
    icon: Users,
    href: "/articles?topic=Social+Sciences",
  },
  {
    id: "public-health",
    name: "Public Health",
    icon: ShieldPlus,
    href: "/articles?topic=Public+Health",
  },
  {
    id: "business",
    name: "Business",
    icon: Briefcase,
    href: "/articles?topic=Social+Sciences",
  },
];

export function HomeExploreTopics() {
  const [section, setSection] = useState<PageContentDTO | null>(null);

  useEffect(() => {
    let active = true;
    contentApi
      .getPublished("home")
      .then((sections) => {
        if (!active) return;
        const s = sections.find(
          (sec) => sec.sectionKey === "explore-topics" || sec.sectionKey === "scope-tracks"
        );
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

  const title = section?.title || "Explore by Topic";
  const subtitle =
    section?.subtitle ||
    "Discover research across disciplines and stay informed on the latest advances in key fields shaping our world.";

  return (
    <section
      aria-label="Explore by Topic"
      className="py-14 sm:py-20 bg-white border-b border-slate-200/80"
    >
      <div className="container-x">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 sm:pb-10 border-b border-slate-200/80">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
              EXPLORE BY TOPIC
            </p>
            <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
              {title}
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              {subtitle}
            </p>
          </div>

          <Link
            href="/topics"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e40af] hover:underline shrink-0 group"
          >
            <span>View all topics</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 8 Topic Cards Grid (4 columns x 2 rows) */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mt-8 sm:mt-10">
          {topicList.map((topic) => {
            const Icon = topic.icon;
            return (
              <StaggerItem key={topic.id}>
                <Link
                  href={topic.href}
                  className="flex flex-col items-center justify-center text-center bg-white border border-slate-200/90 py-9 px-6 shadow-2xs hover:shadow-md hover:border-slate-400/80 transition-all group cursor-pointer h-full"
                >
                  <Icon
                    className="h-9 w-9 text-slate-800 group-hover:text-[#1e40af] group-hover:scale-110 transition-all duration-300"
                    strokeWidth={1.35}
                  />
                  <span className="mt-5 text-sm sm:text-[15px] font-semibold text-slate-900 group-hover:text-[#1e40af] transition-colors">
                    {topic.name}
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
