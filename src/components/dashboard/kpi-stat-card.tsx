"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const KPI_ACCENT_MAP = {
  blue: {
    iconColor: "text-blue-600",
    bgGradient: "bg-gradient-to-br from-blue-50 to-blue-100/60",
    border: "border-blue-200/70",
    hoverBorder: "hover:border-blue-300/80",
    watermark: "text-blue-600/[0.04] group-hover:text-blue-600/[0.08]",
    badge: "bg-blue-50 text-blue-700 border-blue-200/80",
    activeRing: "ring-2 ring-blue-600 border-transparent bg-gradient-to-b from-blue-50/30 to-white shadow-md",
  },
  emerald: {
    iconColor: "text-emerald-600",
    bgGradient: "bg-gradient-to-br from-emerald-50 to-emerald-100/60",
    border: "border-emerald-200/70",
    hoverBorder: "hover:border-emerald-300/80",
    watermark: "text-emerald-600/[0.04] group-hover:text-emerald-600/[0.08]",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    activeRing: "ring-2 ring-emerald-600 border-transparent bg-gradient-to-b from-emerald-50/30 to-white shadow-md",
  },
  green: {
    iconColor: "text-emerald-600",
    bgGradient: "bg-gradient-to-br from-emerald-50 to-emerald-100/60",
    border: "border-emerald-200/70",
    hoverBorder: "hover:border-emerald-300/80",
    watermark: "text-emerald-600/[0.04] group-hover:text-emerald-600/[0.08]",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    activeRing: "ring-2 ring-emerald-600 border-transparent bg-gradient-to-b from-emerald-50/30 to-white shadow-md",
  },
  amber: {
    iconColor: "text-amber-600",
    bgGradient: "bg-gradient-to-br from-amber-50 to-amber-100/60",
    border: "border-amber-200/70",
    hoverBorder: "hover:border-amber-300/80",
    watermark: "text-amber-600/[0.04] group-hover:text-amber-600/[0.08]",
    badge: "bg-amber-50 text-amber-700 border-amber-200/80",
    activeRing: "ring-2 ring-amber-500 border-transparent bg-gradient-to-b from-amber-50/30 to-white shadow-md",
  },
  indigo: {
    iconColor: "text-indigo-600",
    bgGradient: "bg-gradient-to-br from-indigo-50 to-indigo-100/60",
    border: "border-indigo-200/70",
    hoverBorder: "hover:border-indigo-300/80",
    watermark: "text-indigo-600/[0.04] group-hover:text-indigo-600/[0.08]",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
    activeRing: "ring-2 ring-indigo-600 border-transparent bg-gradient-to-b from-indigo-50/30 to-white shadow-md",
  },
  purple: {
    iconColor: "text-purple-600",
    bgGradient: "bg-gradient-to-br from-purple-50 to-purple-100/60",
    border: "border-purple-200/70",
    hoverBorder: "hover:border-purple-300/80",
    watermark: "text-purple-600/[0.04] group-hover:text-purple-600/[0.08]",
    badge: "bg-purple-50 text-purple-700 border-purple-200/80",
    activeRing: "ring-2 ring-purple-600 border-transparent bg-gradient-to-b from-purple-50/30 to-white shadow-md",
  },
  violet: {
    iconColor: "text-purple-600",
    bgGradient: "bg-gradient-to-br from-purple-50 to-purple-100/60",
    border: "border-purple-200/70",
    hoverBorder: "hover:border-purple-300/80",
    watermark: "text-purple-600/[0.04] group-hover:text-purple-600/[0.08]",
    badge: "bg-purple-50 text-purple-700 border-purple-200/80",
    activeRing: "ring-2 ring-purple-600 border-transparent bg-gradient-to-b from-purple-50/30 to-white shadow-md",
  },
  sky: {
    iconColor: "text-sky-600",
    bgGradient: "bg-gradient-to-br from-sky-50 to-sky-100/60",
    border: "border-sky-200/70",
    hoverBorder: "hover:border-sky-300/80",
    watermark: "text-sky-600/[0.04] group-hover:text-sky-600/[0.08]",
    badge: "bg-sky-50 text-sky-700 border-sky-200/80",
    activeRing: "ring-2 ring-sky-500 border-transparent bg-gradient-to-b from-sky-50/30 to-white shadow-md",
  },
  rose: {
    iconColor: "text-rose-600",
    bgGradient: "bg-gradient-to-br from-rose-50 to-rose-100/60",
    border: "border-rose-200/70",
    hoverBorder: "hover:border-rose-300/80",
    watermark: "text-rose-600/[0.04] group-hover:text-rose-600/[0.08]",
    badge: "bg-rose-50 text-rose-700 border-rose-200/80",
    activeRing: "ring-2 ring-rose-600 border-transparent bg-gradient-to-b from-rose-50/30 to-white shadow-md",
  },
};

export type KpiAccent = keyof typeof KPI_ACCENT_MAP;

export interface KpiStatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent?: KpiAccent;
  badge?: string;
  sublabel?: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function KpiStatCard({
  label,
  value,
  icon: Icon,
  accent = "blue",
  badge,
  sublabel,
  active,
  onClick,
  className,
}: KpiStatCardProps) {
  const cfg = KPI_ACCENT_MAP[accent] || KPI_ACCENT_MAP.blue;
  const isClickable = Boolean(onClick);
  const Tag = isClickable ? "button" : "div";

  return (
    <Tag
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-white p-4 sm:p-5 shadow-xs transition-all duration-200 text-left",
        isClickable
          ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5 w-full"
          : "hover:shadow-md hover:-translate-y-0.5",
        active
          ? cfg.activeRing
          : cn("border-slate-200/80", cfg.hoverBorder),
        className
      )}
    >
      {/* Decorative Watermark Icon (4% opacity, reacts on hover) */}
      <Icon
        className={cn(
          "absolute -right-2 -bottom-2 h-16 w-16 group-hover:scale-110 transition-all duration-300 pointer-events-none",
          cfg.watermark
        )}
      />

      <div className="relative z-10 flex flex-col justify-between h-full space-y-2">
        {/* Main Content Row */}
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div
            className={cn(
              "h-11 w-11 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl border flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200",
              cfg.bgGradient,
              cfg.border,
              cfg.iconColor
            )}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate font-sans">
                {label}
              </p>
              {badge && (
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full border tracking-wide whitespace-nowrap shrink-0 leading-tight",
                    cfg.badge
                  )}
                >
                  {badge}
                </span>
              )}
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-academic tabular-nums mt-0.5 leading-none">
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
          </div>
        </div>

        {/* Optional Sublabel Row */}
        {sublabel && (
          <div className="pt-2 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>{sublabel}</span>
          </div>
        )}
      </div>
    </Tag>
  );
}
