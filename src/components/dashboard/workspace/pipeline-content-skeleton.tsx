"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PipelineContentSkeletonProps {
  rows?: number;
  className?: string;
}

export function PipelineContentSkeleton({
  rows = 5,
  className,
}: PipelineContentSkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden",
        className
      )}
    >
      {/* 1. Header Toolbar Skeleton with Distinct Borders */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 px-4 sm:px-6 py-4 bg-slate-50/70">
        <div className="flex items-center gap-3">
          {/* Icon Box Skeleton with border */}
          <div className="h-8 w-8 rounded-xl border border-slate-200 bg-slate-100 animate-pulse shrink-0" />
          <div className="space-y-1.5">
            {/* Title Skeleton with border */}
            <div className="h-3.5 w-36 rounded-md border border-slate-200 bg-slate-100 animate-pulse" />
            {/* Subtitle Skeleton with border */}
            <div className="h-2.5 w-52 rounded-md border border-slate-200/80 bg-slate-100/70 animate-pulse" />
          </div>
        </div>

        {/* Search & Actions Skeleton with borders */}
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-44 sm:w-60 rounded-xl border border-slate-200 bg-white px-3 flex items-center gap-2 shadow-2xs">
            <div className="h-3.5 w-3.5 rounded-full border border-slate-200 bg-slate-100 animate-pulse shrink-0" />
            <div className="h-3 w-28 rounded border border-slate-200 bg-slate-100 animate-pulse" />
          </div>
          <div className="h-9 w-20 rounded-xl border border-slate-200 bg-slate-100 animate-pulse shrink-0" />
        </div>
      </div>

      {/* 2. Status Filter Tabs Bar Skeleton with Borders */}
      <div className="border-b border-slate-200 px-4 sm:px-6 py-2.5 bg-white flex items-center gap-2 overflow-x-auto">
        {[20, 24, 28, 22, 26].map((w, idx) => (
          <div
            key={idx}
            className={cn(
              "h-7 rounded-lg border animate-pulse shrink-0",
              idx === 0
                ? "w-16 bg-blue-50/70 border-blue-200"
                : "border-slate-200 bg-slate-50"
            )}
            style={{ width: `${w * 4}px` }}
          />
        ))}
      </div>

      {/* 3. Desktop Table View with Borders on every column and cell */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-6 w-80">
                <div className="h-3 w-24 rounded border border-slate-200 bg-slate-100 animate-pulse" />
              </th>
              <th className="py-3 px-4 w-40">
                <div className="h-3 w-16 rounded border border-slate-200 bg-slate-100 animate-pulse" />
              </th>
              <th className="py-3 px-4 w-48">
                <div className="h-3 w-20 rounded border border-slate-200 bg-slate-100 animate-pulse" />
              </th>
              <th className="py-3 px-4 w-28">
                <div className="h-3 w-14 rounded border border-slate-200 bg-slate-100 animate-pulse" />
              </th>
              <th className="py-3 px-4 w-36">
                <div className="h-3 w-18 rounded border border-slate-200 bg-slate-100 animate-pulse" />
              </th>
              <th className="py-3 px-6 text-right w-36">
                <div className="h-3 w-16 rounded border border-slate-200 bg-slate-100 animate-pulse ml-auto" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {Array.from({ length: rows }).map((_, idx) => (
              <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                {/* Column 1: Manuscript ID & Title & Author */}
                <td className="py-4 px-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-20 rounded border border-slate-200 bg-slate-100 animate-pulse" />
                      <div className="h-4 w-16 rounded border border-slate-200 bg-slate-50 animate-pulse" />
                    </div>
                    <div className="h-3.5 w-64 max-w-full rounded border border-slate-200 bg-slate-100 animate-pulse" />
                    <div className="h-2.5 w-36 rounded border border-slate-200 bg-slate-100/70 animate-pulse" />
                  </div>
                </td>

                {/* Column 2: Status Badge */}
                <td className="py-4 px-4">
                  <div className="h-6 w-28 rounded-full border border-slate-200 bg-slate-100 animate-pulse" />
                </td>

                {/* Column 3: Reviewers Assigned */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full border border-slate-200 bg-slate-100 animate-pulse shrink-0" />
                    <div className="space-y-1">
                      <div className="h-2.5 w-20 rounded border border-slate-200 bg-slate-100 animate-pulse" />
                      <div className="h-2 w-14 rounded border border-slate-200 bg-slate-100/70 animate-pulse" />
                    </div>
                  </div>
                </td>

                {/* Column 4: Score */}
                <td className="py-4 px-4">
                  <div className="h-7 w-12 rounded-lg border border-slate-200 bg-slate-100 animate-pulse" />
                </td>

                {/* Column 5: Due Date */}
                <td className="py-4 px-4">
                  <div className="h-6 w-24 rounded-lg border border-slate-200 bg-slate-100 animate-pulse" />
                </td>

                {/* Column 6: Actions */}
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <div className="h-8 w-8 rounded-lg border border-slate-200 bg-slate-100 animate-pulse" />
                    <div className="h-8 w-18 rounded-lg border border-slate-200 bg-slate-100 animate-pulse" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. Mobile Card View with Borders on each card and inner block */}
      <div className="md:hidden divide-y divide-slate-200 p-3 space-y-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-3 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 rounded border border-slate-200 bg-slate-100 animate-pulse" />
              <div className="h-5 w-24 rounded-full border border-slate-200 bg-slate-100 animate-pulse" />
            </div>
            <div className="h-3.5 w-full rounded border border-slate-200 bg-slate-100 animate-pulse" />
            <div className="h-3 w-40 rounded border border-slate-200 bg-slate-100/80 animate-pulse" />
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div className="h-6 w-20 rounded border border-slate-200 bg-slate-100 animate-pulse" />
              <div className="h-7 w-20 rounded-lg border border-slate-200 bg-slate-100 animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* 5. Footer Pagination Skeleton with Borders */}
      <div className="border-t border-slate-200 px-4 sm:px-6 py-3 bg-slate-50/50 flex items-center justify-between">
        <div className="h-3 w-32 rounded border border-slate-200 bg-slate-100 animate-pulse" />
        <div className="flex items-center gap-1.5">
          <div className="h-7 w-7 rounded-lg border border-slate-200 bg-slate-100 animate-pulse" />
          <div className="h-7 w-7 rounded-lg border border-slate-200 bg-slate-100 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
