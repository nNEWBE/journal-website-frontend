import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "red"
  | "gold"
  | "blue"
  | "emerald"
  | "secondary"
  | "white"
  | "dark"
  | "outline"
  | "ghost";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  href?: string;
  target?: string;
  rel?: string;
  download?: boolean | string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconBox?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Button({
  href,
  target,
  rel,
  download,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconBox = false,
  children,
  className = "",
  type = "button",
  onClick,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "group inline-flex items-center justify-center gap-2.5 rounded-xl font-extrabold transition-all duration-200 shadow-xs focus-ring cursor-pointer select-none active:scale-[0.98]";

  const sizeStyles: Record<ButtonSize, string> = {
    sm: "min-h-9 px-3.5 text-[11px]",
    md: "min-h-11 px-5 text-xs",
    lg: "min-h-12 px-6 text-sm",
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-[color:var(--color-gb-blue)] text-white hover:bg-blue-600 shadow-md",
    red: "bg-[#ee2b33] text-white hover:bg-[#ff4d54] shadow-md",
    gold: "bg-[#de8f1b] text-white hover:bg-[#f4a228] shadow-md",
    blue: "bg-[#1f2f82] text-white hover:bg-[#2d41a7] border border-blue-400/40 shadow-md",
    emerald: "bg-emerald-600 text-white hover:bg-emerald-500 shadow-md",
    secondary: "border border-white/20 bg-white/[0.08] text-white backdrop-blur-md hover:bg-white/20",
    white: "bg-white text-[color:var(--color-gb-blue-deep)] hover:bg-blue-50 shadow-md",
    dark: "bg-[color:var(--color-gb-blue-deep)] text-white hover:bg-[#1c2a6b] shadow-md",
    outline: "border border-slate-200 bg-white text-slate-800 hover:bg-slate-100 hover:border-slate-300",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100/80 shadow-none",
  };

  const iconBoxStyles: Record<ButtonVariant, string> = {
    primary: "bg-white/20 text-white group-hover:bg-white group-hover:text-[color:var(--color-gb-blue)]",
    red: "bg-white/20 text-white group-hover:bg-white group-hover:text-[#ee2b33]",
    gold: "bg-white/20 text-white group-hover:bg-white group-hover:text-[#de8f1b]",
    blue: "bg-white/20 text-white group-hover:bg-white group-hover:text-[#1f2f82]",
    emerald: "bg-white/20 text-white group-hover:bg-white group-hover:text-emerald-700",
    secondary: "bg-white/15 text-white group-hover:bg-white group-hover:text-slate-900",
    white: "bg-blue-50 text-[color:var(--color-gb-blue-deep)] group-hover:bg-[color:var(--color-gb-blue-deep)] group-hover:text-white",
    dark: "bg-white/20 text-white group-hover:bg-white group-hover:text-[color:var(--color-gb-blue-deep)]",
    outline: "bg-slate-100 text-slate-700 group-hover:bg-slate-200",
    ghost: "bg-slate-200/60 text-slate-700",
  };

  const combinedClasses = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    disabled && "opacity-50 pointer-events-none shadow-none",
    className
  );

  const content = (
    <>
      {Icon && (
        iconBox ? (
          <span
            className={cn(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg shadow-2xs transition-colors duration-200",
              iconBoxStyles[variant]
            )}
          >
            <Icon className="h-3.5 w-3.5" />
          </span>
        ) : (
          <Icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
        )
      )}
      <span>{children}</span>
    </>
  );

  if (href && !disabled) {
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
    <button type={type} onClick={onClick} disabled={disabled} className={combinedClasses} {...props}>
      {content}
    </button>
  );
}
