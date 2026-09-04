"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  LockOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { contentApi, articlesApi, type PageContentDTO } from "@/lib/api";
import { articles as initialArticles } from "@/lib/data";
import { useHomeSection } from "@/lib/home-sections-context";

export interface FeaturedSlide {
  id: string;
  num: string;
  category: string;
  journalCategory: string;
  isOpenAccess: boolean;
  title: string;
  shortTitle: string;
  authors: string;
  journal: string;
  journalHref: string;
  volumeIssue: string;
  publishDate: string;
  abstract: string;
  doi: string;
  doiHref?: string;
  image: string;
  articleHref: string;
  issueHref: string;
}

export const featuredSlides: FeaturedSlide[] = [
  {
    id: "01",
    num: "01",
    category: "FEATURED RESEARCH",
    journalCategory: "Molecular Biology & Virology",
    isOpenAccess: true,
    title:
      "Machine learning-guided discovery of allosteric inhibitors targeting emergent viral polymerases",
    shortTitle:
      "Machine learning-guided discovery of allosteric inhibitors targeting emergent viral polymerases",
    authors:
      "Aisha Rahman, PhD¹, Daniel K. Lee, PhD¹, Maria Santos, PhD², Arjun Patel, PhD¹, and Elena V. Morozova, PhD¹*",
    journal: "Nexus Journal of Molecular Sciences",
    journalHref: "/issues/current",
    volumeIssue: "Vol. 12, No. 4",
    publishDate: "May 2025",
    abstract:
      "We report a machine learning–driven framework that integrates generative modeling with molecular dynamics to identify potent allosteric inhibitors of the Nsp12 polymerase. Our top candidate, NX-2137, demonstrates broad-spectrum antiviral activity and favorable pharmacokinetic properties in preclinical models.",
    doi: "10.1234/njms.2025.1204.5678",
    doiHref: "https://doi.org/10.1234/njms.2025.1204.5678",
    image: "/images/hero/molecular_inhibitors.jpg",
    articleHref: "/articles/community-healthcare-access-savar",
    issueHref: "/issues/current",
  },
  {
    id: "02",
    num: "02",
    category: "FEATURED RESEARCH",
    journalCategory: "Cellular Medicine & Transcriptomics",
    isOpenAccess: true,
    title:
      "Single-cell transcriptomics uncovers disease drivers in pulmonary fibrosis",
    shortTitle:
      "Single-cell transcriptomics uncovers disease drivers in pulmonary fibrosis",
    authors:
      "Marcus Vance, MD, PhD¹, Elena Rostova, PhD², David Chen, PhD¹, and Sarah Jenkins, PhD³",
    journal: "Journal of Cellular & Molecular Medicine",
    journalHref: "/issues/current",
    volumeIssue: "Vol. 18, No. 2",
    publishDate: "June 2025",
    abstract:
      "High-resolution single-cell RNA sequencing reveals distinct pathogenic fibroblast subpopulations and endothelial plasticity driving fibrotic remodeling, providing novel targets for precision antifibrotic therapeutics.",
    doi: "10.1234/jcmm.2025.0618.2941",
    doiHref: "https://doi.org/10.1234/jcmm.2025.0618.2941",
    image: "/images/hero/pulmonary_fibrosis.jpg",
    articleHref: "/articles/pharmacy-practice-antimicrobial-stewardship",
    issueHref: "/issues/current",
  },
  {
    id: "03",
    num: "03",
    category: "FEATURED RESEARCH",
    journalCategory: "Agricultural Biotechnology",
    isOpenAccess: true,
    title:
      "Climate-resilient crops through genome editing and adaptive breeding",
    shortTitle:
      "Climate-resilient crops through genome editing and adaptive breeding",
    authors:
      "Dr. Mahbub Alam, PhD¹, Sharmin Jahan, MSc¹, Carlos Mendez, PhD², and Prof. Liam O'Connor, PhD³",
    journal: "Journal of Agricultural Biotechnology",
    journalHref: "/issues/current",
    volumeIssue: "Vol. 22, No. 3",
    publishDate: "April 2025",
    abstract:
      "Targeted CRISPR-Cas9 multiplex editing combined with accelerated breeding cycles yields drought- and salinity-tolerant cultivars with preserved nutritional yield profiles under extreme climate stress conditions.",
    doi: "10.1234/jagt.2025.0422.8812",
    doiHref: "https://doi.org/10.1234/jagt.2025.0422.8812",
    image: "/images/hero/crop_genomics.jpg",
    articleHref: "/articles/climate-resilient-agriculture-manifolds",
    issueHref: "/issues/current",
  },
  {
    id: "04",
    num: "04",
    category: "FEATURED RESEARCH",
    journalCategory: "Quantum Computing & Simulation",
    isOpenAccess: true,
    title:
      "Quantum computing advances for molecular simulation and drug discovery",
    shortTitle:
      "Quantum computing advances for molecular simulation and drug discovery",
    authors:
      "Hiroshi Tanaka, PhD¹, Priya Sharma, PhD², Kevin Zhao, PhD¹, and Alexei Voronoi, PhD³",
    journal: "Journal of Computational Chemistry & Quantum Systems",
    journalHref: "/issues/current",
    volumeIssue: "Vol. 9, No. 1",
    publishDate: "March 2025",
    abstract:
      "Variational quantum eigensolver algorithms executed on fault-tolerant quantum processors achieve chemical accuracy in calculating reaction barriers for complex metalloenzyme active sites.",
    doi: "10.1234/jccq.2025.0309.7741",
    doiHref: "https://doi.org/10.1234/jccq.2025.0309.7741",
    image: "/images/hero/quantum_computing.jpg",
    articleHref: "/articles/ai-assisted-learning-private-universities",
    issueHref: "/issues/current",
  },
];

