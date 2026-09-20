"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { DashboardBannerHeader, type DashboardBannerHeaderProps } from "./dashboard-banner-header";
import { MANAGEMENT_PAGE_HEADERS } from "./dashboard-page-wrapper";
import { PipelineContentSkeleton } from "./workspace/pipeline-content-skeleton";

export interface DashboardPageSkeletonProps {
  header?: DashboardBannerHeaderProps | false;
  pathname?: string;
  className?: string;
}

export function DashboardPageSkeleton({
  header,
  pathname,
  className,
}: DashboardPageSkeletonProps) {
  // Try resolving real banner header if available from definitions
  const resolvedHeader: DashboardBannerHeaderProps | null =
    header !== false
      ? (typeof header === "object"
          ? header
          : pathname && MANAGEMENT_PAGE_HEADERS[pathname]
          ? MANAGEMENT_PAGE_HEADERS[pathname]
          : null)
      : null;

  return (
    <div className={cn("min-h-full flex flex-col space-y-6", className)}>
      {/* 1. Header: Real banner if known, otherwise elegant Header Skeleton */}
      {header !== false && (
        resolvedHeader ? (
          <DashboardBannerHeader {...resolvedHeader} />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-500 via-indigo-500 to-transparent opacity-80" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-xl border border-slate-200 bg-slate-100 animate-pulse shrink-0" />
                <div className="space-y-2">
                  <div className="h-5 w-44 sm:w-60 rounded-md border border-slate-200 bg-slate-100 animate-pulse" />
                  <div className="h-3.5 w-64 sm:w-96 rounded-md border border-slate-200/80 bg-slate-100/70 animate-pulse" />
                </div>
              </div>
              <div className="h-7 w-28 rounded-full border border-slate-200 bg-slate-100 animate-pulse shrink-0" />
            </div>
          </div>
        )
      )}

      {/* 2. Body Content Skeleton Area */}
      <div className="p-4 sm:p-6 space-y-6 flex-1">
        {/* KPI Stats Grid Skeleton with crisp borders */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { labelW: "w-20", valW: "w-10", subW: "w-28" },
            { labelW: "w-24", valW: "w-12", subW: "w-24" },
            { labelW: "w-16", valW: "w-8", subW: "w-32" },
            { labelW: "w-28", valW: "w-14", subW: "w-20" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-white p-4 space-y-2.5 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    "h-3 rounded border border-slate-200 bg-slate-100 animate-pulse",
                    item.labelW
                  )}
                />
                <div className="h-6 w-6 rounded-lg border border-slate-200 bg-slate-100 animate-pulse" />
              </div>
              <div
                className={cn(
                  "h-7 rounded border border-slate-200 bg-slate-100 animate-pulse",
                  item.valW
                )}
              />
              <div
                className={cn(
                  "h-2.5 rounded border border-slate-200/70 bg-slate-100/60 animate-pulse",
                  item.subW
                )}
              />
            </div>
          ))}
        </div>

        {/* Structured Table / Content Skeleton with crisp borders */}
        <PipelineContentSkeleton rows={6} />
      </div>
    </div>
  );
}
