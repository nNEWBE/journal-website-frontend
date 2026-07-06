"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlideData {
  id: string;
  image: string;
  theme: string;
  volume: string;
  issue: string;
  month: string;
  isCurrent?: boolean;
}

const slides: SlideData[] = [
  {
    id: "slide-1",
    image: "/covers/medical.png",
    theme: "Community Health, Stewardship, and Resilient Systems",
    volume: "Volume 4",
    issue: "Issue 2",
    month: "July 2026",
    isCurrent: true,
  },
  {
    id: "slide-2",
    image: "/covers/agriculture.png",
    theme: "Climate Adaptations in South Asia",
    volume: "Volume 4",
    issue: "Issue 1",
    month: "January 2026",
  },
  {
    id: "slide-3",
    image: "/covers/technology.png",
    theme: "AI Ethics & Higher Education Systems",
    volume: "Volume 3",
    issue: "Issue 2",
    month: "July 2025",
  },
];

const SLIDE_DURATION = 6000;

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  const handleNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 100 / (SLIDE_DURATION / 50);
      });
    }, 50);
    return () => clearInterval(interval);
  }, [handleNext]);

  const slide = slides[current];

  return (
    <div className="hero-slider-wrap group relative w-full overflow-hidden rounded-2xl shadow-2xl">
      {/* Geometric decorative frame */}
      <div className="absolute inset-0 z-[1] pointer-events-none rounded-2xl ring-1 ring-inset ring-white/10" />



      {/* Slides */}
      <div className="relative aspect-[4/5] sm:aspect-[3/4] md:aspect-[4/3] lg:aspect-[16/10] w-full bg-[color:var(--color-gb-blue-deep)]">
        {slides.map((s, index) => {
          const isActive = index === current;
          return (
            <div
              key={s.id}
              className={cn(
                "absolute inset-0 transition-all duration-[1200ms] ease-in-out",
                isActive ? "opacity-100 scale-100 z-10" : "opacity-0 scale-[1.04] z-0"
              )}
            >
              {/* Cover image */}
              <img
                src={s.image}
                alt={s.theme}
                className="h-full w-full object-cover"
              />
              {/* Dark cinematic overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
            </div>
          );
        })}

        {/* Content overlay — always on top */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-5 sm:p-7 md:p-8 text-white">
          {/* Header row */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded bg-white/10 backdrop-blur-md border border-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/90">
                {slide.volume} &bull; {slide.issue}
              </span>
              {slide.isCurrent ? (
                <span className="inline-flex items-center gap-1 rounded bg-[color:var(--bangla-red)] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-lg shadow-red-900/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  Current Issue
                </span>
              ) : (
                <span className="inline-flex items-center rounded border border-white/20 bg-white/5 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/70">
                  Archive
                </span>
              )}
            </div>
          </div>

          {/* Main content area */}
          <div className="mt-auto mb-0">


            {/* Theme title */}
            <h2 className="font-academic max-w-md text-xl sm:text-2xl md:text-[1.75rem] lg:text-3xl font-extrabold leading-[1.15] text-white tracking-tight drop-shadow-lg">
              {slide.theme}
            </h2>

            {/* Footer meta row */}
            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-white/70">
                  <CalendarDays className="h-3.5 w-3.5 text-[color:var(--color-gb-gold)]" />
                  {slide.month}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white/40">
                  <span className="h-1 w-1 rounded-full bg-white/30" />
                  Peer-Reviewed
                </span>
              </div>
              <a
                href="/issues"
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white/90 hover:bg-white/20 hover:text-white transition-all group/btn"
              >
                Explore Issue
                <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover/btn:-rotate-45" />
              </a>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
          title="Previous Issue"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
          title="Next Issue"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Bottom progress bar and slide indicators */}
      <div className="relative z-30 flex items-center gap-3 bg-[color:var(--color-gb-blue-deep)] px-5 py-2.5">
        {/* Slide tabs */}
        <div className="flex gap-1">
          {slides.map((s, index) => (
            <button
              key={s.id}
              onClick={() => {
                setCurrent(index);
                setProgress(0);
              }}
              className={cn(
                "relative h-1 rounded-full overflow-hidden transition-all duration-300 cursor-pointer",
                index === current ? "w-12 bg-white/20" : "w-3 bg-white/10 hover:bg-white/20"
              )}
              title={`${s.volume}, ${s.issue}`}
            >
              {index === current && (
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-[color:var(--color-gb-gold)] transition-[width] duration-75 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Slide counter */}
        <span className="ml-auto text-[10px] font-mono font-bold text-white/40 tracking-wider">
          {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
