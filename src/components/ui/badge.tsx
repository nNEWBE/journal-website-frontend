import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "success" | "warning" | "error" | "info";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  showDot?: boolean;
  pulseDot?: boolean;
  icon?: React.ReactNode;
}

export function Badge({
  variant = "default",
  children,
  className,
  showDot = false,
  pulseDot = false,
  icon,
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-slate-100 text-slate-700 border-slate-200/60",
    info: "bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue-dark)] border-[color:var(--color-gb-border)]",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    warning: "bg-amber-50 text-amber-800 border-amber-200/60",
    error: "bg-red-50 text-red-700 border-red-200/60",
  };

  const dotColors: Record<BadgeVariant, string> = {
    default: "bg-slate-400",
    info: "bg-[color:var(--color-gb-blue)]",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-red-500",
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
      {showDot && !icon && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full shrink-0",
            dotColors[variant],
            pulseDot && "animate-pulse"
          )}
        />
      )}
      <span>{children}</span>
    </span>
  );
}
