"use client";

import React from "react";
import { Search, X, List, LayoutGrid, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DashboardTableHeaderProps {
  /** Leading icon component */
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  /** Custom classes for the icon inside the box */
  iconClassName?: string;
  /** Custom classes for the icon container box */
  iconBoxClassName?: string;

  /** Title text or element (styled uppercase bold by default) */
  title: React.ReactNode;
  titleClassName?: string;

  /** Dynamic item count, e.g. 5, 7 */
  totalCount?: number;
  /** Singular unit name for the count, defaults to "record" */
  countUnit?: string;
  /** Subtitle context, e.g. "double-blind peer review", "role-based directory" */
  subtitle?: React.ReactNode;

  /** Search query state string */
  searchQuery?: string;
  /** Search query update handler */
  onSearchChange?: (query: string) => void;
  /** Search input placeholder text */
  searchPlaceholder?: string;
  /** Width class for search input wrapper (default: "w-full sm:w-60 md:w-72") */
  searchWidth?: string;

  /** Optional view mode state for table vs card grid */
  viewMode?: "table" | "grid";
  /** Optional view mode toggle handler */
  onViewModeChange?: (mode: "table" | "grid") => void;

  /** Custom extra elements (e.g. CustomSelect dropdowns, action buttons) */
  children?: React.ReactNode;

  /** Additional className on outer header container */
  className?: string;
}

/**
 * Reusable table & section header for all administrative and operational dashboard panels.
 * Provides unified visual styling: icon badge + title + live counter on the left,
 * and optional custom selects, search bar, and Table/Grid switcher on the right.
 */
export function DashboardTableHeader({
  icon: Icon,
  iconClassName = "h-5 w-5 text-gb-blue",
  iconBoxClassName = "h-8.5 w-8.5 rounded-lg bg-gb-blue-soft flex items-center justify-center shrink-0",
  title,
  titleClassName,
  totalCount,
  countUnit = "record",
  subtitle,
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  searchWidth = "w-full sm:w-60 md:w-72",
  viewMode,
  onViewModeChange,
  children,
  className,
}: DashboardTableHeaderProps) {
  const showSearch = onSearchChange !== undefined;
  const showViewToggle = viewMode !== undefined && onViewModeChange !== undefined;

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 border-b border-slate-200/80 px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50/50",
        className
      )}
    >
      {/* Left: Icon Badge + Title + Live Record Count */}
      <div className="flex items-center gap-2.5">
        {Icon && (
          <div className={iconBoxClassName}>
            <Icon className={iconClassName} />
          </div>
        )}
        <div>
          <h2
            className={cn(
              "text-xs font-bold text-(--color-gb-ink) uppercase tracking-wider",
              titleClassName
            )}
          >
            {title}
          </h2>
          {(totalCount !== undefined || subtitle) && (
            <p className="text-[11px] text-slate-500" suppressHydrationWarning>
              {totalCount !== undefined && (
                <>
                  {`${totalCount} ${countUnit}${totalCount !== 1 ? "s" : ""}`}
                  {subtitle && " · "}
                </>
              )}
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Custom Selects/Actions + Search Input + Table/Grid Switcher */}
      {(children || showSearch || showViewToggle) && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {children}

          {/* Search Input */}
          {showSearch && (
            <div className={cn("relative", searchWidth)}>
              <div className="flex items-center gap-2 h-9 rounded-xl border border-slate-200/90 bg-white px-3 focus-within:border-gb-blue focus-within:ring-2 focus-within:ring-blue-500/10 transition-all shadow-2xs">
                <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery ?? ""}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full bg-transparent text-xs font-medium text-slate-800 outline-none placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange("")}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer p-0.5 shrink-0"
                    title="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Table / Grid Switcher */}
          {showViewToggle && (
            <div className="flex items-center h-9 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shrink-0">
              <button
                type="button"
                onClick={() => onViewModeChange("table")}
                className={cn(
                  "flex items-center gap-1.5 px-3 h-7 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  viewMode === "table"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                )}
                title="Dense Table View"
              >
                <List className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("grid")}
                className={cn(
                  "flex items-center gap-1.5 px-3 h-7 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  viewMode === "grid"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                )}
                title="Card Grid View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
