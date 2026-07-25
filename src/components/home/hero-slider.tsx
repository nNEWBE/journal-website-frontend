"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Archive,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
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
    setCurrent((previous) => (previous + 1) % slides.length);
    setProgress(0);
  }, []);

  const handlePrevious = useCallback(() => {
    setCurrent(
      (previous) => (previous - 1 + slides.length) % slides.length
    );
    setProgress(0);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((previous) => {
        if (previous >= 100) {
          handleNext();
          return 0;
        }
        return previous + 100 / (SLIDE_DURATION / 50);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [handleNext]);

  const slide = slides[current];

  return (
    <div className="hero-publication-card relative overflow-hidden rounded-[22px] border border-white/15 bg-white/[0.06] p-3 shadow-[0_28px_70px_rgba(0,0,0,0.24)] backdrop-blur-md transition-all hover:border-white/25 hover:bg-white/[0.08]">
      <div className="flex items-center justify-between gap-4 px-2.5 py-2">
        <span className="text-[8px] font-black uppercase tracking-[0.16em] text-white/90">
          GB Journal · Issue record
        </span>
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.08em] text-amber-300">
          {slide.volume} / {slide.issue}
        </span>
      </div>

      <div className="group/cover relative aspect-[16/10] overflow-hidden rounded-[16px] bg-[color:var(--color-gb-blue-deep)]">
        {slides.map((item, index) => {
          const isActive = index === current;
          return (
            <div
              key={item.id}
              className={cn(
                "absolute inset-0 transition-all duration-[1000ms] ease-out",
                isActive
                  ? "z-10 scale-100 opacity-100"
                  : "z-0 scale-[1.045] opacity-0"
              )}
            >
              <Image
                src={item.image}
                alt=""
                fill
                priority={index === 0}
                sizes="(max-width: 1023px) 100vw, 48vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060b2f]/95 via-[#060b2f]/45 to-[#060b2f]/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#060b2f]/55 via-transparent to-transparent" />
            </div>
          );
        })}

        <div className="absolute inset-0 z-20 flex flex-col justify-between p-5 text-white sm:p-6">
          <div>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.12em] backdrop-blur-md",
                slide.isCurrent
                  ? "border-emerald-300/25 bg-emerald-400/15 text-emerald-100"
                  : "border-white/15 bg-slate-950/30 text-white/65"
              )}
            >
              {slide.isCurrent ? (
                <BookOpen className="h-3 w-3" />
              ) : (
                <Archive className="h-3 w-3" />
              )}
              {slide.isCurrent ? "Current issue" : "Archive"}
            </span>
          </div>

          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.17em] text-amber-300">
              Issue theme
            </p>
            <h2 className="mt-2.5 max-w-md font-academic text-2xl font-bold leading-[1.12] tracking-[-0.02em] text-white sm:text-[1.75rem]">
              {slide.theme}
            </h2>
            <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-white/15 pt-3.5">
              <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white/70">
                <CalendarDays className="h-3.5 w-3.5 text-white/60" />
                {slide.month}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white/70">
                <ShieldCheck className="h-3.5 w-3.5 text-white/60" />
                Peer reviewed
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePrevious}
          aria-label="Show previous issue"
          className="absolute left-3 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-slate-950/35 text-white opacity-0 backdrop-blur-md transition-all hover:bg-slate-950/60 group-hover/cover:opacity-100 focus:opacity-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          aria-label="Show next issue"
          className="absolute right-3 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-slate-950/35 text-white opacity-0 backdrop-blur-md transition-all hover:bg-slate-950/60 group-hover/cover:opacity-100 focus:opacity-100"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-3 px-3 py-3">
        <div className="flex items-center gap-1.5">
          {slides.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setCurrent(index);
                setProgress(0);
              }}
              aria-label={`Show ${item.volume}, ${item.issue}`}
              className={cn(
                "relative h-1 overflow-hidden rounded-full bg-white/20 transition-all",
                index === current ? "w-10" : "w-2.5 hover:bg-white/40"
              )}
            >
              {index === current && (
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-[color:var(--color-gb-gold)] transition-[width] duration-75 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              )}
            </button>
          ))}
        </div>
        <span className="font-mono text-[9px] font-bold text-white/70">
          {String(current + 1).padStart(2, "0")} /{" "}
          {String(slides.length).padStart(2, "0")}
        </span>
        <Link
          href="/issues/current"
          className="group/link ml-auto inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.09em] text-white hover:text-amber-300 transition-colors focus-ring"
        >
          <span>Explore issue</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white transition-all group-hover/link:bg-[color:var(--color-gb-gold)] group-hover/link:text-[color:var(--color-gb-blue-deep)] group-hover/link:border-transparent">
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}
