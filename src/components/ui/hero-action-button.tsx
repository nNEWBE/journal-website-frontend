import React from "react";
import Link from "next/link";
import { ArrowUpRight, LucideIcon } from "lucide-react";

export type HeroActionButtonProps = {
  href?: string;
  target?: string;
  rel?: string;
  download?: boolean | string;
  variant?: "primary" | "secondary" | "white" | "dark" | "outline";
  children: React.ReactNode;
  hasArrow?: boolean;
  arrowRotateDeg?: number;
  icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
};

export function HeroActionButton({
  href,
  target,
  rel,
  download,
  variant = "primary",
  children,
  hasArrow = false,
  arrowRotateDeg = 0,
  icon: Icon,
  onClick,
  className = "",
}: HeroActionButtonProps) {
  const baseStyles =
    "inline-flex min-h-9 items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-sm focus-ring cursor-pointer";

  const variantStyles = {
    primary:
      "bg-amber-400 text-[color:var(--color-gb-blue-deep)] hover:bg-amber-300",
    secondary:
      "border border-white/15 bg-white/[0.06] font-semibold text-white hover:border-white/30 hover:bg-white/10",
    white:
      "bg-white text-[color:var(--color-gb-blue-deep)] hover:bg-blue-50",
    dark:
      "bg-[color:var(--color-gb-blue-deep)] text-white hover:bg-[color:var(--color-gb-blue)]",
    outline:
      "border border-slate-200/90 bg-white text-[color:var(--color-gb-blue-deep)] hover:border-slate-300 hover:bg-slate-50/80",
  };

  const combinedClasses = `${baseStyles} ${variantStyles[variant]} ${className}`;

  const content = (
    <>
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
      <span>{children}</span>
      {hasArrow && (
        <ArrowUpRight
          className="h-3.5 w-3.5 shrink-0 transition-transform duration-200"
          style={arrowRotateDeg ? { transform: `rotate(${arrowRotateDeg}deg)` } : undefined}
          aria-hidden="true"
        />
      )}
    </>
  );

  if (href) {
    const isExternal = href.startsWith("http") || href.endsWith(".pdf");
    if (isExternal || download || target) {
      return (
        <a
          href={href}
          target={target ?? (isExternal ? "_blank" : undefined)}
          rel={rel ?? (isExternal ? "noopener noreferrer" : undefined)}
          download={download}
          className={combinedClasses}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={combinedClasses}>
      {content}
    </button>
  );
}
