"use client";

import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActiveFilterChip {
  id: string;
  label: string;
  colorClass?: string;
  onRemove: () => void;
}

export interface ActiveFilterBarProps {
  totalCount: number;
  filteredCount: number;
  itemLabel?: string;
  chips: ActiveFilterChip[];
  onResetAll: () => void;
  className?: string;
}

/**
 * Standard active filter & chip deletion bar for all dashboard management panels.
 * Renders live result counter, clickable dismissible chips, and "Reset all filters".
 */
export function ActiveFilterBar({
  totalCount,
  filteredCount,
  itemLabel = "records",
  chips,
  onResetAll,
  className,
}: ActiveFilterBarProps) {
  // If no filters are active and all records are shown, keep it hidden or compact
  if (chips.length === 0 && filteredCount === totalCount) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 px-4 sm:px-5 py-2.5 bg-slate-50/75 border-t border-slate-100 flex-wrap text-xs transition-all animate-fade",
        className
      )}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-semibold text-slate-500">
          Showing <strong>{filteredCount}</strong> of {totalCount} {itemLabel}
        </span>

        {chips.map((chip) => (
          <span
            key={chip.id}
            className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shadow-2xs",
              chip.colorClass || "bg-amber-50 text-amber-800"
            )}
          >
            <span>{chip.label}</span>
            <button
              type="button"
              onClick={chip.onRemove}
              className="hover:opacity-75 cursor-pointer ml-0.5 rounded p-0.5 hover:bg-black/5 transition-colors"
              title={`Remove ${chip.label}`}
              aria-label={`Remove ${chip.label}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>

      {chips.length > 0 && (
        <button
          type="button"
          onClick={onResetAll}
          className="text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer hover:underline ml-auto shrink-0 transition-colors"
        >
          Reset all filters
        </button>
      )}
    </div>
  );
}
