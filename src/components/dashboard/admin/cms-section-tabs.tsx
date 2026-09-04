"use client";

import React, { useRef, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CmsSectionTabItem {
  key: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  shortDesc?: string;
  isCustom?: boolean;
  published?: boolean;
}

export interface CmsSectionTabsProps {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  tabs: CmsSectionTabItem[];
  activeTabKey: string;
  onTabChange: (key: string) => void;
  currentIndex?: number;
  totalCount?: number;
  className?: string;
}

export function CmsSectionTabs({
  title,
  subtitle = "Select a section tab to configure its layout, content, and visibility",
  icon: HeaderIcon = Layers,
  tabs,
  activeTabKey,
  onTabChange,
  currentIndex,
  totalCount,
  className,
}: CmsSectionTabsProps) {
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false);

  const count = totalCount ?? tabs.length;
  const activeIdx =
    currentIndex !== undefined && currentIndex >= 0
      ? currentIndex
      : tabs.findIndex((t) => t.key === activeTabKey);

  const checkScroll = () => {
    const el = tabsContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  };

  const scrollTabs = (direction: "left" | "right") => {
    if (tabsContainerRef.current) {
      const offset = direction === "left" ? -220 : 220;
      tabsContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
      setTimeout(checkScroll, 320);
    }
  };

  // Observe scroll and window resize
  useEffect(() => {
    checkScroll();
    const el = tabsContainerRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);

    const timer = setTimeout(checkScroll, 120);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      clearTimeout(timer);
    };
  }, [tabs]);

  // When active tab changes, ensure scroll status updates
  useEffect(() => {
    checkScroll();
    const timer = setTimeout(checkScroll, 150);
    return () => clearTimeout(timer);
  }, [activeTabKey]);

  if (tabs.length === 0) return null;

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs space-y-3",
        className
      )}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
            <HeaderIcon className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-slate-900">{title}</span>
            {subtitle && (
              <span className="text-[11px] text-slate-400 ml-2 hidden sm:inline">
                {subtitle}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-lg border border-slate-200/70 shrink-0">
          <span>
            {activeIdx >= 0 ? `Section ${activeIdx + 1} of ${count}` : `${count} Sections`}
          </span>
        </div>
      </div>

      {/* Scrollable Tabs Row with Dynamic Left and Right Arrows + Gradient Fade */}
      <div className="relative flex items-center">
        {/* Left Arrow & Fade Overlay */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center pointer-events-none">
            <button
              type="button"
              onClick={() => scrollTabs("left")}
              className="pointer-events-auto h-8 w-8 rounded-xl border border-slate-200 bg-white/95 backdrop-blur-xs text-slate-700 hover:bg-slate-100 hover:text-slate-900 flex items-center justify-center shrink-0 shadow-sm transition-all cursor-pointer"
              title="Scroll left"
              aria-label="Scroll left"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="w-10 h-full bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none" />
          </div>
        )}

        {/* Scrollable Tabs Track (Zero Native Scrollbar) */}
        <div
          ref={tabsContainerRef}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="no-scrollbar flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth flex-1 py-0.5 px-0.5"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon || Layers;
            const isActive = activeTabKey === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onTabChange(tab.key)}
                className={cn(
                  "group relative flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0",
                  isActive
                    ? "bg-[color:var(--color-gb-blue)] text-white shadow-xs font-bold"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70"
                )}
                title={tab.shortDesc || tab.label}
              >
                <Icon
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 transition-colors",
                    isActive ? "text-white" : "text-slate-500 group-hover:text-slate-800"
                  )}
                />
                <span className="truncate max-w-[130px] sm:max-w-[150px]">{tab.label}</span>

                {tab.isCustom && (
                  <span
                    className={cn(
                      "text-[8.5px] uppercase font-bold px-1 rounded",
                      isActive ? "bg-white/20 text-white" : "bg-amber-100 text-amber-800"
                    )}
                  >
                    Custom
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Arrow & Fade Overlay */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center justify-end pointer-events-none">
            <div className="w-10 h-full bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none" />
            <button
              type="button"
              onClick={() => scrollTabs("right")}
              className="pointer-events-auto h-8 w-8 rounded-xl border border-slate-200 bg-white/95 backdrop-blur-xs text-slate-700 hover:bg-slate-100 hover:text-slate-900 flex items-center justify-center shrink-0 shadow-sm transition-all cursor-pointer"
              title="Scroll right"
              aria-label="Scroll right"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
