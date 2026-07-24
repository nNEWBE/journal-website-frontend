import React from "react";
import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";

export type HeroActionButtonProps = {
  href?: string;
  variant?: "primary" | "secondary" | "white";
  children: React.ReactNode;
  hasArrow?: boolean;
  arrowRotateDeg?: number;
  icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
};

export function HeroActionButton({
  href,
  variant = "primary",
  children,
  hasArrow = false,
  arrowRotateDeg = -45,
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
      "bg-white text-[color:var(--color-gb-blue-deep)] hover:bg-amber-50",
  };

  const combinedClasses = `${baseStyles} ${variantStyles[variant]} ${className}`;

  const content = (
    <>
      {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
      <span>{children}</span>
      {hasArrow && (
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform duration-200"
          style={{ transform: `rotate(${arrowRotateDeg}deg)` }}
          aria-hidden="true"
        />
      )}
    </>
  );

  if (href) {
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
