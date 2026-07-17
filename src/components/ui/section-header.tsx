"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
  actions?: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
}

export function SectionHeader({
  title,
  description,
  icon: Icon,
  actions,
  className,
  size = "md",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 border-b border-[color:var(--color-gb-border)] pb-3",
        className
      )}
    >
      <div className="flex items-start gap-2.5">
        {Icon && (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[color:var(--color-gb-blue-soft)] mt-0.5">
            <Icon className="h-3.5 w-3.5 text-[color:var(--color-gb-blue)]" />
          </div>
        )}
        <div>
          <h2
            className={cn(
              "font-black leading-tight text-[color:var(--color-gb-ink)]",
              size === "md" ? "text-sm" : "text-xs"
            )}
          >
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-[11px] leading-relaxed text-[color:var(--color-gb-muted)]">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
