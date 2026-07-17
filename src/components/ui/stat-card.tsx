"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: { value: number; label: string };
  accent?: "blue" | "green" | "amber" | "red" | "violet";
  className?: string;
  index?: number;
}

const accentMap = {
  blue: {
    icon: "text-[color:var(--color-gb-blue)]",
    bg: "bg-[color:var(--color-gb-blue-soft)]",
    border: "border-[color:var(--color-gb-border)]",
  },
  green: {
    icon: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  amber: {
    icon: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  red: {
    icon: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-100",
  },
  violet: {
    icon: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
};

const accentColorMap = {
  blue: "#2563eb",
  violet: "#8b5cf6",
  green: "#10b981",
  amber: "#f59e0b",
  red: "#ef4444",
};

const sparklinePaths = [
  "M 0 24 Q 10 9, 20 16 T 40 6 T 60 14 T 80 3",
  "M 0 21 Q 10 3, 20 14 T 40 9 T 60 15 T 80 4",
  "M 0 26 Q 10 16, 20 21 T 40 9 T 60 6 T 80 1",
  "M 0 16 Q 10 14, 20 15 T 40 9 T 60 11 T 80 8",
  "M 0 6 Q 10 16, 20 11 T 40 21 T 60 14 T 80 18",
  "M 0 22 Q 10 14, 20 11 T 40 8 T 60 4 T 80 1",
];

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = "blue",
  className,
  index = 0,
}: StatCardProps) {
  const colors = accentMap[accent];
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const target = parseInt(String(value));
    if (isNaN(target)) {
      setDisplayValue(value as any);
      return;
    }

    let start = 0;
    const end = target;
    if (start === end) {
      setDisplayValue(end);
      return;
    }

    const duration = 1000; // 1s
    const startTime = performance.now();

    const animateCount = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(easeProgress * (end - start) + start);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-[color:var(--color-gb-border)] bg-white p-4 shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      <div className="flex flex-col justify-between h-full min-h-[76px] relative z-10">
        {/* Top Row: Label + Icon */}
        <div className="flex items-start justify-between">
          <p className="text-[10px] font-black uppercase tracking-wider text-[color:var(--color-gb-muted)]">
            {label}
          </p>
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3 shrink-0 ml-3",
              colors.bg
            )}
          >
            <Icon className={cn("h-3.5 w-3.5", colors.icon)} />
          </div>
        </div>

        {/* Bottom Row: Value/Trend + Sparkline */}
        <div className="flex items-end justify-between mt-3">
          <div className="min-w-0">
            <p className="text-2xl font-black tracking-tight text-[color:var(--color-gb-ink)] leading-none">
              {displayValue}
            </p>
            {trend && (
              <p className="mt-1 flex items-center gap-1 text-[9px] font-bold">
                <span className={trend.value >= 0 ? "text-emerald-600" : "text-red-500"}>
                  {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
                </span>
                <span className="text-[8px] text-[color:var(--color-gb-muted)] font-medium">
                  {trend.label}
                </span>
              </p>
            )}
          </div>

          {/* Sparkline placed on bottom right (prevents any overlap) */}
          <div className="h-7 w-16 overflow-hidden pointer-events-none select-none opacity-50 group-hover:opacity-100 transition-opacity duration-300 shrink-0">
            <svg className="w-full h-full" viewBox="0 0 80 30" preserveAspectRatio="none">
              <defs>
                <linearGradient id={`gradient-${accent}-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accentColorMap[accent]} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={accentColorMap[accent]} stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path
                d={`${sparklinePaths[index % 6]} L 80 30 L 0 30 Z`}
                fill={`url(#gradient-${accent}-${index})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 + 0.3 }}
              />
              <motion.path
                d={sparklinePaths[index % 6]}
                fill="none"
                stroke={accentColorMap[accent]}
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.0, delay: index * 0.05, ease: "easeOut" }}
              />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

