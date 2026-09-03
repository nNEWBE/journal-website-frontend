"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DashboardSearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  searchWidth?: string;
  children?: React.ReactNode;
  className?: string;
}

export function DashboardSearchFilterBar({
  searchQuery,
  onSearchChange,
  placeholder = "Search...",
  searchWidth = "w-full sm:w-72 md:w-80 lg:w-96",
  children,
  className,
}: DashboardSearchFilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 shadow-xs",
        className
      )}
    >
      {/* Search Input Container with Controlled Width (prevents stretching too long) */}
      <div className={cn("relative shrink-0", searchWidth)}>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 focus-within:border-[color:var(--color-gb-blue)] focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/10 transition-all shadow-2xs">
          <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent text-xs font-medium text-[color:var(--color-gb-ink)] outline-none placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 shrink-0 rounded transition-colors"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter controls, dropdowns, and extra action slot on the right */}
      {children && (
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap justify-start sm:justify-end min-w-0">
          {children}
        </div>
      )}
    </div>
  );
}
