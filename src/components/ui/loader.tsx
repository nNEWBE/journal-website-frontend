"use client";

import React, { useEffect } from "react";
import { FileText } from "lucide-react";

interface LoaderProps {
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export function PremiumLoader({ text = "Loading...", fullScreen = true, className }: LoaderProps) {
  useEffect(() => {
    if (fullScreen) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      if (typeof window !== "undefined" && (window as any).__lenis) {
        (window as any).__lenis.stop();
      }
      return () => {
        document.body.style.overflow = prevBodyOverflow || "unset";
        document.documentElement.style.overflow = prevHtmlOverflow || "unset";
        if (typeof window !== "undefined" && (window as any).__lenis) {
          (window as any).__lenis.start();
        }
      };
    }
  }, [fullScreen]);

  const containerClasses = className
    ? className
    : (fullScreen
      ? "flex h-screen w-full items-center justify-center bg-white"
      : "flex items-center justify-center p-8 w-full");

  return (
    <div className={containerClasses}>
      <div className="journal-loader-container">
        <div className="academic-book">
          <div className="academic-book__spine" />

          {/* Left static page */}
          <div className="academic-book__page academic-book__page--left">
            <div className="academic-book__page-lines">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>

          {/* Right static page */}
          <div className="academic-book__page academic-book__page--right">
            <div className="academic-book__page-lines">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>

          {/* Flipping pages leafing dynamically */}
          <div className="academic-book__page academic-book__page--flipping page-1">
            <div className="academic-book__page-lines">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="academic-book__page academic-book__page--flipping page-2">
            <div className="academic-book__page-lines">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="academic-book__page academic-book__page--flipping page-3">
            <div className="academic-book__page-lines">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>

        {text && <p className="shimmer-text">{text}</p>}
      </div>
    </div>
  );
}

interface AcademicDataLoaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function AcademicDataLoader({
  title = "Loading academic records...",
  subtitle = "Synchronizing live data with journal repository",
  className,
}: AcademicDataLoaderProps) {
  return (
    <div className={`py-12 sm:py-16 px-6 flex flex-col items-center justify-center text-center select-none ${className || ""}`}>
      {/* Site Theme Academic Crest Loader */}
      <div className="relative mb-4 flex items-center justify-center">
        {/* Soft academic halo */}
        <div className="absolute -inset-2 rounded-full bg-[#1e3a8a]/10 blur-md" />

        {/* Orbit Spinner Track */}
        <div className="relative h-14 w-14 rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_16px_rgba(11,27,61,0.08)] flex items-center justify-center">
          {/* Animated Themed Ring */}
          <div className="absolute inset-1 rounded-xl border-2 border-slate-100 border-t-[#0b1b3d] border-r-[#1e3a8a] animate-spin" />

          {/* GB Official Academic Monogram */}
          <div className="relative z-10 h-7 w-7 rounded-lg bg-[#0b1b3d] text-white flex items-center justify-center font-bold text-[11px] font-academic tracking-wider shadow-xs border border-white/20">
            GB
          </div>
        </div>
      </div>

      {/* Theme Academic Typography */}
      <h4 className="font-academic text-base sm:text-[17px] font-medium text-slate-950 tracking-[-0.015em]">
        {title}
      </h4>

      {subtitle && (
        <p className="font-sans text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
          {subtitle}
        </p>
      )}

      {/* Signature Navy & Gold Progress Line */}
      <div className="mt-4 h-1 w-28 rounded-full bg-slate-100 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1b3d] via-[#1e3a8a] to-[#d97706] rounded-full animate-progress" />
      </div>
    </div>
  );
}


