"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface DashboardBannerHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: React.ComponentType<{ className?: string }>;
  actions?: React.ReactNode;
  portalRef?: React.Ref<HTMLDivElement>;
  borderAccentClassName?: string;
  badgeClassName?: string;
  className?: string;
  animate?: boolean;
}

export function DashboardBannerHeader({
  title,
  subtitle,
  badge,
  icon: Icon,
  actions,
  portalRef,
  borderAccentClassName,
  badgeClassName,
  className,
  animate = false,
}: DashboardBannerHeaderProps) {
  const containerClasses = cn(
    "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-l-4 border-(--color-gb-border) px-5 sm:px-6 py-4 sm:py-5 bg-white/70 backdrop-blur-sm shadow-[inset_0_-1px_0_rgba(17,27,82,0.02)] transition-all duration-300",
    borderAccentClassName || "border-l-[color:var(--color-gb-blue)]",
    className
  );

  const defaultBadgeClass =
    "bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)] border-[color:var(--color-gb-blue)]/10";
  const appliedBadgeClass = badgeClassName || defaultBadgeClass;

  const content = (
    <>
      <div className="flex items-start gap-4">
        {Icon && (
          <div
            className={cn(
              "p-3 rounded-2xl border flex items-center justify-center shadow-xs shrink-0 mt-0.5",
              appliedBadgeClass
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          {badge && (
            <div className="flex items-center gap-2 mb-1">
              <span
                className={cn(
                  "text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md border leading-none font-sans",
                  appliedBadgeClass
                )}
              >
                {badge}
              </span>
            </div>
          )}
          <h1 className="mt-1.5 text-xl sm:text-2xl font-black text-(--color-gb-ink) tracking-tight font-academic">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 max-w-3xl text-xs sm:text-sm text-(--color-gb-muted) leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {(actions || portalRef) && (
        <div className="flex items-center gap-2.5 self-start sm:self-center flex-wrap shrink-0">
          {actions}
          {portalRef && <div ref={portalRef} className="flex items-center gap-2 flex-wrap" />}
        </div>
      )}
    </>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2 }}
        className={containerClasses}
      >
        {content}
      </motion.div>
    );
  }

  return <div className={containerClasses}>{content}</div>;
}
