import React, { ElementType } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "dark"
  | "glass";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export function Badge({
  variant = "default",
  children,
  className,
  icon,
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-slate-100 text-slate-700 border-slate-200/60",
    info: "bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue-dark)] border-[color:var(--color-gb-border)]",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    warning: "bg-amber-50 text-amber-800 border-amber-200/60",
    error: "bg-red-50 text-red-700 border-red-200/60",
    dark: "bg-white/10 text-white border-white/15",
    glass: "bg-white/[0.04] text-white/75 border-white/10 text-[10px] font-medium tracking-normal normal-case",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] md:text-xs font-black uppercase tracking-wider transition-all select-none w-fit",
        variantStyles[variant],
        className
      )}
    >
      {icon && <span className="shrink-0 [&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

export function SupportingTag({
  icon: Icon,
  children,
  className = "",
}: {
  icon?: ElementType;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium text-white/75 select-none",
        className
      )}
    >
      {Icon && <Icon className="h-3 w-3 text-amber-300 shrink-0" aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
}

export { SectionBadge, NumberedBadge, type SectionBadgeProps, type SectionBadgeVariant, type SectionBadgeSize } from "./section-badge";
