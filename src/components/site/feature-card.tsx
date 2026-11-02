import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const GRID_COLUMNS = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

/** Responsive grid for `FeatureCard`s. */
export function FeatureGrid({
  columns = 3,
  children,
  className,
}: {
  columns?: 2 | 3 | 4;
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("grid grid-cols-1 gap-6", GRID_COLUMNS[columns], className)}>{children}</div>;
}

/**
 * Icon + title + text card used for principles, policies, benefits and similar lists.
 * Optional header row (eyebrow on the left, tag on the right), extra body content
 * (`children`) and a footer line. Titles are h3 — place cards under a band's SectionHeader (h2).
 */
export function FeatureCard({
  icon: Icon,
  iconStyle = "soft",
  eyebrow,
  tag,
  title,
  description,
  children,
  footer,
  muted = false,
  id,
  className,
}: {
  icon?: LucideIcon;
  /** soft = tinted tile with accent icon; solid = navy tile with white icon. */
  iconStyle?: "soft" | "solid";
  /** Small mono label top-left (e.g. "Policy 01"). */
  eyebrow?: string;
  /** Small uppercase label top-right (e.g. a category). */
  tag?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  /** Slate surface for use on white bands; white surface (default) for tint bands. */
  muted?: boolean;
  id?: string;
  className?: string;
}) {
  return (
    <div
      id={id}
      className={cn(
        "border border-slate-200/90 p-6 sm:p-7 flex flex-col shadow-2xs",
        muted ? "bg-slate-50/70" : "bg-white",
        id && "scroll-mt-24",
        className
      )}
    >
      {(eyebrow || tag) && (
        <div className="flex items-center justify-between gap-3 border-b border-slate-200/70 pb-3 mb-4">
          {eyebrow && <span className="font-mono text-xs font-bold text-gb-accent">{eyebrow}</span>}
          {tag && (
            <span className="ml-auto text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">{tag}</span>
          )}
        </div>
      )}

      <div className="flex items-start gap-3.5">
        {Icon && (
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center",
              iconStyle === "solid" ? "bg-gb-navy text-white" : "bg-slate-100 text-gb-accent"
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
        )}
        <div className="min-w-0">
          <h3 className="font-academic text-base sm:text-lg font-medium text-slate-950 leading-snug">{title}</h3>
          {description && <p className="mt-2 text-xs leading-relaxed text-slate-600">{description}</p>}
        </div>
      </div>

      {children && <div className="mt-5">{children}</div>}

      {footer && (
        <div className="mt-auto pt-5">
          <div className="pt-3 border-t border-slate-200/70">{footer}</div>
        </div>
      )}
    </div>
  );
}
