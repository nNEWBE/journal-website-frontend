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
      {/* Signature Academic Journal Book Animation */}
      <div className="relative mb-5 flex items-center justify-center scale-90">
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
      </div>

      {/* Clean Modern Typography */}
      <h4 className="text-sm font-semibold text-slate-800 tracking-tight font-sans">
        {title}
      </h4>

      {subtitle && (
        <p className="text-xs text-slate-400 mt-1 font-normal max-w-sm leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}