function getCoverImage(article: any): string {
  if (article.image && typeof article.image === "string" && article.image.trim()) {
    return article.image;
  }
  const topic = (article.topic || "").toLowerCase();
  if (topic.includes("pharmacy") || topic.includes("drug")) return "/images/hero/molecular_inhibitors.jpg";
  if (topic.includes("tech") || topic.includes("computer") || topic.includes("ai")) return "/images/hero/quantum_computing.jpg";
  if (topic.includes("agri") || topic.includes("farm") || topic.includes("climate") || topic.includes("crop")) return "/images/hero/crop_genomics.jpg";
  if (topic.includes("cell") || topic.includes("medic") || topic.includes("health")) return "/images/hero/pulmonary_fibrosis.jpg";
  return "/images/hero/molecular_inhibitors.jpg";
}

const AUTO_PLAY_INTERVAL = 8000;

export function parseHeroSlides(heroSection?: PageContentDTO | null): FeaturedSlide[] | null {
  if (!heroSection?.metaJson) return null;
  try {
    const meta = JSON.parse(heroSection.metaJson);
    if (Array.isArray(meta.featuredSlides) && meta.featuredSlides.length > 0) {
      return meta.featuredSlides;
    }
  } catch {}
  return null;
}

export function HeroShowcase({ section: propSection }: { section?: PageContentDTO | null } = {}) {
  const contextSection = useHomeSection("hero-main");
  const heroSection = propSection || contextSection;

  const [slides, setSlides] = useState<FeaturedSlide[]>(() => {
    const parsed = parseHeroSlides(heroSection);
    if (parsed && parsed.length > 0) return parsed;
    return featuredSlides;
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Synchronize when heroSection becomes available or updates
  useEffect(() => {
    const parsed = parseHeroSlides(heroSection);
    if (parsed && parsed.length > 0) {
      setSlides(parsed);
    }
  }, [heroSection]);

  // Dynamic fetch from Home CMS (fallback only if heroSection is missing)
  useEffect(() => {
    if (heroSection) return;
    let active = true;
    async function loadDynamicFeatured() {
      try {
        const sections = await contentApi.getPublished("home");
        const found = sections.find(
          (s) => s.sectionKey === "hero-main" || s.sectionKey === "featured-research"
        );
        if (found?.metaJson) {
          const meta = JSON.parse(found.metaJson);
          if (Array.isArray(meta.featuredSlides) && meta.featuredSlides.length > 0) {
            if (active) setSlides(meta.featuredSlides);
            return;
          }
          if (Array.isArray(meta.selectedArticleIds) && meta.selectedArticleIds.length > 0) {
            const res = await articlesApi.list({ size: 100 }).catch(() => null);
            const allArticles = res?.content && res.content.length > 0 ? res.content : initialArticles;
            const mapped: FeaturedSlide[] = [];
            meta.selectedArticleIds.forEach((idOrSlug: string, idx: number) => {
              const art = allArticles.find(
                (a: any) => a.slug === idOrSlug || a.id === idOrSlug || a.articleId === idOrSlug
              );
              if (art) {
                mapped.push({
                  id: art.slug || art.id,
                  num: String(idx + 1).padStart(2, "0"),
                  category: "FEATURED RESEARCH",
                  journalCategory: art.topic || "Multidisciplinary Science",
                  isOpenAccess: true,
                  title: art.title,
                  shortTitle: art.title,
                  authors: Array.isArray(art.authors) ? art.authors.join(", ") : (art.authors || "Editorial Research Group"),
                  journal: "GB Journal of Science & Technology",
                  journalHref: "/issues/current",
                  volumeIssue: art.volume ? `${art.volume}, ${art.issue || "Issue 1"}` : "Vol. 14, No. 2",
                  publishDate: art.publishedAt || "June 2025",
                  abstract: art.abstract || "",
                  doi: art.doi || "10.5555/gbj.2025",
                  doiHref: art.doi ? `https://doi.org/${art.doi}` : undefined,
                  image: getCoverImage(art),
                  articleHref: `/articles/${art.slug || art.id}`,
                  issueHref: "/issues/current",
                });
              }
            });
            if (mapped.length > 0 && active) {
              setSlides(mapped);
            }
          }
        }
      } catch {
        // graceful fallback to default
      }
    }
    loadDynamicFeatured();
    return () => {
      active = false;
    };
  }, [heroSection]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % (slides.length || 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + (slides.length || 1)) % (slides.length || 1)
    );
  }, [slides.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  const safeIndex = Math.min(currentIndex, Math.max(0, slides.length - 1));
  const currentSlide = slides[safeIndex] || featuredSlides[0];

  return (
    <section
      aria-label="Featured Research Showcase"
      className="relative bg-white border-b border-slate-200/80 pt-6 pb-12 sm:pt-8 sm:pb-14 text-slate-900 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container-x">
        {/* 3-Column Hero Grid inside bounded container */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[230px_1fr_1.1fr] xl:grid-cols-[245px_1.05fr_1.15fr] lg:gap-6 xl:gap-8 items-center">
          
          {/* Left Column: Numbered List of Featured Articles */}
          <div className="flex flex-col justify-between self-stretch order-2 lg:order-1 pt-2 lg:pt-0">
            <div className="space-y-3 sm:space-y-3.5">
              {slides.map((slide, idx) => {
                const isActive = idx === safeIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={cn(
                      "group w-full text-left transition-all duration-200 rounded-xl p-2 sm:p-2.5 relative flex flex-col gap-1 cursor-pointer text-left",
                      isActive
                        ? "bg-slate-50/90 shadow-2xs"
                        : "hover:bg-slate-50/50 opacity-80 hover:opacity-100"
                    )}
                  >
                    {/* Active Left Indicator Bar */}
                    {isActive && (
                      <motion.div
                        layoutId="active-indicator"
                        className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[#1e40af]"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}

                    {/* Number */}
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "font-mono text-xs font-bold transition-colors pl-1",
                          isActive
                            ? "text-[#1e40af]"
                            : "text-slate-400 group-hover:text-slate-600"
                        )}
                      >
                        {slide.num}
                      </span>
                    </div>

                    {/* Thumbnail + Title Row */}
                    <div className="flex items-start gap-2.5 pl-1">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-200/80 bg-slate-100 shadow-2xs">
                        <Image
                          src={slide.image}
                          alt=""
                          fill
                          loading="eager"
                          sizes="48px"
                          className={cn(
                            "object-cover transition-transform duration-300",
                            isActive ? "scale-105" : "group-hover:scale-105 opacity-90"
                          )}
                        />
                      </div>
                      <p
                        className={cn(
                          "text-[11.5px] font-medium leading-[1.38] line-clamp-3 transition-colors",
                          isActive
                            ? "text-slate-900 font-semibold"
                            : "text-slate-600 group-hover:text-slate-900"
                        )}
                      >
                        {slide.shortTitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* View All Featured Articles Link */}
            <div className="pt-4 border-t border-slate-100 mt-3 lg:mt-4">
              <Link
                href="/articles"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#1e40af] transition-colors group"
              >
                <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5 text-slate-500 group-hover:text-[#1e40af]" />
                <span>View All Featured Articles</span>
              </Link>
            </div>
          </div>

          {/* Center Column: Featured Scientific Visualizer & Carousel Controls */}
          <div className="order-1 lg:order-2 flex flex-col items-center">
            {/* Expanded Visualizer Frame */}
            <div className="relative aspect-square w-full max-w-[490px] xl:max-w-[520px] overflow-hidden rounded-2xl border border-slate-200/90 bg-[#060e22] shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={currentSlide.image}
                    alt={currentSlide.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 520px"
                    className="object-cover"
                  />
                  
                  {/* Subtle technical gradient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060e22]/70 via-transparent to-transparent pointer-events-none" />

                  {/* Clean Journal Category Tag */}
                  <div className="absolute bottom-3.5 left-3.5 z-20 pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white bg-[#060e22]/90 border border-white/20 backdrop-blur-md shadow-md">
                      {currentSlide.journalCategory}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Carousel Controls */}
            <div className="mt-4 sm:mt-5 flex items-center gap-4">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous featured research"
                className="flex h-9 w-9 items-center justify-center rounded border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="font-mono text-xs tracking-wider">
                <span className="font-bold text-[#1e40af]">{currentSlide.num}</span>
                <span className="text-slate-400"> / {String(slides.length).padStart(2, "0")}</span>
              </div>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next featured research"
                className="flex h-9 w-9 items-center justify-center rounded bg-[#0b1b3d] text-white shadow-2xs hover:bg-[#15295c] transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Detailed Article Metadata, Abstract & Actions */}
          <div className="order-3 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex flex-col"
              >
                {/* Badges Row */}
                <div className="flex items-center gap-2.5 text-[11px] font-bold tracking-[0.14em]">
                  <span className="uppercase text-slate-500">
                    {currentSlide.category}
                  </span>
                  <span className="text-slate-300">|</span>
                  {currentSlide.isOpenAccess && (
                    <span className="inline-flex items-center gap-1.5 uppercase text-amber-600 font-extrabold">
                      <LockOpen className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                      <span>OPEN ACCESS</span>
                    </span>
                  )}
                </div>

                {/* Big Editorial Serif Title */}
                <h1 className="mt-3.5 font-academic text-2xl sm:text-3xl lg:text-[2.25rem] xl:text-[2.55rem] font-medium leading-[1.16] tracking-[-0.018em] text-slate-950">
                  <Link
                    href={currentSlide.articleHref}
                    className="hover:text-[#1e40af] transition-colors"
                  >
                    {currentSlide.title}
                  </Link>
                </h1>

                {/* Authors Line */}
                <p className="mt-3.5 text-xs sm:text-[13px] leading-relaxed text-slate-700 font-medium">
                  {currentSlide.authors}
                </p>

                {/* Journal Citation Line */}
                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <Link
                    href={currentSlide.journalHref}
                    className="font-semibold text-[#1e40af] hover:underline"
                  >
                    {currentSlide.journal}
                  </Link>
                  <span className="text-slate-300">|</span>
                  <span>{currentSlide.volumeIssue}</span>
                  <span className="text-slate-300">|</span>
                  <span>{currentSlide.publishDate}</span>
                </div>

                {/* Abstract Text */}
                <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-slate-600 sm:line-clamp-4">
                  {currentSlide.abstract}
                </p>

                {/* Action Buttons */}
                <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href={currentSlide.articleHref}
                    className="inline-flex items-center gap-2 rounded-md bg-[#0b1b3d] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-[#162c60] transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Read Article</span>
                  </Link>

                  <Link
                    href={currentSlide.issueHref}
                    className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 shadow-2xs hover:bg-slate-50 hover:border-slate-400 transition-colors"
                  >
                    <BookOpen className="h-4 w-4 text-slate-600" />
                    <span>View Issue</span>
                  </Link>
                </div>

                {/* DOI Footer */}
                <div className="mt-4 sm:mt-5 text-xs text-slate-500">
                  <span>DOI: </span>
                  <Link
                    href={currentSlide.doiHref || `/articles/${currentSlide.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#1e40af] hover:underline"
                  >
                    {currentSlide.doi}
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
