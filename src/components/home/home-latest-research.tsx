"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, FileText } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/layout/page-transition";
import { contentApi, type PageContentDTO } from "@/lib/api";
import { useHomeSection } from "@/lib/home-sections-context";

export interface LatestArticle {
  id: string;
  slug: string;
  image: string;
  tags: string;
  title: string;
  authors: string;
  journal: string;
  journalHref: string;
  date: string;
  articleHref: string;
  pdfHref: string;
}

export const latestArticles: LatestArticle[] = [
  {
    id: "la-01",
    slug: "deep-learning-stroke-prediction-multimodal-mri",
    image: "/images/latest/brain_mri.jpg",
    tags: "MEDICINE • ARTIFICIAL INTELLIGENCE",
    title:
      "Deep learning improves prediction of stroke outcomes using multimodal MRI",
    authors:
      "Liang Chen, PhD¹, Emily R. Johnson, MD², Rahul K. Verma, PhD¹, and Sofia Martinez, PhD¹",
    journal: "Nexus Journal of Medical Sciences",
    journalHref: "/issues/current",
    date: "May 20, 2025",
    articleHref: "/articles/community-healthcare-access-savar",
    pdfHref: "/pdfs/community-healthcare-access-savar.pdf",
  },
  {
    id: "la-02",
    slug: "hybrid-solar-wind-battery-storage-microgrids",
    image: "/images/latest/solar_wind.jpg",
    tags: "ENGINEERING • RENEWABLE ENERGY",
    title:
      "Hybrid solar–wind systems with battery storage for resilient microgrids",
    authors:
      "Fatima Al-Hassan, PhD¹, Miguel Santos, PhD², Arjun Patel, PhD¹, and Elena Petrova, PhD¹",
    journal: "Nexus Journal of Engineering Research",
    journalHref: "/issues/current",
    date: "May 19, 2025",
    articleHref: "/articles/pharmacy-practice-antimicrobial-stewardship",
    pdfHref: "/pdfs/pharmacy-practice-antimicrobial-stewardship.pdf",
  },
  {
    id: "la-03",
    slug: "graph-neural-networks-noncoding-variants",
    image: "/images/latest/dna_variants.jpg",
    tags: "BIOLOGY • COMPUTATIONAL BIOLOGY",
    title:
      "Graph neural networks reveal functional impacts of noncoding variants",
    authors:
      "David Park, PhD¹, Maria Santos, PhD², Jaehoon Kim, PhD¹, and Lucia Bianchi, PhD¹",
    journal: "Nexus Journal of Biological Sciences",
    journalHref: "/issues/current",
    date: "May 18, 2025",
    articleHref: "/articles/climate-resilient-agriculture-manifolds",
    pdfHref: "/pdfs/climate-resilient-agriculture-manifolds.pdf",
  },
  {
    id: "la-04",
    slug: "real-time-surveillance-infectious-disease-mobility",
    image: "/images/latest/disease_mobility.jpg",
    tags: "PUBLIC HEALTH • EPIDEMIOLOGY",
    title:
      "Real-time surveillance of infectious disease spread via aggregated mobility data",
    authors:
      "Amara Okafor, MD¹, Wei Zhang, PhD², Carlos Gomez, MD¹, and Sarah Jenkins, PhD¹",
    journal: "Nexus Journal of Public Health",
    journalHref: "/issues/current",
    date: "May 17, 2025",
    articleHref: "/articles/ai-assisted-learning-private-universities",
    pdfHref: "/pdfs/ai-assisted-learning-private-universities.pdf",
  },
];

export function HomeLatestResearch({ section: propSection }: { section?: PageContentDTO | null } = {}) {
  const contextSection = useHomeSection("latest-research");
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
        const s = sections.find((sec) => sec.sectionKey === "latest-research");
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

  const title = section?.title || "Latest Research";
  const viewAllText = meta.viewAllText || "View all articles";
  const viewAllHref = meta.viewAllHref || "/articles";

  return (
    <section
      aria-label="Latest Research"
      className="py-12 sm:py-16 bg-slate-50/40 border-b border-slate-200/80"
    >
      <div className="container-x">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/60">
          <div>
            <h2 className="font-academic text-3xl sm:text-4xl lg:text-[2.6rem] font-medium tracking-[-0.02em] text-slate-950">
              {title}
            </h2>
            {section?.subtitle && (
              <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
                {section.subtitle}
              </p>
            )}
          </div>
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e40af] hover:underline group"
          >
            <span>{viewAllText}</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4-Column Cards Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {latestArticles.map((article) => (
            <StaggerItem
              key={article.id}
              className="flex flex-col justify-between bg-white border border-slate-200/90 p-4 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all group"
            >
              <div>
                {/* Image Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 border border-slate-100">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Category Tags */}
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-[#1e40af]">
                  {article.tags}
                </p>

                {/* Title */}
                <h3 className="mt-2 font-academic text-base sm:text-[17px] font-medium leading-[1.3] text-slate-900 transition-colors group-hover:text-[#1e40af]">
                  <Link href={article.articleHref}>{article.title}</Link>
                </h3>

                {/* Authors */}
                <p className="mt-3 text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">
                  {article.authors}
                </p>

                {/* Journal & Date */}
                <div className="mt-3">
                  <Link
                    href={article.journalHref}
                    className="block text-xs font-semibold text-[#1e40af] hover:underline"
                  >
                    {article.journal}
                  </Link>
                  <span className="block text-[11px] text-slate-500 mt-1">
                    {article.date}
                  </span>
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-around text-xs font-semibold text-slate-700">
                <Link
                  href={article.articleHref}
                  className="inline-flex items-center gap-1.5 hover:text-[#1e40af] transition-colors py-1 px-2"
                >
                  <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                  <span>Read</span>
                </Link>
                <span className="text-slate-200">|</span>
                <Link
                  href={article.pdfHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-[#1e40af] transition-colors py-1 px-2"
                >
                  <FileText className="h-3.5 w-3.5 text-slate-500" />
                  <span>PDF</span>
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
