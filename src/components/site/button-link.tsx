import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonLinkVariant = "primary" | "secondary" | "tertiary" | "accent" | "inverse";

const VARIANT_CLASSES: Record<ButtonLinkVariant, string> = {
  // Light surfaces
  primary: "bg-gb-navy hover:bg-gb-navy-hover text-white px-5 py-3 font-semibold tracking-wide",
  secondary: "bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-5 py-3 font-semibold tracking-wide",
  tertiary: "bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 px-5 py-3 font-semibold tracking-wide",
  // Dark surfaces
  accent: "bg-amber-400 hover:bg-amber-300 text-gb-night px-6 py-3.5 font-bold uppercase tracking-wider shadow-sm",
  inverse: "bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 font-bold uppercase tracking-wider",
};

/** True for links that must not go through the Next router. */
export function isPlainHref(href: string) {
  return href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || /^https?:\/\//.test(href);
}

/**
 * The site's one call-to-action link. Primary/secondary/tertiary sit on light
 * surfaces, accent/inverse on the dark CTA band.
 */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  icon: Icon,
  iconPosition,
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonLinkVariant;
  icon?: LucideIcon;
  /** Defaults: trailing for primary/accent/inverse, leading for secondary/tertiary. */
  iconPosition?: "start" | "end";
  className?: string;
}) {
  const position = iconPosition ?? (variant === "secondary" || variant === "tertiary" ? "start" : "end");
  const iconClass = cn(
    variant === "accent" || variant === "inverse" ? "h-4 w-4" : "h-3.5 w-3.5",
    position === "start" && (variant === "secondary" || variant === "tertiary") && "text-slate-500"
  );
  const classes = cn(
    "inline-flex items-center gap-2 text-xs transition-colors",
    VARIANT_CLASSES[variant],
    className
  );
  const content = (
    <>
      {Icon && position === "start" && <Icon className={iconClass} />}
      <span>{children}</span>
      {Icon && position === "end" && <Icon className={iconClass} />}
    </>
  );
  const target = href || "#";
  return isPlainHref(target) ? (
    <a href={target} className={classes} target={/^https?:\/\//.test(target) ? "_blank" : undefined} rel={/^https?:\/\//.test(target) ? "noopener noreferrer" : undefined}>
      {content}
    </a>
  ) : (
    <Link href={target} className={classes}>
      {content}
    </Link>
  );
}
