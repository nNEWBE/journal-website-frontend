import React from "react";
import { cn } from "@/lib/utils";

export type SectionBadgeVariant = "default" | "dark" | "gold" | "subtle";
export type SectionBadgeSize = "sm" | "md" | "lg";

export interface SectionBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  number?: string | number;
  label?: React.ReactNode;
  icon?: React.ElementType;
  variant?: SectionBadgeVariant;
  size?: SectionBadgeSize;
  children?: React.ReactNode;
}

const variantStyles: Record<
  SectionBadgeVariant,
  {
    wrapper: string;
    numberPill: string;
    label: string;
    icon: string;
  }
> = {
  default: {
    wrapper: "text-[color:var(--color-gb-blue-deep)]",
    numberPill:
      "border-slate-200/90 bg-white text-[color:var(--color-gb-blue-deep)] shadow-2xs",
    label: "text-[color:var(--color-gb-blue-deep)]",
    icon: "text-[color:var(--color-gb-blue)]",
  },
  dark: {
    wrapper: "text-white",
    numberPill:
      "border-white/20 bg-white/10 text-amber-300 backdrop-blur-xs",
    label: "text-amber-300",
    icon: "text-amber-300",
  },
  gold: {
    wrapper: "text-[color:var(--color-gb-gold-dark)]",
    numberPill:
      "border-amber-300/40 bg-amber-400/10 text-[color:var(--color-gb-gold-dark)] shadow-2xs",
    label: "text-[color:var(--color-gb-gold-dark)]",
    icon: "text-[color:var(--color-gb-gold-dark)]",
  },
  subtle: {
    wrapper: "text-slate-600",
    numberPill:
      "border-slate-200 bg-slate-50 text-slate-600",
    label: "text-slate-600",
    icon: "text-slate-500",
  },
};

const sizeStyles: Record<
  SectionBadgeSize,
  {
    wrapper: string;
    numberPill: string;
    label: string;
    icon: string;
  }
> = {
  sm: {
    wrapper: "gap-2",
    numberPill: "h-6 w-6 text-[10px]",
    label: "text-[10px] tracking-[0.16em]",
    icon: "h-3 w-3",
  },
  md: {
    wrapper: "gap-2.5",
    numberPill: "h-7 w-7 text-[11px]",
    label: "text-[11px] tracking-[0.18em]",
    icon: "h-3.5 w-3.5",
  },
  lg: {
    wrapper: "gap-3",
    numberPill: "h-8 w-8 text-xs",
    label: "text-xs tracking-[0.2em]",
    icon: "h-4 w-4",
  },
};

export function SectionBadge({
  number,
  label,
  icon: Icon,
  variant = "default",
  size = "md",
  children,
  className,
  ...props
}: SectionBadgeProps) {
  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];
  const textContent = label ?? children;

  const formattedNumber =
    typeof number === "number" ? String(number).padStart(2, "0") : number;

  return (
    <div
      className={cn(
        "inline-flex items-center select-none",
        currentSize.wrapper,
        currentVariant.wrapper,
        className
      )}
      {...props}
    >
      {formattedNumber && (
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full border font-mono font-bold leading-none",
            currentSize.numberPill,
            currentVariant.numberPill
          )}
        >
          {formattedNumber}
        </span>
      )}

      {Icon && (
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full border",
            currentSize.numberPill,
            currentVariant.numberPill
          )}
        >
          <Icon className={cn(currentSize.icon, currentVariant.icon)} />
        </span>
      )}

      {textContent && (
        <span
          className={cn(
            "font-extrabold uppercase",
            currentSize.label,
            currentVariant.label
          )}
        >
          {textContent}
        </span>
      )}
    </div>
  );
}

// Alias for convenience
export const NumberedBadge = SectionBadge;
